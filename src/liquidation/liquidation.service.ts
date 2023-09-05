import { Injectable, Logger } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { BigNumber } from 'ethers';
import { Interval } from '@nestjs/schedule';
import { BaseService } from 'src/base/base.service';
import { Hash } from 'crypto';

export interface Position {
  ledger: string,
  user: string,
  ratio: number  
}

enum State {
  LOW,
  MEDIUM,
  HIGH,
  DEAD
}

@Injectable()
export class LiquidationService {
  private readonly logger = new Logger(LiquidationService.name);

  private highQueue: Position[];
  private mediumQueue: Position[];
  private lowQueue: Position[];

  private positions: Set<string>;

  private liquidationThreshold: number;
  private highThreshold: number;
  private mediumThreshold: number;

  private ledgers: Map<string, string>;

  private uledgerWarning: Map<string, Date>;

  constructor(
    private readonly ethereumService: EthereumService,
    private readonly baseService: BaseService
  ) {
    this.liquidationThreshold = -0.95;
    this.highThreshold = -0.76;
    this.mediumThreshold = -0.5;

    this.highQueue = [];
    this.mediumQueue = [];
    this.lowQueue = [];

    this.positions = new Set<string>();
    this.uledgerWarning = new Map<string, Date>();

    this.loadNewPostion();
    this.ledgers = new Map<string, string>();
    this.ethereumService.allLedgers().then((ledgers) => {
      const ids = ledgers[0];
      const names = ledgers[1];
      for(let i = 0; i < ids.length; i++) {
        console.log(ids[i].toString());
        this.ledgers.set(ids[i].toString(), names[i]);
      }
      console.log(this.ledgers);
      console.log(this.ledgers.get('0'));
    });
  }

  private async inspect(ledger: BigNumber, user: string, position: Position) {
    const ratioBN = await this.ethereumService.getLiquidationRatio(ledger, user);
    if(!ratioBN) {
      return State.LOW;
    }
    const ratioBNormal = ratioBN.div(BigNumber.from(10).pow(14));
    const ratio = ratioBNormal.toNumber() / 10000;
    position.ratio = ratio;
    this.logger.log(`Inspecting ${ledger.toString()}-${user}-${ratioBN}-${ratio}`);
    if(ratio <= this.liquidationThreshold) {
      return State.DEAD;
    } else if(ratio <= this.highThreshold) {
      return State.HIGH;
    } else if(ratio <= this.mediumThreshold) {
      return State.MEDIUM;
    } else {
      return State.LOW;
    }
  }

  private async process(state: State, position: Position) {
    if(state === State.DEAD) {
      const result = await this.ethereumService.liquidate(BigNumber.from(position.ledger), position.user);
      if(result) {
        this.positions.delete(`${position.user}-${position.ledger}`);
        this.baseService.liquidation(position.user, this.ledgers.get(position.ledger), new Date().toDateString());
      }
      console.log(`Process liquidation ${position.ledger} ${position.user}: [${result}].`);
    } else if(state === State.HIGH) {
      const now = new Date();
      const key = `${position.user}-${position.ledger}`;
      if(this.uledgerWarning.has(key)) {
        const last = this.uledgerWarning.get(key);
        if(now.getTime() - last.getTime() > 20 * 60 * 1000) {
          this.uledgerWarning.set(key, now);
          this.baseService.warning(position.user, this.ledgers.get(position.ledger));
        }
      } else {
        this.uledgerWarning.set(key, now);
        this.baseService.warning(position.user, this.ledgers.get(position.ledger));
      }
      this.highQueue.push(position);
      console.log(`Process High ${position.ledger} ${position.user}.`);
    } else if(state === State.MEDIUM) {
      this.mediumQueue.push(position);
    } else {
      this.lowQueue.push(position);
    }
  }

  private async baseInspection(queue: Array<Position>, rawState: State) {
    this.logger.log(`${rawState} Queue checking with length: ${queue.length}.`);
    const start = new Date().getTime();
    const newQueue: Array<Position> = [];
    for(const pos of queue) {
      const state = await this.inspect(BigNumber.from(pos.ledger), pos.user, pos);
      this.logger.log(`Inspecting after ${pos.user}-${pos.ledger}-${state}-${this.ledgers.get(pos.ledger)}`);
      if(state !== rawState) {
        this.process(state, pos);
      } else {
        newQueue.push(pos);
      }
    }
    
    this.logger.log(`${rawState} Queue checking with length: ${queue.length}, Cost: ${new Date().getTime() - start}.`);
    return newQueue;
  }

  // load every Two Hour
  @Interval(600 * 1000)
  async loadNewPostion() {
    const ledgers = await this.ethereumService.getAllLedgers();
    for(const ledger of ledgers) {
      const users = await this.ethereumService.getLedgerUsers(ledger);
      for(const user of users) {
        console.log(`Loading ${ledger} & ${user} from Jungle Protocol.`);
        const position: Position = { ledger: ledger.toString(), user, ratio: 0.0 };
        const key = `${user}-${ledger.toString()}`;
        this.logger.log(`Porcessing ${key}`);
        if(!this.positions.has(key)) {
          this.positions.add(key);
          const state = await this.inspect(ledger, user, position);
          await this.process(state, position);
        }
      }
    }
    this.logger.log(`High queue size: ${this.highQueue.length}`);
    this.logger.log(`Medium queue size: ${this.mediumQueue.length}`);
    this.logger.log(`Low queue size: ${this.lowQueue.length}`);
  }

  // route every 5 mins
  @Interval(300 * 1000)
  async highInspection() {
    const newQueue = await this.baseInspection(this.highQueue, State.HIGH);
    this.highQueue = newQueue;
  }

  // route every 10 mins
  @Interval(500 * 1000)
  async mediumInspection() {
    const newQueue = await this.baseInspection(this.mediumQueue, State.MEDIUM);
    this.mediumQueue = newQueue;
  }

  // route every 15 mins
  @Interval(700 * 1000)
  async lowInspection() {
    const newQueue = await this.baseInspection(this.lowQueue, State.LOW);
    this.lowQueue = newQueue;
  }

  async manualTrigger(state: string) {
    if(State.HIGH.toString() === state) {
      this.highInspection();
    } else if(State.MEDIUM.toString() === state) {
      this.mediumInspection();
    } else if(State.LOW.toString() === state) {
      this.lowInspection();
    } else {
      this.logger.log(`State ${state} is not equal to any.`);
    }
  }

  async getQueueInfo(state: string) {
    if(State.HIGH.toString() === state) {
      return this.highQueue;
    } else if(State.MEDIUM.toString() === state) {
      return this.mediumQueue;
    } else if(State.LOW.toString() === state) {
      return this.lowQueue;
    } else {
      this.logger.log(`State ${state} is not equal to any. ${State.HIGH.toString()}`);
      return [];
    }
  }
}
