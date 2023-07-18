import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { contractBTC, contractETH, contractLINK } from './chainlink.config';
import { Period, Prices } from './chainlink.entiry';
import { Repository, InsertResult } from 'typeorm';
import { ethers } from 'ethers';

@Injectable()
export class ChainlinkService {
  private readonly logger = new Logger(ChainlinkService.name);
  private intervalRunning: boolean;
  private lastestPrice: Map<string, Prices>;
  private tokenNames: Array<string>;
  private periods: Array<string>;
  private tPeriodPositions: Map<string, Map<string, object>>;

  constructor(
    @InjectRepository(Prices)
    private pricesRepository: Repository<Prices>,
    @InjectRepository(Period)
    private periodRepository: Repository<Period>,
  ) {
    this.intervalRunning = false;
    this.tokenNames = ['BTC', 'ETH', 'LINK'];
    this.periods = ['5m', '15m', '1h', '4h', '1d'];
    this.lastestPrice = new Map<string, Prices>();
    this.tPeriodPositions = new Map<string, Map<string, object>>();
    this.initPeriodPostions();
  }

  async initPeriodPostions() {
    for(const tokenName of this.tokenNames) {
      const price: Prices = await this.findLastestPrice(tokenName);
      this.lastestPrice.set(tokenName, price);
      
      const periodPositions = new Map<string, object>();
      for(const period of this.periods) {
        const candles = await this.findLastestCandles(tokenName, period, 1);
        let open: string;
        if(candles.length === 1) {
          open = '' + candles[0].c;
        } else {
          const price = await this.findStartPrice(tokenName);
          open = price.answer;
        }

        const startAt = this.getStartTime(period);
        console.log(tokenName, period, startAt);
        const high = await this.findMaxMinPrices(tokenName, startAt / 1000, true);
        const low = await this.findMaxMinPrices(tokenName, startAt / 1000, false);
        const obj = {
          'h': high ? high.answer: '0',
          'l': low ? low.answer: '0',
          'o': open,
          'c': price.answer
        };
        periodPositions.set(period, obj);
        console.log(obj);
      }
      this.tPeriodPositions.set(tokenName, periodPositions);
    }
  }

  getStartTime(period: string) {
    const date = new Date();
    const min = date.getMinutes();
    const hour = date.getHours(); // (0-23)
    const sec = date.getSeconds();
    let timestamp: number;
    if(period === '5m') {
      timestamp = date.getTime() - ((min % 5) * 60 * 1000 + sec * 1000);
    } else if(period === '15m') {
      timestamp = date.getTime() - ((min % 15) * 60 * 1000 + sec * 1000);
    } else if(period === '1h') {
      timestamp = date.getTime() - ((min % 60) * 60 * 1000 + sec * 1000);
    } else if(period === '4h') {
      timestamp = date.getTime() - ((hour % 4) * 3600 * 1000 + min * 60 * 1000 + sec * 1000);
    } else if(period === '1d') {
      timestamp = date.getTime() - ((hour % 24) * 3600 * 1000 + min * 60 * 1000 + sec * 1000);
    }
    return timestamp;
  }

  @Interval(10000)
  async handleInterval() {
    if(this.intervalRunning) {
      this.logger.log('Interval is running.');
      return;
    }
    this.intervalRunning = true;
    // ============= service start ============== //
    for(const tokenName of this.tokenNames) {
      try {
        await this.callChainlinkPrices(tokenName);
      } catch(err) {
        this.logger.log(err);
      }
    }
    // =============  service end  ============== //
    this.intervalRunning = false;
  }

  private async callChainlinkPrices(tokenName: string) {
    let contract: ethers.Contract;
    if(tokenName === 'BTC') {
      contract = contractBTC;
    } else if(tokenName === 'ETH') {
      contract = contractETH;
    } else if(tokenName === 'LINK') {
      contract = contractLINK;
    } else {
      throw "Bad Token Name.";
    }
    const lastRound = await contract.latestRoundData();
    
    const roundId = BigInt(lastRound.roundId);
    const bias = BigInt("0xFFFFFFFFFFFFFFFF");
  
    const phrase = Number(roundId >> BigInt(64));
    const aggRoundId = Number(roundId & bias);
    // this.logger.log(`${phrase}, ${aggRoundId}, ${tokenName}, '\n'`);

    // get start roundId from database
    let roundDatas = [];
    const lastPrice = this.lastestPrice.get(tokenName);
    const price = this._buildData(lastRound, tokenName);
    // only save the lastest price
    if(!lastPrice) {
      this.logger.log(`First price inserted.`);
      this.insertManyPrices([price]);
      // update price after this round
      this.lastestPrice.set(tokenName, price);
      return;
    }
    
    const startAggRoundId = Number(BigInt(lastPrice.roundId) & bias);
    if(startAggRoundId >= aggRoundId) {
      this.logger.log(`${tokenName} startAggRoundId is bigger than aggRoundId, Jump Out.`);
      return;
    }
    for(let i = startAggRoundId + 1; i <= aggRoundId; i++) {
      const tmpRoundId = (BigInt(phrase) << BigInt(64)) | BigInt(i);
      const res = contract.getRoundData(tmpRoundId);
      roundDatas.push(res);
      if(roundDatas.length === 10) {
        const datasRes = await Promise.all(roundDatas);
        for(const data of datasRes) {
          this.saveData(data, tokenName);
          await this._buildAllCandles(tokenName, data.startedAt);
          this.lastestPrice.set(tokenName, this._buildData(data, tokenName));
        }
        roundDatas = [];
        // this.logger.log(`${i}, ${new Date()}`);
      }
    }
    if(roundDatas.length !== 0) {
      const datasRes = await Promise.all(roundDatas);
      for(const data of datasRes) {
        this.saveData(data, tokenName);
        await this._buildAllCandles(tokenName, data.startedAt);
        this.lastestPrice.set(tokenName, this._buildData(data, tokenName));
      }
      roundDatas = [];
    }

    // update price after this round
    this.lastestPrice.set(tokenName, price);
  }

  // ========================= //
  // builders                  //
  // ========================= //

  private _buildData(round: any, tokenName: string): Prices {
    const price = new Prices();
    price.tokenName = tokenName;
    price.roundId = round.roundId.toString();
    price.answer = round.answer.toString();
    price.startedAt = round.startedAt.toString();
    price.updatedAt = round.updatedAt.toString();
    price.answeredInRound = round.answeredInRound.toString();

    const phrase = Number(BigInt(round.roundId) >> BigInt(64));
    const bias = BigInt("0xFFFFFFFFFFFFFFFF");
    const aggRoundId = BigInt(round.roundId) & bias;
    price.phrase = phrase.toString();
    price.aggRoundId = aggRoundId.toString();
    return price;
  }

  private _buildPeriod(position: number[], timestamp: number, 
      pd: string, tokenName: string): Period {
    const period = new Period();
    period.o = position[0];
    period.c = position[1];
    period.h = position[2];
    period.l = position[3];
    period.t = timestamp.toString();
    period.period = pd;
    period.tokenName = tokenName;
    return period;
  }

  // ========================= //
  // mysql utils for prices    //
  // ========================= //

  findOne(_id: number): Promise<Prices | null> {
    return this.pricesRepository
      .createQueryBuilder('price')
      .where(`price.`)
      .getOne();
  }
  
  findBundlePrices(tokenName: string, startAt: number, endAt: number): Promise<Prices[]> {
    return this.pricesRepository
      .createQueryBuilder('price')
      .where(`price.token_name = :tokenName AND price.started_at >= :startAt AND price.started_at < :endAt`, 
        { tokenName: tokenName, startAt: startAt, endAt: endAt })
      .orderBy('price.id', 'ASC')
      .getMany();
  }

  findStartPrice(tokenName: string): Promise<Prices> {
    return this.pricesRepository
      .createQueryBuilder('price')
      .where(`price.token_name = :tokenName`, 
        { tokenName: tokenName })
      .orderBy('price.id', 'ASC')
      .getOne();
  }

  findMaxMinPrices(tokenName: string, startAt: number, high: boolean): Promise<Prices> {
    const order = high? 'DESC': 'ASC';
    return this.pricesRepository
      .createQueryBuilder('price')
      .where(`price.token_name = :tokenName AND price.started_at >= :startAt`, 
        { tokenName: tokenName, startAt: startAt })
      .orderBy('price.answer', order)
      .getOne();
  }

  findLastestPrice(tokenName: string): Promise<Prices | null> {
    return this.pricesRepository
      .createQueryBuilder('price')
      .where("price.token_name = :tokenName", { tokenName: tokenName })
      .orderBy('price.id', 'DESC')
      .limit(1)
      .getOne();
  }

  insertManyPrices(prices: Prices[]): Promise<InsertResult> {
    return this.pricesRepository.insert(prices);
  }

  saveData(round: any, tokenName: string) {
    const prices = [this._buildData(round, tokenName)];
    this.insertManyPrices(prices);
  }

  // ========================= //
  // mysql utils for period    //
  // ========================= //

  findBundleCandles(tokenName: string, period: string, startAt: number, endAt: number): Promise<Period[]> {
    return this.periodRepository
      .createQueryBuilder('period')
      .where(`period.token_name = :tokenName AND period.period = :period AND period.t >= :startAt AND period.t < :endAt`, 
        { tokenName: tokenName, period, startAt: startAt, endAt: endAt })
      .orderBy('period.t', 'ASC')
      .getMany();
  }

  findLastestCandles(tokenName: string, period: string, limit: number): Promise<Period[]> {
    return this.periodRepository
      .createQueryBuilder('period')
      .where(`period.token_name = :tokenName AND period.period = :period`, 
        { tokenName: tokenName, period: period })
      .orderBy('period.t', 'DESC')
      .limit(limit)
      .getMany();
  }

  findOneCandle(tokenName: string, period: string, timestamp: number): Promise<Period> {
    return this.periodRepository
      .createQueryBuilder('period')
      .where(`period.token_name = :tokenName AND period.period = :period AND period.t =:t`, 
        { tokenName: tokenName, period: period, t: timestamp})
      .getOne();
  }

  insertManyCandles(periods: Period[]): Promise<InsertResult> {
    return this.periodRepository.insert(periods);
  }

  // ========================= //
  //      build candles        //
  // ========================= //

  async _buildAllCandles(tokenName: string, currentTime: number) {
    const price = this.lastestPrice.get(tokenName);
    const lastTime = Number(price.startedAt);
    // whether currentTime is valid
    const lastDate = new Date(lastTime * 1000);
    const currentDate = new Date(currentTime * 1000);

    await this._build5MCandles(tokenName, lastDate, currentDate, price);
    await this._build15MCandles(tokenName, lastDate, currentDate, price);
    await this._build1HCandles(tokenName, lastDate, currentDate, price);
    await this._build4HCandles(tokenName, lastDate, currentDate, price);
    await this._build1DCandles(tokenName, lastDate, currentDate, price);
  }

  async _build5MCandles(tokenName: string, lastDate: Date, currentDate: Date, price: Prices) {
    const lastMin = lastDate.getMinutes();
    const currentMin = currentDate.getMinutes(); // (0-59)

    let start: number, end: number, timestamp: number;
    const year = lastDate.getFullYear(); // (yyyy)
    const month = lastDate.getMonth(); //  (0-11)
    const day = lastDate.getDate(); // (1-31)
    const hour = lastDate.getHours(); // (0-23)
    const lpos = this.tPeriodPositions.get(tokenName).get('5m');
    if(lastMin >= 0 && lastMin < 5 && currentMin >= 5 && currentMin < 10) {
      // 5m  1 <= time < 6
      const endDate = new Date(year, month, day, hour, 5, 0);
      end = endDate.getTime();
    } else if(lastMin >= 5 && lastMin < 10 && currentMin >= 10 && currentMin < 15) {
      // 5m
      const endData = new Date(year, month, day, hour, 10, 0);
      end = endData.getTime();
    } else if( lastMin >= 10 && lastMin < 15 && currentMin >= 15 && currentMin < 20) {
      // 5m 15m
      const endData = new Date(year, month, day, hour, 15, 0);
      end = endData.getTime();
    } else if(lastMin >= 15 && lastMin < 20 && currentMin >= 20 && currentMin < 25) {
      // 5m
      const endData = new Date(year, month, day, hour, 20, 0);
      end = endData.getTime();
    } else if(lastMin >= 20 && lastMin < 25 && currentMin >= 25 && currentMin < 30) {
      // 5m
      const endData = new Date(year, month, day, hour, 25, 0);
      end = endData.getTime();
    } else if(lastMin >= 25 && lastMin < 30 && currentMin >= 30 && currentMin < 35) {
      // 5m 15m
      const endData = new Date(year, month, day, hour, 30, 0);
      end = endData.getTime();
    } else if(lastMin >= 30 && lastMin < 35 && currentMin >= 35 && currentMin < 40) {
      // 5m
      const endData = new Date(year, month, day, hour, 35, 0);
      end = endData.getTime();
    } else if(lastMin >= 35 && lastMin < 40 && currentMin >= 40 && currentMin < 45) {
      // 5m
      const endData = new Date(year, month, day, hour, 40, 0);
      end = endData.getTime();
    } else if(lastMin >= 40 && lastMin < 45 && currentMin >= 45 && currentMin < 50) {
      // 5m 15m
      const endData = new Date(year, month, day, hour, 45, 0);
      end = endData.getTime();
    } else if(lastMin >= 45 && lastMin < 50 && currentMin >= 50 && currentMin < 55) {
      // 5m
      const endData = new Date(year, month, day, hour, 50, 0);
      end = endData.getTime();
    } else if(lastMin >= 50 && lastMin < 55 && currentMin >= 55 && currentMin < 60) {
      // 5m
      const endData = new Date(year, month, day, hour, 55, 0);
      end = endData.getTime();
    } else if(lastMin >= 55 && lastMin < 60 && currentMin >= 0 && currentMin < 5) {
      // 5m 15m 1h 4h 1d
      const endData = new Date(year, month, day, hour + 1, 0, 0);
      end = endData.getTime();
    } else {
      lpos['l'] =  (lpos['l'] === '0') ? price.answer: (price.answer < lpos['l'] ? price.answer: lpos['l']);
      lpos['h'] = price.answer > lpos['h'] ? price.answer: lpos['h'];
      lpos['c'] = price.answer;
      
      return;
    }
    console.log(`Fit ${tokenName} 5 intervals. ${lastDate}, ${currentDate}`);
    start = end - (5 * 60 * 1000);
    timestamp = start;
    
    const prices = await this.findBundlePrices(tokenName, Math.round(start / 1000), Math.round(end / 1000));
    if(prices.length === 0) {
      this.logger.log(`Prices length is zero.`);
      return;
    }
    const lastCandle = await this.findOneCandle(tokenName, '5m', start - (5 * 60 * 1000));
    const position = this._get5MCandlePosition(prices, lastCandle);
    // insert position
    const period = this._buildPeriod(position, timestamp, '5m', tokenName);
    await this.insertManyCandles([period]);
    lpos['o'] = period.c;
    lpos['h'] = '0';
    lpos['l'] = '0';
    lpos['c'] = '0';

    return {
      start, end, timestamp
    }
  }

  async _build15MCandles(tokenName: string, lastDate: Date, currentDate: Date, price: Prices) {
    const lastMin = lastDate.getMinutes();
    const currentMin = currentDate.getMinutes();

    let start: number, end: number, timestamp: number;
    const year = lastDate.getFullYear();
    const month = lastDate.getMonth();
    const day = lastDate.getDate();
    const hour = lastDate.getHours();
    const lpos = this.tPeriodPositions.get(tokenName).get('15m')
    if( lastMin >= 10 && lastMin < 15 && currentMin >= 15 && currentMin < 20) {
      // 1 <= time < 16
      const endData = new Date(year, month, day, hour, 15, 0);
      end = endData.getTime();
    } else if(lastMin >= 25 && lastMin < 30 && currentMin >= 30 && currentMin < 35) {
      // 16 <= time < 31
      const endData = new Date(year, month, day, hour, 30, 0);
      end = endData.getTime();
    } else if(lastMin >= 40 && lastMin < 45 && currentMin >= 45 && currentMin < 50) {
      // 31 <= time < 46
      const endData = new Date(year, month, day, hour, 45, 0);
      end = endData.getTime();
    } else if(lastMin >= 55 && lastMin < 60 && currentMin >= 0 && currentMin < 5) {
      //  46 <= time < 60 || time < 1
      const endData = new Date(year, month, day, hour + 1, 0, 0);
      end = endData.getTime();
    } else {
      lpos['l'] =  (lpos['l'] === '0') ? price.answer: (price.answer < lpos['l'] ? price.answer: lpos['l']);
      lpos['h'] = price.answer > lpos['h'] ? price.answer: lpos['h'];
      lpos['c'] = price.answer;

      return;
    }
    start = end - (15 * 60 * 1000);
    timestamp = start;

    const candles = await this.findBundleCandles(tokenName, '5m', start, end);
    if(candles.length === 0) {
      this.logger.log(`Candles length is zero.`);
      return;
    }
    const position = this._getLargeCandlePosition(candles);
    // insert position
    const period = this._buildPeriod(position, timestamp, '15m', tokenName);
    await this.insertManyCandles([period]);
    lpos['o'] = period.c;
    lpos['h'] = '0';
    lpos['l'] = '0';
    lpos['c'] = '0';
    return {
      start, end, timestamp
    }
  }

  async _build1HCandles(tokenName: string, lastDate: Date, currentDate: Date, price: Prices) {
    const lastMin = lastDate.getMinutes();
    const currentMin = currentDate.getMinutes();

    let start: number, end: number, timestamp: number;
    const year = lastDate.getFullYear();
    const month = lastDate.getMonth();
    const day = lastDate.getDate();
    const hour = lastDate.getHours();
    const lpos = this.tPeriodPositions.get(tokenName).get('1h');
    if(lastMin >= 55 && lastMin < 60 && currentMin >= 0 && currentMin < 5) {
      // 1h
      const endData = new Date(year, month, day, currentDate.getHours(), 0, 0);
      end = endData.getTime();
    } else {
      lpos['l'] =  (lpos['l'] === '0') ? price.answer: (price.answer < lpos['l'] ? price.answer: lpos['l']);
      lpos['h'] = price.answer > lpos['h'] ? price.answer: lpos['h'];
      lpos['c'] = price.answer;

      return;
    }
    start = end - (60 * 60 * 1000);
    timestamp = start;

    const candles = await this.findBundleCandles(tokenName, '15m', start, end);
    const position = this._getLargeCandlePosition(candles);
    // insert position
    const period = this._buildPeriod(position, timestamp, '1h', tokenName);
    await this.insertManyCandles([period]);
    lpos['o'] = period.c;
    lpos['h'] = '0';
    lpos['l'] = '0';
    lpos['c'] = '0';
    return {
      start, end, timestamp
    }
  }
  
  async _build4HCandles(tokenName: string, lastDate: Date, currentDate: Date, price: Prices) {
    const lastMin = lastDate.getMinutes();
    const currentMin = currentDate.getMinutes();

    let start: number, end: number, timestamp: number;
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentHour = currentDate.getHours();
    const lpos = this.tPeriodPositions.get(tokenName).get('4h');
    if(lastMin >= 55 && lastMin < 60 && currentMin >= 0 && currentMin < 5) {
      if(!(currentHour === 0 ||
        currentHour === 4 ||
        currentHour === 8 ||
        currentHour === 12 ||
        currentHour === 16 ||
        currentHour === 20)) {
        return;
      }
      // 4h
      const endData = new Date(currentYear, currentMonth, currentDay, currentHour, 0, 0);
      end = endData.getTime();
    } else {
      lpos['l'] =  (lpos['l'] === '0') ? price.answer: (price.answer < lpos['l'] ? price.answer: lpos['l']);
      lpos['h'] = price.answer > lpos['h'] ? price.answer: lpos['h'];
      lpos['c'] = price.answer;

      return;
    }
    start = end - (4 * 60 * 60 * 1000);
    timestamp = start;
    
    const candles = await this.findBundleCandles(tokenName, '1h', start, end);
    const position = this._getLargeCandlePosition(candles);
    // insert position
    const period = this._buildPeriod(position, timestamp, '4H', tokenName);
    await this.insertManyCandles([period]);

    lpos['o'] = period.c;
    lpos['h'] = '0';
    lpos['l'] = '0';
    lpos['c'] = '0';
    return {
      start, end, timestamp
    }
  }

  async _build1DCandles(tokenName: string, lastDate: Date, currentDate: Date, price: Prices) {
    const lastMin = lastDate.getMinutes();
    const currentMin = currentDate.getMinutes();

    let start: number, end: number, timestamp: number;
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentHour = currentDate.getHours();
    const lpos = this.tPeriodPositions.get(tokenName).get('1d');
    if(lastMin >= 55 && lastMin < 60 && currentMin >= 0 && currentMin < 5) {
      // 1d
      if(!(currentHour === 0))  {
        return;
      }
      const endData = new Date(currentYear, currentMonth, currentDay, 0, 0, 0);
      end = endData.getTime();
    } else {
      lpos['l'] =  (lpos['l'] === '0') ? price.answer: (price.answer < lpos['l'] ? price.answer: lpos['l']);
      lpos['h'] = price.answer > lpos['h'] ? price.answer: lpos['h'];
      lpos['c'] = price.answer;

      return;
    }
    start = end - (24 * 60 * 60 * 1000);
    timestamp = start;
    
    const candles = await this.findBundleCandles(tokenName, '4h', start, end);
    const position = this._getLargeCandlePosition(candles);
    // insert position
    const period = this._buildPeriod(position, timestamp, '1D', tokenName);
    await this.insertManyCandles([period]);
    
    lpos['o'] = period.c;
    lpos['h'] = '0';
    lpos['l'] = '0';
    lpos['c'] = '0';
    return {
      start, end, timestamp
    }
  }

  _get5MCandlePosition(prices: Prices[], lastCandle: Period): number[] {
    let realPrices = prices.map((item, index, array) => {
      return Number(item.answer);
    });

    realPrices = lastCandle ? [lastCandle.c, ...realPrices]: realPrices;

    const o = realPrices[0];
    const c = realPrices[realPrices.length - 1];
    const h = realPrices.reduce((a, b) => Math.max(a, b));
    const l = realPrices.reduce((a, b) => Math.min(a, b));
    return [o, c, h, l];
  }

  _getLargeCandlePosition(periods: Period[]): number[] {
    if(periods.length === 0) {
      return [];
    }
    const allH = periods.map((item, index, array) => {
      return item.h;
    });
    const allL = periods.map((item, index, array) => {
      return item.l;
    });

    const o = periods[0].o;
    const c = periods[periods.length - 1].c;
    const h = allH.reduce((a, b) => Math.max(a, b));
    const l = allL.reduce((a, b) => Math.min(a, b));
    return [o, c, h, l];
  }

  getLastestKLine(tokenName: string, period: string) {
    const lpos = this.tPeriodPositions.get(tokenName).get(period);
    lpos['t'] = new Date().getTime();
    return lpos;
  }
  
  // ========================= //
  // functions for controller  //
  // ========================= //

  async get24hPrices(tokenName: string) {
    const st = new Date().getTime();
    const prices = (await this.getCandles(tokenName, '1h', 25))?.prices;
    this.logger.log(`Get get24hPrices: ${(new Date().getTime() - st) / 1000} s costed.`);
    if(prices) {
      const price = await this.getLastestPrice(tokenName);
      this.logger.log(`Get get24hPrices prices: ${(new Date().getTime() - st) / 1000} s costed.`);
      const hour24Before = prices[prices.length - 1];
      const peridos = prices.map((item, index, array) => {
        const pd: Period = new Period();
        pd.c = item['c'];
        pd.o = item['o'];
        pd.h = item['h'];
        pd.l = item['l'];
        return pd;
      });
      const position = this._getLargeCandlePosition(peridos);
      return {
        'price': price?.price,
        'price24b': hour24Before['o'],
        'h': position[2],
        'l': position[3]
      }
    }
  }

  async getLastestPrice(tokenName: string) {
    const price = await this.findLastestPrice(tokenName);
    return {
      'token': tokenName,
      'price': price.answer,
      'updateAt': new Date().getTime(),
    };
  }

  async getCandles(tokenName: string, period: string, limit: number) {
    const st = new Date().getTime();
    let prices: Array<object>;
    const price = this.getLastestKLine(tokenName, period);
    if(limit === 1) {
      prices = [price];
    } else {
      const st = new Date().getTime();
      const candles = await this.findLastestCandles(tokenName, period, limit - 1);
      this.logger.log(candles.length, `Get candles: ${(new Date().getTime() - st) / 1000} s costed.`);
      prices = candles.map((candle: Period) => {
        const obj = {
          'o': candle.o,
          'c': candle.c,
          'h': candle.h,
          'l': candle.l,
          't': candle.t,
        };
        return obj;
      });
      prices = [price].concat(prices);
    }
    
    this.logger.log(`Get candles: ${(new Date().getTime() - st) / 1000} s costed.`);
    return {
      'prices': prices,
      "period": period,
      "updatedAt": new Date().getTime()
    };
  }
}
