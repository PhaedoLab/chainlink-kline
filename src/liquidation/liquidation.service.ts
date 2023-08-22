import { Injectable, Logger } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { BigNumber } from 'ethers';
import { Interval } from '@nestjs/schedule';

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

  constructor(private readonly ethereumService: EthereumService) {
    this.liquidationThreshold = -0.95;
    this.highThreshold = -0.8;
    this.mediumThreshold = -0.6;

    this.highQueue = [];
    this.mediumQueue = [];
    this.lowQueue = [];

    this.positions = new Set<string>();

    this.loadNewPostion();
  }

  private async inspect(ledger: BigNumber, user: string, position: Position) {
    const ratioBN = await this.ethereumService.getLiquidationRatio(ledger, user);
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
      await this.ethereumService.liquidate(BigNumber.from(position.ledger), position.user);
    } else if(state === State.HIGH) {
      this.highQueue.push(position);
    } else if(state === State.MEDIUM) {
      this.mediumQueue.push(position);
    } else {
      this.lowQueue.push(position);
    }
  }

  // load every Two Hour
  @Interval(600 * 1000)
  async loadNewPostion() {
    const ledgers = await this.ethereumService.getAllLedgers();
    for(const ledger of ledgers) {
      const users = await this.ethereumService.getLedgerUsers(ledger);
      for(const user of users) {
        console.log(`Loading ${ledger} & ${user} from Jungle Protocol.`);
        const position: Position = { ledger, user, ratio: 0.0 };
        const key = `${user}-${ledger}`;
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

  private async baseInspection(queue: Array<Position>, rawState: State) {
    this.logger.log(`${rawState} Queue checking with length: ${queue.length}.`);
    const start = new Date().getTime();
    for(const pos of queue) {
      const state = await this.inspect(BigNumber.from(pos.ledger), pos.user, pos);
      if(state !== rawState) {
        this.process(state, pos);
      }
    }
    this.logger.log(`${rawState} Queue checking with length: ${queue.length}, Cost: ${new Date().getTime() - start}.`);
  }

  // route every 10 mins
  @Interval(600 * 1000)
  highInspection() {
    this.baseInspection(this.highQueue, State.HIGH);
  }

  // route every 30 mins
  @Interval(600 * 1000)
  mediumInspection() {
    this.baseInspection(this.mediumQueue, State.MEDIUM);
  }

  // route every 60 mins
  @Interval(600 * 1000)
  lowInspection() {
    this.baseInspection(this.lowQueue, State.LOW);
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
