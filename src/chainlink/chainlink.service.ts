import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { contractBTC } from './chainlink.config';
import { Prices } from './chainlink.entiry';
import { Repository, InsertResult } from 'typeorm';

@Injectable()
export class ChainlinkService {
  private readonly logger = new Logger(ChainlinkService.name);
  private intervalRunning: boolean;

  constructor(
    @InjectRepository(Prices)
    private pricesRepository: Repository<Prices>,
  ) {}

  findAll(): Promise<Prices[]> {
    return this.pricesRepository.find();
  }

  findOne(_id: number): Promise<Prices | null> {
    return this.pricesRepository
    .createQueryBuilder('user')
    .where({id: _id})
    .getOne();
  }

  findOne2(id: number): Promise<Prices | null> {
    return this.pricesRepository.findOne(
      { where: { id }}
    );
  }

  insertMany(prices: Prices[]): Promise<InsertResult> {
    return this.pricesRepository.insert(prices);
  }

  saveData(round: any, tokenName: string) {
    console.log(round.roundId.toString());
    // console.log(round.answer.toString());
    // console.log(round.startedAt.toString());
    // console.log(round.updatedAt.toString());
    // console.log(round.answeredInRound);
    // console.log(new Date(round.startedAt.toNumber() * 1000));
    // console.log(new Date(round.updatedAt.toNumber() * 1000));
    const price = new Prices();
    price.tokenName = tokenName;
    price.roundId = round.roundId.toString();
    price.answer = round.answer.toString();
    price.startedAt = round.startedAt.toString();
    price.updatedAt = round.updatedAt.toString();
    price.answeredInRound = round.answeredInRound.toString();
    this.insertMany([price]);
  }

  @Interval(10000)
  async handleInterval() {
    if(this.intervalRunning) {
      this.logger.log('Interval is running.');
      return;
    }
    this.intervalRunning = true;
    // ============= service start ============== //
    await this.callChainlinkPrices();
    // =============  service end  ============== //
    this.intervalRunning = false;
  }

  async callChainlinkPrices() {
    const lastRound = await contractBTC.latestRoundData();
    const roundId = BigInt(lastRound.roundId);
    const bias = BigInt("0xFFFFFFFFFFFFFFFF");
  
    const phrase = Number(roundId >> BigInt(64));
    const aggRoundId = Number(roundId & bias);

    // get start roundId from database
    let roundDatas = [];
    for(let i = aggRoundId; i > 0; i--) {
      const tmpRoundId = (BigInt(phrase) << BigInt(64)) | BigInt(i);
      const res = contractBTC.getRoundData(tmpRoundId);
      roundDatas.push(res);
      if(roundDatas.length === 10) {
        const datasRes = await Promise.all(roundDatas);
        for(const data of datasRes) {
          // printData(data);
          // console.log(``);
          this.saveData(data, 'BTC');
        }
        roundDatas = [];
        console.log(i, new Date());
      }
    }

  }
}
