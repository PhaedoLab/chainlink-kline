import { Injectable, Logger } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { BigNumber } from 'ethers';

interface Position {
  ledger: BigNumber,
  user: string,
  ratio: BigNumber  
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

  private async inspect(ledger: BigNumber, user: string) {
    const ratioBN = await this.ethereumService.getLiquidationRatio(ledger, user);
    const ratioBNormal = ratioBN.div(BigNumber.from(10).pow(14));
    const ratio = ratioBNormal.toNumber() / 10000;
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
      await this.ethereumService.liquidate(position.ledger, position.user);
    } else if(state === State.HIGH) {
      this.highQueue.push(position);
    } else if(state === State.MEDIUM) {
      this.mediumQueue.push(position);
    } else {
      this.lowQueue.push(position);
    }
  }

  // load every One Hour
  async loadNewPostion() {
    const ledgers = await this.ethereumService.getAllLedgers();
    for(const ledger of ledgers) {
      const users = await this.ethereumService.getLedgerUsers(ledger);
      for(const user of users) {
        const position: Position = { ledger, user, ratio: BigNumber.from(0.0) };
        const key = `${user}-${ledger}`;
        this.logger.log(`Porcessing ${key}`);
        if(!this.positions.has(key)) {
          this.positions.add(key);
          const state = await this.inspect(ledger, user);
          await this.process(state, position);
        }
      }
    }
    this.logger.log(`High queue size: ${this.highQueue.length}`);
    this.logger.log(`Medium queue size: ${this.mediumQueue.length}`);
    this.logger.log(`Low queue size: ${this.lowQueue.length}`);
  }

  private async baseInspection(queue: Array<Position>, rawState: State) {
    for(const pos of queue) {
      const state = await this.inspect(pos.ledger, pos.user);
      if(state !== rawState) {
        this.process(state, pos);
      }
    }
  }

  // route every 10 mins  
  highInspection() {
    this.baseInspection(this.highQueue, State.HIGH);
  }

  // route every 30 mins
  mediumInspection() {
    this.baseInspection(this.mediumQueue, State.MEDIUM);
  }

  // route every 60 mins
  lowInspection() {
    this.baseInspection(this.lowQueue, State.LOW);
  }

  async test() {
    const res = await this.ethereumService.getLedgerUsers(BigNumber.from(1));
    console.log(res);
  }
}
