import { Injectable, Logger } from '@nestjs/common';
import { execute } from '../../.graphclient'
import { BigNumber } from "ethers";
import { Cron, Interval } from '@nestjs/schedule';
import { Collateral, USDStacked, Trade, Liquidation, RiskFund, Histogram, Trader, Trade3 } from './graph.entiry';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, DataSource, Between, Not, In } from 'typeorm';
import { EthereumService } from 'src/liquidation/ethereum.service';
import { BaseService } from 'src/base/base.service';
import { TableDto } from './graph.controller';
import Decimal from 'decimal.js';

interface Counter {
  count: number,
  timestamp: number
}

enum Hist {
  TVL = 'tvl',
  VOL = 'vol',
  TRADER = 'trader',
  TRADE = 'trade',
  FEE = 'fee',
  RFUND = 'rfund'
}

@Injectable()
export class GraphService {
  private readonly logger = new Logger(GraphService.name);
  private counters: Map<string, Counter>;
  private readonly LIQUIDATION = 'liquidation';
  private readonly TRADE = 'trade';
  private readonly totalData: Map<Hist, string>;
  private readonly uniTraders: Set<string>;
  private ledgers: Map<string, string>;

  constructor(
    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,
    @InjectRepository(RiskFund)
    private riskfundRepository: Repository<RiskFund>,
    @InjectRepository(USDStacked)
    private usdRepository: Repository<USDStacked>,
    @InjectRepository(Trade)
    private tradeRepository: Repository<Trade>,
    @InjectRepository(Trade3)
    private trade3Repository: Repository<Trade3>,
    @InjectRepository(Liquidation)
    private liquiRepository: Repository<Liquidation>,
    @InjectRepository(Histogram)
    private histRepository: Repository<Histogram>,
    @InjectRepository(Trader)
    private traderRepository: Repository<Trader>,
    private readonly ethereumService: EthereumService
  ) {
    this.counters = new Map<string, Counter>();
    this.totalData = new Map<Hist, string>();
    this.uniTraders = new Set<string>();

    this.initTotalData();

    this.ledgers = new Map<string, string>();
    this.ethereumService.allLedgers().then((ledgers) => {
      const ids = ledgers[0];
      const names = ledgers[1];
      for(let i = 0; i < ids.length; i++) {
        console.log(ids[i].toString());
        this.ledgers.set(names[i], ids[i].toString());
      }
      console.log(this.ledgers);
      console.log(this.ledgers.get('0'));
    });
  }

  async initTotalData() {
    const hist = await this.findLastestHistogram();
    const traders = await this.findAllTraders();
    traders.forEach((trader: Trader) => {
      this.uniTraders.add(trader.trader);
    });
    this.logger.log(`Trader num ${this.uniTraders.size}`);
    if(hist) {
      this.totalData.set(Hist.TVL, hist.ttvl);
      this.totalData.set(Hist.VOL, hist.tvol);
      this.totalData.set(Hist.TRADE, hist.ttrades);
      this.totalData.set(Hist.TRADER, hist.ttraders);
      this.totalData.set(Hist.FEE, hist.tfee);
    } else {
      const oneHour = 60 * 60; // 1小时的毫秒数
      const now = Math.round(Date.now() / 1000);
      const startTimestamp = 1691061265;
      
      let currentTimestamp = Math.round(startTimestamp / oneHour) * oneHour; // 精确到小时
      while (currentTimestamp < now) {
        const nextTimestamp = currentTimestamp + oneHour;
        await this.calcuHistograms(currentTimestamp, nextTimestamp);
        // this.totalData.set(Hist.TVL, datas.ttvl?.toString());
        // this.totalData.set(Hist.VOL, datas.tvol?.toString());
        // this.totalData.set(Hist.TRADE, datas.trade?.toString());
        // this.totalData.set(Hist.TRADER, datas.trader?.toString());
        // this.totalData.set(Hist.FEE, datas.fee?.toString());
        currentTimestamp = nextTimestamp;
      }
    }
    this.logger.log(`Hist init`);
    for (const [key, value] of this.totalData) {
      console.log(`Key: ${key}, Value: ${value}`);
    }
  }

  _formatNumber(n: number): string {
    return n >= 10 ? `${n}` : `0${n}`;
  }
  
  // timestamp in mill
  lastNHourFormat (n: number): string {
    const date = new Date(new Date().getTime() - n*60*60*1000);
    const year = this._formatNumber(date.getFullYear())
    const month = this._formatNumber(date.getMonth() + 1)
    const day = this._formatNumber(date.getDate())
    const hour = this._formatNumber(date.getHours())
  
    return `${year}-${month}-${day}#${hour}`;
  }

  divDecimal(val: string) {
    const decials = BigNumber.from(10).pow(18);
    const valBigNumber = BigNumber.from(val);
    return valBigNumber.div(decials).toString();
  }

  async getHistory(ledger: string, limit: string, offset: string, account: string) {
    // const keyword = old === '1'? "id_lt": "id_gt"
    const ledgerQuery = ledger? `ledger: ${ledger}`: '';
    const accountQuery = account? `, account: "${account}"`: '';
    const offsetQuery = offset? ` skip: ${offset},`: '';
    const myQuery = `
      query pairs {
        trades(orderBy: id, orderDirection: desc, first: ${limit}, ${offsetQuery} where: {${ledgerQuery} ${accountQuery}}) {
          id
          account
          ledger
          currencyKey
          timestamp
          amount
          totalVal
          eventid
          type
          pnl
        }
      }
    `
    
    console.log(myQuery);
    const result = await execute(myQuery, {})
    const trades = result.data?.trades;
    for(const trade of trades) {
      trade.totalVal = this.divDecimal(trade.totalVal);
    }
    return {
      count: 0,
      result: trades
    };
  }

  async getUHistory(ledger: string, account: string) {
    // const keyword = old === '1'? "id_lt": "id_gt"
    const ledgerQuery = ledger? `ledger: ${ledger}`: '';
    const accountQuery = account? `, account: "${account}"`: '';
    const myQuery = `
      query pairs {
        trades(orderBy: id, orderDirection: desc, where: {${ledgerQuery} ${accountQuery}}) {
          id
          account
          ledger
          currencyKey
          keyPrice
          timestamp
          amount
          totalVal
          eventid
          type
          fee
          pnl
          hash
        }
      }
    `
    
    console.log(myQuery);
    const result = await execute(myQuery, {})
    const trades = result.data?.trades;
    console.log(`trades lenght: ${trades.length}`);
    let buckets = [];
    const newTrades = [];
    let lastEventid = null;
    for(const trade of trades) {
      trade.totalVal = this.divDecimal(trade.totalVal);
      const type = trade?.type;
      const eventid = trade?.eventid;
      if(type === '3') {
        if(lastEventid === null) {
          lastEventid = eventid;
          buckets.push(trade);
        } else if(eventid === lastEventid) {
          buckets.push(trade);
        } else {
          const closeTrade = this._getCloseTrade(buckets);
          buckets = [];
          lastEventid = eventid;
          newTrades.push(closeTrade);
        }
      } else {
        if(buckets.length !== 0) {
          const closeTrade = this._getCloseTrade(buckets);
          buckets = [];
          lastEventid = null;
          newTrades.push(closeTrade);
        }
        const td = {
          'timestamp': trade['timestamp'],
          'ledger': trade['ledger'],
          'type': trade['type'],
          'assets': [{
            'currency_key': trade['currencyKey'],
            'amount': trade['amount'],
            'price': trade['keyPrice'],
          }],
          'currency_key': trade['currencyKey'],
          'amount': trade['amount'],
          'size': trade['totalVal'],
          'pnl': trade['pnl'],
          'fee': trade['fee'],
          'hash': trade['hash'],
        }
        newTrades.push(td);
      }
    }
    if(buckets.length !== 0) {
      const closeTrade = this._getCloseTrade(buckets);
      newTrades.push(closeTrade);
    }

    return {
      count: newTrades.length,
      result: newTrades
    };
  }

  _getCloseTrade(buckets: any[]) {
    const trade = {
      'timestamp':'',
      'ledger':'',
      'type':'',
      'assets': [],
      'amount':'',
      'currency_key':'',
      'size':'',
      'pnl':'',
      'fee':'',
      'hash': ''
    }
    const assets = [];
    let bigerPrice = BigNumber.from('0');
    let priceKey = '';
    let keyAmount = '';
    for(const bucket of buckets) {
      if(bucket['currencyKey'] === 'TOTAL') {
        trade.timestamp = bucket['timestamp'];
        trade.ledger = bucket['ledger'];
        trade.type = bucket['type'];
        trade.size = bucket['totalVal'];
        trade.pnl = bucket['pnl'];
        trade.fee = bucket['fee'];
        trade.hash = bucket['hash'];
      } else {
        assets.push({
          'currency_key': bucket['currencyKey'],
          'amount': bucket['amount'],
          'price': bucket['keyPrice'],
          'total_value': bucket['totalVal'],
        }); 
        if(bigerPrice.lt(BigNumber.from(bucket['totalVal']))) {
          bigerPrice = BigNumber.from(bucket['totalVal']);
          priceKey = bucket['currencyKey'];
          keyAmount = bucket['amount'];
        }
      }
    }
    trade.amount = keyAmount;
    trade.currency_key = priceKey;
    trade.assets = assets;
    console.log(trade);
    return trade;
  }

  async _getHistoryCount(ledger: string, account: string) {
    const ledgerQuery = ledger? `ledger: ${ledger}`: '';
    const accountQuery = account? `, account: "${account}"`: '';
    const myQuery = `
      query pairs {
        trades(where: {${ledgerQuery} ${accountQuery}}) {
          id
        }
      }
    `
    
    console.log(myQuery);
    const result = await execute(myQuery, {})
    const trades = result.data?.trades;
    return trades.length;
  }

  async getLast24H(ledger: number) {
    const myQuery = `
      query pairs {
        volumeFees(orderBy: date, orderDirection: desc, first: 25, where: { ledger: ${ledger} }) {
          id
          ledger
          vol
          fee
          date
        }
      }
    `
    const key = `CUMULATED-VOLFEE-${ledger}`;

    const result = await execute(myQuery, {})
    const vfs = result.data?.volumeFees;
    const lastHour = this.lastNHourFormat(1);
    const last25Hour = this.lastNHourFormat(25);
    let vols = [];
    let totalVol;
    if(vfs) {
      console.log(lastHour, last25Hour, vfs.length);
      for(const vf of vfs) {
        if(vf.date === key) {
          totalVol = vf;
          continue;
        }
        if(vf.date <= last25Hour) {
          // const bigint = BigNumber.from(vf.vol);
          // total = total.add(bigint.div(decials));
          console.log(vf);
          vols.push(vf);
        }
      }
    }
    const decials = BigNumber.from(10).pow(18);
    if(vols.length === 0) {
      return !totalVol? BigNumber.from(0).toString(): BigNumber.from(totalVol.vol).div(decials).toString();
    }
    const end = totalVol;
    const start = vols[0];
    const total = BigNumber.from(end.vol).sub(BigNumber.from(start.vol)).div(decials);

    return total.toString();
  }

  async getLVols(ledger: number) {
    const date = `CUMULATED-VOLFEE-${ledger}`;
    const myQuery = `
      query pairs {
        volumeFees(first: 1, where: { date: "${date}" }) {
          id
          ledger
          vol
          fee
          date
        }
      }
    `
    console.log(myQuery);

    const result = await execute(myQuery, {})
    const vfs = result.data?.volumeFees;
    const decials = BigNumber.from(10).pow(18);
    if(vfs && vfs.length > 0) {
      const bigint = BigNumber.from(vfs[0].vol);
      console.log(decials.toString());
      console.log(bigint.toString());
      
      return bigint.div(decials).toString();
    }
    return 0;
  }


  ////////////////////////
  ///    TVL
  ////////////////////////

  async getTlocked() {
    const key = `CUMULATED_KEY`;
    const myQuery = `
      query pairs {
        tvls(first: 1, where: {date: "${key}"}) {
          id
          date
          amount
        }
      }
    `
    console.log(myQuery);

    const result = await execute(myQuery, {})
    const tvls = result.data?.tvls;
    if(tvls && tvls.length > 0) {
      return tvls[0].amount.toString();
    }
    return 0;
  }

  async getTvolumeFee(volume: boolean) {
    const key = `CUMULATED-VOLFEE`;
    const myQuery = `
      query pairs {
        volumeFees(first: 1, where: {date: "${key}"}) {
          id
          vol
          fee
        }
      }
    `
    console.log(myQuery);

    const result = await execute(myQuery, {})
    const vfs = result.data?.volumeFees;
    if(vfs && vfs.length > 0) {
      const val = volume? vfs[0].vol.toString(): vfs[0].fee.toString();
      return volume? this.divDecimal(val): val;
    }
    return 0;
  }

  async getVolume24(queryVol: boolean) {
    // const myQuery = `
    //   query pairs {
    //     volumeFees(orderBy: date, orderDirection: desc, first: 25, where: { ledger: -1 }) {
    //       id
    //       ledger
    //       vol
    //       fee
    //       date
    //     }
    //   }
    // `
    // const key = `CUMULATED-VOLFEE`;

    // const result = await execute(myQuery, {})
    // const vfs = result.data?.volumeFees;
    // const lastHour = this.lastNHourFormat(1);
    // const last25Hour = this.lastNHourFormat(25);
    // let vols = [];
    // let totalVol;
    // if(vfs) {
    //   console.log(lastHour, last25Hour, vfs.length);
    //   for(const vf of vfs) {
    //     if(vf.date === key) {
    //       totalVol = vf;
    //       continue;
    //     }
    //     if(vf.date > last25Hour) {
    //       // const bigint = BigNumber.from(vf.vol);
    //       // total = total.add(bigint.div(decials));
    //       console.log(vf);
    //       vols.push(vf);
    //     }
    //   }
    // }
    // const decials = BigNumber.from(10).pow(18);
    // if(vols.length === 0) {
    //   return '0';
    // }
    // const end = totalVol;
    // const start = vols[0];
    // let total: BigNumber;
    // if(qvol) {
    //   total = BigNumber.from(end.vol).sub(BigNumber.from(start.vol)).div(decials);
    // } else {
    //   total = BigNumber.from(end.fee).sub(BigNumber.from(start.fee)).div(decials);
    // }

    // return total.toString();
    const yesterday = this._getYesterday();
    const trades = await this.findLastest24HTrade(Math.round(yesterday.getTime()/1000));
    let vol: BigNumber = BigNumber.from(0);
    let fee: BigNumber = BigNumber.from(0);
    for(const trade of trades) {
        vol = vol.add(BigNumber.from(trade.totalVal));
        fee = fee.add(BigNumber.from(trade.fee));
    }
    return queryVol? this.divDecimal(vol.toString()): fee.toString();
  }

  async _getTVL24() {
    // const myQuery = `
    //   query pairs {
    //     tvls(orderBy: date, orderDirection: desc, first: 25) {
    //       id
    //       date
    //       amount
    //     }
    //   }
    // `
    // const key = `CUMULATED_KEY`;

    // const result = await execute(myQuery, {})
    // const tvls = result.data?.tvls;
    // const lastHour = this.lastNHourFormat(1);
    // const last25Hour = this.lastNHourFormat(25);
    // let usefulTvls = [];
    // let totalTvl: any;
    // if(tvls) {
    //   console.log(lastHour, last25Hour, tvls.length);
    //   for(const vf of tvls) {
    //     if(vf.date === key) {
    //       totalTvl = vf;
    //       continue;
    //     }
    //     if(vf.date > last25Hour) {
    //       // const bigint = BigNumber.from(vf.vol);
    //       // total = total.add(bigint.div(decials));
    //       console.log(vf);
    //       usefulTvls.push(vf);
    //     }
    //   }
    // }
    // const decials = BigNumber.from(10).pow(18);
    // if(usefulTvls.length === 0) {
    //   return '0';
    // }
    // const end = totalTvl;
    // const start = usefulTvls[0];
    // const total = BigNumber.from(end.amount).sub(BigNumber.from(start.amount)).div(decials);

    const yesterday = this._getYesterday();
    const trades = await this.findLastest24HUSDStacked(Math.round(yesterday.getTime()/1000));
    let tvl: BigNumber = BigNumber.from(0);
    for(const trade of trades) {
        if(trade.mint === 1) {
          tvl = BigNumber.from(trade.amount).add(tvl);
        } else {
          tvl = tvl.sub(BigNumber.from(trade.amount));
        }
    }
    return tvl.toString();
  }

  async getTusers() {
    // following id is the bytes of "MINT_TRADERS"
    const id = `0x4d494e545f54524144455253`;
    const myQuery = `
      query pairs {
        traders(first: 1, where: {id: "${id}"}) {
          id
          amount
        }
      }
    `
    console.log(myQuery);

    const result = await execute(myQuery, {})
    const traders = result.data?.traders;
    if(traders && traders.length > 0) {
      return traders[0].amount;
    }
    return 0;
  }

  async getLiquidations(ledger: string, limit: string, account: string) {
    account = account.toLowerCase();
    const ledgerQuery = ledger? `ledger: ${ledger}`: '';
    const accountQuery = account? `, account: "${account}"`: '';
    let myQuery = `
      query pairs {
        liquidations(orderBy: id, orderDirection: desc, first: ${limit}, where: {${ledgerQuery} ${accountQuery}}) {
          id
          hash
          ledger
          account
          operator
          collateral
          debt
          totalDebt
          normal
          eventid
          timestamp
        }
      }
    `
    console.log(myQuery);
    const result = await execute(myQuery, {})
    const liquidations = result.data?.liquidations;
    if(!liquidations) {
      return {
        count: 0,
        result: []
      };
    }
    console.log(`liquidations num: ${liquidations.length}`);
    let resLiquidations = [];
    for(const liquidation of liquidations) {
      const col = liquidation?.collateral;
      const debt = liquidation?.debt;
      const totalDebt = liquidation?.totalDebt;
      const timestamp = liquidation?.timestamp;
      myQuery = `
        query pairs {
          trades(orderBy: id, orderDirection: desc, first: ${10}, where: {type: 3, ${ledgerQuery} ${accountQuery}, timestamp: ${timestamp}}) {
            currencyKey
            keyPrice
            amount
            totalVal
            pnl
            fee
          }
        }
      `
      console.log(myQuery);
      const result = await execute(myQuery, {})
      const trades = result.data?.trades;
      let totalTrade;
      let itemTrades = [];
      let synthVal = BigInt(0);
      let synthName;
      let price;
      let amount;
      for(const trade of trades) {
        const key = trade?.currencyKey;
        trade.totalVal = this.divDecimal(trade?.totalVal);
        if(key === 'TOTAL') {
          totalTrade = trade;
        } else {
          itemTrades.push(trade);
          if(synthVal < BigInt(trade.totalVal)) {
            synthVal = BigInt(trade.totalVal);
            synthName = trade.currencyKey;
            price = trade.keyPrice;
            amount = trade.amount;
          }
        }
      }

      const remain = BigInt(totalTrade?.totalVal) + BigInt(liquidation.collateral) - BigInt(liquidation.debt) - BigInt(totalTrade.fee);
      const pnl = BigInt(totalTrade?.pnl) + BigInt(totalTrade.fee);
      console.log(`hash: ${liquidation.hash}`);
      resLiquidations.push({
        'hash': liquidation.hash,
        'timestamp': liquidation.timestamp,
        'ledger': liquidation.ledger,
        'normal': liquidation.normal,
        'collateral': liquidation.collateral,
        'size': totalTrade?.totalVal,
        'trades': itemTrades,
        'synth': synthName,
        'price': price,
        'amount': amount,
        'snapshot': {
          'debt': liquidation.debt,
          'total_debt': liquidation.totalDebt,
          'debt_ratio': liquidation.debt/liquidation.totalDebt,
          'pnl': pnl.toString(),
          'pnlrate': parseInt(this.divDecimal(pnl.toString()))/parseInt(this.divDecimal(liquidation.collateral)),
        },
        'remain_value': remain.toString(),
        'fee': totalTrade.fee
      });
    }

    const key = `${this.LIQUIDATION}-${ledger}-${account}`;
    // if(this.counters.has(key)) {
    //   const counter = this.counters.get(key);
    //   const timestamp = counter.timestamp;
    //   const now = new Date().getTime();
    //   const duration = (now - timestamp) / 1000;
    //   if(duration > 30 * 60) {
    //     const count = await this._getLiquidationsCount(ledger, account);
    //     const newCounter: Counter = {count, timestamp: now};
    //     this.counters.set(key, newCounter);
    //   }
    // } else 
    {
      const count = await this._getLiquidationsCount(ledger, account);
      const timestamp = new Date().getTime();
      const newCounter: Counter = {count, timestamp};
      this.counters.set(key, newCounter);
    }
    
    return {
      count: this.counters.get(key),
      result: resLiquidations
    };
  }

  async _getLiquidationsCount(ledger: string, account: string) {
    const ledgerQuery = ledger? `ledger: ${ledger}`: '';
    const accountQuery = account? `, account: "${account}"`: '';
    let myQuery = `
      query pairs {
        liquidations(where: {${ledgerQuery} ${accountQuery}}) {
          id
          ledger
          account
          operator
          collateral
          debt
          totalDebt
          timestamp
        }
      }
    `
    console.log(myQuery);
    const result = await execute(myQuery, {})
    const liquidations = result.data?.liquidations;
    
    return liquidations.length;
  }

  async _getTraders() {
    const allTrades = await this.findTrades(Math.round(new Date().getTime()/1000));
    const allUsers = allTrades.map((trade: Trade) => trade.account);
    const allUniUsers = new Set(allUsers).size;

    const yesterday = this._getYesterday();
    const trades = await this.findTrades(Math.round(yesterday.getTime()/1000));
    const users = trades.map((trade: Trade) => trade.account);
    const lastUsers = new Set(users).size;
    return {
      traders: allUniUsers,
      traders24: allUniUsers - lastUsers
    };
  }

  _getYesterday(): Date {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1); // 获取昨天的日期
    yesterday.setMinutes(0);
    yesterday.setSeconds(0);
    yesterday.setMilliseconds(0);
    return yesterday;
  }

  _getLastNHour(num: number): Date {
    const now = new Date();
    const lastHour = new Date(now);
    lastHour.setDate(now.getDate());
    lastHour.setHours(now.getHours() - num); // 获取早一个小时的hour
    lastHour.setMinutes(0);
    lastHour.setSeconds(0);
    lastHour.setMilliseconds(0);
    return lastHour;
  }

  async _getCollateral() {
    const balance = await this.ethereumService.getJungleBalanceOf();
    
    const yesterday = this._getYesterday();

    // 获取整小时的时间戳（以秒为单位）
    const timestamp = Math.floor(yesterday.getTime() / 1000);

    const coll = await this.findColleteral(timestamp);
    const amount = coll? coll.amount: balance;
    return {
      coll: balance,
      coll24: BigNumber.from(balance).sub(BigNumber.from(amount)).toString()
    }
  }

  async getMetrics() {
    const traders = await this._getTraders();
    const collaterals = await this._getCollateral();
    const tvl = {
      'tvl24': await this._getTVL24(),
      'tvl': await this.getTlocked()
    };
    const vol = {
      'vol24': await this.getVolume24(true),
      'vol': await this.getTvolumeFee(true)
    }
    const fee = {
      'fee24': await this.getVolume24(false),
      'fee': await this.getTvolumeFee(false)
    }
    return {
      trader: traders,
      coll: collaterals,
      tvl: tvl,
      vol: vol,
      fee
    }
  }

  /**
   * mysql usdstaked oprations
   */

  findUSDStacked(timestamp: number): Promise<USDStacked[]> {
    return this.usdRepository
      .createQueryBuilder('usd')
      .where(`usd.timestamp < :timestamp`, 
        { timestamp: timestamp })
      .getMany();
  }

  findDurationUSDStacked(start: number, end: number): Promise<USDStacked[]> {
    return this.usdRepository
      .createQueryBuilder('usd')
      .where(`usd.timestamp >= :start and usd.timestamp < :end`,
        { start, end })
      .getMany();
  }

  findLastestUSDStacked(): Promise<USDStacked> {
    return this.usdRepository
      .createQueryBuilder('usd')
      .orderBy('usd.timestamp', 'DESC')
      .getOne();
  }

  findLastest24HUSDStacked(timestamp: number): Promise<USDStacked[]> {
    return this.usdRepository
      .createQueryBuilder('usd')
      .where(`usd.timestamp >= :timestamp`, 
        { timestamp: timestamp })
      .getMany();
  }

  /**
   * mysql Liquidation oprations
   */

  findLiquidation(timestamp: number): Promise<Liquidation[]> {
    return this.liquiRepository
      .createQueryBuilder('usd')
      .where(`usd.timestamp < :timestamp`, 
        { timestamp: timestamp })
      .getMany();
  }

  findLiquidationJoin(timestamp: number): Promise<any> {
    // return this.liquiRepository
    //   .createQueryBuilder('usd')
    //   .innerJoinAndSelect(Trade, 'trade', 'trade.hash = usd.hash',)
    //   .where(`usd.timestamp = :timestamp`,
    //     { timestamp: timestamp })
    //   .getMany();
    return this.liquiRepository.findOne({
      where: {
        id: 1,
      },
      relations: {
          trades: true,
      }
    });
  }

  findDurationLiquidationRelation(start: number, end: number, ledger: string, account: string, page: number, pagesize: number): Promise<Liquidation[]> {
    return this.liquiRepository.find({
      where: {
        timestamp: Between(`${start}`, `${end}`),
        ledger: ledger? parseInt(ledger): Not(-1),
        account: account? account: Not('')
      },
      relations: ['trades', 'trades.trades3'],
      skip: page * pagesize,
      take: pagesize
    });
  }

  findDurationTradeRelation(start: number, end: number, ledger: string, account: string, page: number, pagesize: number, dtype: string): Promise<Trade[]> {
    return this.tradeRepository.find({
      where: {
        timestamp: Between(`${start}`, `${end}`),
        ledger: ledger? parseInt(ledger): Not(-1),
        account: account? account: Not(''),
        typet: dtype === 'opos'? In([1, 2]): (dtype === 'cpos'? 3: Not(-1))
      },
      relations: ['trades3'],
      skip: page * pagesize,
      take: pagesize
    });
  }

  findDurationLiquidation(start: number, end: number, query: string=''): Promise<Liquidation[]> {
    return this.liquiRepository
      .createQueryBuilder('usd')
      .where(`usd.timestamp >= :start and usd.timestamp < :end ${query}`,
        { start, end })
      .getMany();
  }

  findLastestLiquidation(): Promise<Liquidation> {
    return this.liquiRepository
      .createQueryBuilder('usd')
      .orderBy('usd.timestamp', 'DESC')
      .getOne();
  }

  findLastest24HLiquidation(timestamp: number): Promise<Liquidation[]> {
    return this.liquiRepository
      .createQueryBuilder('usd')
      .where(`usd.timestamp >= :timestamp`, 
        { timestamp: timestamp })
      .getMany();
  }

  findLiquidationByHash(hash: string): Promise<Liquidation> {
    return this.liquiRepository
      .createQueryBuilder('usd')
      .where(`usd.hash = :hash`,
        { hash })
      .getOne();
  }

  insertManyLiquis(liquis: Liquidation[]): Promise<InsertResult> {
    return this.liquiRepository.insert(liquis);
  }

  /**
   * mysql Histogram oprations
   */

  findDurationHistogram(start: number, end: number): Promise<Histogram[]> {
    return this.histRepository
      .createQueryBuilder('usd')
      .where(`usd.timestamp >= :start and usd.timestamp < :end`, 
        { start, end })
      .getMany();
  }

  findLastestHistogram(): Promise<Histogram> {
    return this.histRepository
      .createQueryBuilder('usd')
      .orderBy('usd.timestamp', 'DESC')
      .getOne();
  }

  insertManyHistogram(hists: Histogram[]): Promise<InsertResult> {
    return this.histRepository.insert(hists);
  }

  // histogram end

  insertManyEmails(usds: USDStacked[]): Promise<InsertResult> {
    return this.usdRepository.insert(usds);
  }

  insertManyCollateral(colls: Collateral[]): Promise<InsertResult> {
    return this.collateralRepository.insert(colls);
  }

  findColleteral(timestamp: number): Promise<Collateral> {
    return this.collateralRepository
      .createQueryBuilder('coll')
      .where(`coll.timestamp = :timestamp`, 
        { timestamp: timestamp })
      .getOne();
  }

  insertManyRiskFund(funds: RiskFund[]): Promise<InsertResult> {
    return this.riskfundRepository.insert(funds);
  }

  findDurationRiskFund(start: number, end: number): Promise<RiskFund[]> {
    return this.riskfundRepository
      .createQueryBuilder('coll')
      .where(`coll.timestamp >= :start and coll.timestamp <= :end`, 
        { start, end })
      .orderBy('coll.timestamp', 'DESC')
      .getMany();
  }

  findRiskFund(timestamp: number): Promise<RiskFund> {
    return this.riskfundRepository
      .createQueryBuilder('coll')
      .where(`coll.timestamp = :timestamp`, 
        { timestamp: timestamp })
      .getOne();
  }

  /**
   * mysql Trade oprations
   */
  findLastestTrade(): Promise<Trade> {
    return this.tradeRepository
      .createQueryBuilder('usd')
      .orderBy('usd.timestamp', 'DESC')
      .getOne();
  }

  findDurationTrades(start: number, end: number, appendQuery: string=''): Promise<Trade[]> {
    return this.tradeRepository
      .createQueryBuilder('usd')
      .where(`usd.timestamp >= :start and usd.timestamp < :end ${appendQuery}`, 
        { start, end })
      .getMany();
  }

  findTrades(timestamp: number): Promise<Trade[]> {
    return this.tradeRepository
      .createQueryBuilder('usd')
      .where(`usd.timestamp < :timestamp`, 
        { timestamp: timestamp })
      .getMany();
  }

  findTradesByHash(hash: string): Promise<Trade[]> {
    return this.tradeRepository
      .createQueryBuilder('usd')
      .where(`usd.hash < :hash`, 
        { hash })
      .getMany();
  }

  findLastest24HTrade(timestamp: number): Promise<Trade[]> {
    return this.tradeRepository
      .createQueryBuilder('usd')
      .where(`usd.timestamp >= :timestamp`, 
        { timestamp: timestamp })
      .getMany();
  }

  insertManyTrades(usds: Trade[]): Promise<InsertResult> {
    return this.tradeRepository.insert(usds);
  }

  insertManyTrades3(usds: Trade3[]): Promise<InsertResult> {
    return this.trade3Repository.insert(usds);
  }

  @Cron('0 0 * * * *')
  async trackFromContracts() {
    await this.trackCollateral();
    await this.trackInsuFund();

    const hist = await this.findLastestHistogram();
    if(hist) {
      const oneHour = 60 * 60; // 1小时的秒数
      let start = parseInt(hist.timestamp) + oneHour;
      let end = start + oneHour;
      const now = Math.round(Date.now() / 1000);
      
      while (end <= now) {
        await this.calcuHistograms(start, end);
        start = end;
        end = start + oneHour;
      }
    }
  }

  async trackCollateral() {
    const balance = await this.ethereumService.getJungleBalanceOf();
    const collateral: Collateral = new Collateral();
    collateral.amount = balance;
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    // 获取整小时的时间戳（以秒为单位）
    const timestamp = Math.floor(now.getTime() / 1000);

    collateral.timestamp = `${timestamp}`;
    this.insertManyCollateral([collateral]);
  }

  async trackInsuFund() {
    const balance = await this.ethereumService.getRiskFundBalanceOf();
    const riskfund: RiskFund = new RiskFund();
    riskfund.amount = balance;
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    // 获取整小时的时间戳（以秒为单位）
    const timestamp = Math.floor(now.getTime() / 1000);

    riskfund.timestamp = `${timestamp}`;
    this.insertManyRiskFund([riskfund]);
  }

  // call 
  @Cron('0 * * * * *')
  async trackTheGraph() {
    await this.trackUSDStacked();
    await this.trackLiquidation();
    await this.trackTrade();
  }

  async trackTrade() {
    const trade = await this.findLastestTrade();
    const timestamp = trade? trade.timestamp: 0;

    const myQuery = `
      query usds {
        trades(where: {timestamp_gt: ${timestamp}}) {
          id
          ledger
          account
          currencyKey
          amount
          keyPrice
          fee
          type
          totalVal
          timestamp
          eventid
          pnl
          hash
        }
      }
    `
    console.log(myQuery);

    const result = await execute(myQuery, {})
    const trades = result.data?.trades;
    const ctrades: Trade[] = [];
    const ctrades3: Trade3[] = [];
    const hashTotal = new Map<string, Trade>();
    for(const usd of trades) {
      this.logger.log(`type: type: type: ${usd.type}`);
      if(usd.type === '3' && usd.currencyKey !== 'TOTAL') {
        const trade: Trade3 = new Trade3();
        trade.ledger = usd.ledger;
        trade.account = usd.account;
        trade.currencyKey = usd.currencyKey;
        trade.amount = usd.amount;
        trade.keyPrice = usd.keyPrice;
        trade.fee = usd.fee;
        trade.typet = usd.type;
        trade.totalVal = usd.totalVal;
        trade.timestamp = usd.timestamp;
        trade.eventid = usd.eventid;
        trade.pnl = usd.pnl;
        trade.hash = usd.hash;
        
        ctrades3.push(trade);
      } else {
        const trade: Trade = new Trade();
        trade.ledger = usd.ledger;
        trade.account = usd.account;
        trade.currencyKey = usd.currencyKey;
        trade.amount = usd.amount;
        trade.keyPrice = usd.keyPrice;
        trade.fee = usd.fee;
        trade.typet = usd.type;
        trade.totalVal = usd.totalVal;
        trade.timestamp = usd.timestamp;
        trade.eventid = usd.eventid;
        trade.pnl = usd.pnl;
        trade.hash = usd.hash;
        const liqui = await this.findLiquidationByHash(trade.hash);
        trade.liquidation = liqui;
        if(usd.type === '3') {
          hashTotal.set(trade.hash, trade);
        }
        
        ctrades.push(trade);
      }
    }
    for(const trade3 of ctrades3) {
      trade3.trade = hashTotal.get(trade3.hash);
    }

    await this.insertManyTrades(ctrades);
    await this.insertManyTrades3(ctrades3);
  }

  async trackUSDStacked() {
    const usd = await this.findLastestUSDStacked();
    const timestamp = usd? usd.timestamp: 0;

    const myQuery = `
      query usds {
        usdstackeds(where: {timestamp_gt: ${timestamp}}) {
          id
          user
          amount
          mint
          timestamp
        }
      }
    `
    console.log(myQuery);

    const result = await execute(myQuery, {})
    const usdstackeds = result.data?.usdstackeds;
    const usds = usdstackeds.map((usd) => {
      const usdClass: USDStacked = new USDStacked();
      usdClass.user = usd.user;
      usdClass.amount = usd.amount;
      usdClass.mint = usd.mint? 1: 0;
      usdClass.timestamp = usd.timestamp;
      return usdClass;
    });
    await this.insertManyEmails(usds);
  }

  async trackLiquidation() {
    const liqui = await this.findLastestLiquidation();
    const timestamp = liqui? liqui.timestamp: 0;

    const myQuery = `
      query usds {
        liquidations(where: {timestamp_gt: ${timestamp}}) {
          id
          ledger
          account
          operator
          collateral
          debt
          totalDebt
          normal
          eventid
          timestamp
          hash
        }
      }
    `
    console.log(myQuery);

    const result = await execute(myQuery, {})
    const liquis = result.data?.liquidations;
    const liquidations: Liquidation[] = [];
    for(const liqui of liquis) {
      const liquidation: Liquidation = new Liquidation();
      liquidation.ledger = liqui.ledger;
      liquidation.account = liqui.account;
      liquidation.operator = liqui.operator;
      liquidation.collateral = liqui.collateral;
      liquidation.debt = liqui.debt;
      liquidation.totalDebt = liqui.totalDebt;
      liquidation.normal = liqui.normal;
      liquidation.eventid = liqui.eventid;
      liquidation.timestamp = liqui.timestamp;
      liquidation.hash = liqui.hash;

      liquidations.push(liquidation);
    }
    await this.insertManyLiquis(liquidations);
  }

  /**
   * statistics data
   */
  async getHistograms(start: number, end: number, dtype: string) {
    const endAppend = end + 60 * 60 * 24;
    const hists = await this.findDurationHistogram(start, endAppend);
    const arrs = [];
    for (let i = 0; i < hists.length; i += 24) {
      const chunk = hists.slice(i, i + 24);
      let tvl = BigInt(0);
      let vol = BigInt(0);
      let fee = BigInt(0);
      let trader = BigInt(0);
      let trade = BigInt(0);
      let rfund = BigInt(0);
      for(const ck of chunk) {
        tvl += BigInt(ck.tvl);
        vol += BigInt(ck.vol);
        fee += BigInt(ck.fee);
        trader += BigInt(ck.traders);
        trade += BigInt(ck.trades);
        rfund += BigInt(ck.rfund);
      }
      const cumulHist = chunk[chunk.length - 1];
      arrs.push({
        'tvl': tvl.toString(),
        'vol': this.divDecimal(vol.toString()),
        'tradingfee': fee.toString(),
        'traders': trader.toString(),
        'trades': trade.toString(),
        'insufund': rfund.toString(),
        'ttvl': cumulHist.ttvl,
        'tvol': this.divDecimal(cumulHist.tvol),
        'ttradingfee': cumulHist.tfee,
        'ttraders': cumulHist.ttraders,
        'ttrades': cumulHist.ttrades,
        'tinsufund': cumulHist.trfund,
        'timestamp': chunk[0].timestamp
      });
    }
    const arrsNew = arrs.map((obj) => {
      if(dtype === 'tvl') {
        return {
          tvl: obj.tvl,
          ttvl: obj.ttvl,
          timestamp: obj.timestamp
        }
      } else if(dtype === 'vol') {
        return {
          vol: obj.vol,
          tvol: obj.tvol,
          timestamp: obj.timestamp
        }
      } else if(dtype === 'tradingfee') {
        return {
          tradingfee: obj.tradingfee,
          ttradingfee: obj.ttradingfee,
          timestamp: obj.timestamp
        }
      } else if(dtype === 'traders') {
        return {
          traders: obj.traders,
          ttraders: obj.ttraders,
          timestamp: obj.timestamp
        }
      } else if(dtype === 'trades') {
        return {
          trades: obj.trades,
          ttrades: obj.ttrades,
          timestamp: obj.timestamp
        }
      } else if(dtype === 'insufund') {
        return {
          insufund: obj.insufund,
          tinsufund: obj.tinsufund,
          timestamp: obj.timestamp
        }
      } else {
        return obj;
      }
    })
    return {
      data: arrsNew,
      decimals: 18
    };
  }
  
  async calcuHistograms(start: number, end: number) {
    this.logger.log(`start: ${start}, end: ${end}`);
    const trades = await this.findDurationTrades(start, end);
    const stacks = await this.findDurationUSDStacked(start, end);
    const liquis = await this.findDurationLiquidation(start, end);
    const rfunds = await this.findDurationRiskFund(start, end);
    let tvl = BigInt(0);
    for(const st of stacks) {
      if(st.mint === 1) {
        tvl += BigInt(st.amount);
      } else {
        tvl -= BigInt(st.amount);
      }
    }

    let vol = BigInt(0);
    let fee = BigInt(0);
    const tradeSet = new Set();
    let traderNum = 0;
    for(const trade of trades) {
      vol += BigInt(trade.totalVal);
      fee += BigInt(trade.fee);
      const td = new Trader();
      td.trader = trade.account;
      td.timestamp = trade.timestamp;

      if(!this.uniTraders.has(trade.account)) {
        this.uniTraders.add(trade.account);
        await this.insertManyTraders([td]);
        traderNum += 1;
      }

      tradeSet.add(trade.hash);
    }
    for(const liqui of liquis) {
      tradeSet.add(liqui.hash);
    }
    const tradeNum = tradeSet.size;

    const ttvl = tvl + BigInt(this.totalData.get(Hist.TVL)? this.totalData.get(Hist.TVL): '0');
    this.totalData.set(Hist.TVL, ttvl.toString());
    const tvol = vol + BigInt(this.totalData.get(Hist.VOL)? this.totalData.get(Hist.VOL): '0');
    this.totalData.set(Hist.VOL, tvol.toString());
    const tfee = fee + BigInt(this.totalData.get(Hist.FEE)? this.totalData.get(Hist.FEE): '0');
    this.totalData.set(Hist.FEE, tfee.toString());
    const ttraders = traderNum + parseInt(this.totalData.get(Hist.TRADER)? this.totalData.get(Hist.TRADER): '0');
    this.totalData.set(Hist.TRADER, ttraders.toString());
    const ttrades = tradeNum + parseInt(this.totalData.get(Hist.TRADE)? this.totalData.get(Hist.TRADE): '0');
    this.totalData.set(Hist.TRADE, ttrades.toString());

    let trfund = '0';
    let rfund = '0';
    if(rfunds.length === 2) {
      const currRfund = rfunds[0];
      const lastRfund = rfunds[1];
      const rfundAmount = BigInt(currRfund.amount);
      const lastRfundAmount = BigInt(lastRfund.amount);
      rfund = (rfundAmount - lastRfundAmount).toString();
      trfund = rfundAmount.toString();
    } else if(rfunds.length === 1) {
      trfund = rfunds[0].amount;
    }

    const hist = new Histogram();
    hist.tvl = tvl.toString();
    hist.ttvl = ttvl.toString();
    hist.vol = vol.toString();
    hist.tvol = tvol.toString();
    hist.traders = traderNum.toString();
    hist.ttraders = ttraders.toString();
    hist.trades = tradeNum.toString();
    hist.ttrades = ttrades.toString();
    hist.fee = fee.toString();
    hist.tfee = tfee.toString();
    hist.rfund = rfund.toString();
    hist.trfund = trfund.toString();
    hist.timestamp = `${start}`;
    await this.insertManyHistogram([hist]);

    return {
      tvl, ttvl, vol, tvol, 
      trader: traderNum, ttraders, 
      trade: tradeNum, ttrades, fee, tfee, rfund, trfund
    };
  }

  async getTables(tableDto: TableDto) {
    const start = tableDto.start;
    const end = tableDto.end;
    const dtype = tableDto.dtype;
    const page = tableDto.page? parseInt(tableDto.page): 0;
    const pageSize = tableDto.pagesize? parseInt(tableDto.pagesize): 10000;
    const ledger = this.ledgers.get(tableDto.debtpool)? this.ledgers.get(tableDto.debtpool): null;
    const account = tableDto.account;
    if(dtype === 'liqu') {
      const liquis = await this.findDurationLiquidationRelation(parseInt(start), parseInt(end), ledger, account, page, pageSize);
      this.logger.log(`liquis items`);
      this.logger.log(liquis);
      const liquiArr = [];
      for(const liqui of liquis) {
        const trades = liqui.trades;
        let totalTrade = this.divDecimal(trades[0].totalVal);
        let tradingfee = trades[0].fee;
        const synths = [];
        for(const trade of trades[0].trades3) {
          synths.push({
            name: trade.currencyKey,
            amount: trade.amount,
            price: trade.keyPrice
          });
        }

        let remain = BigInt(totalTrade) + BigInt(liqui.collateral) - BigInt(liqui.debt) - BigInt(tradingfee);
        remain = remain < 0? BigInt(0): remain;

        const decimal = new Decimal(liqui.debt);
        const debtratio = decimal.div(new Decimal(liqui.totalDebt));
        const debtratioValue = debtratio.toNumber();

        const decimal2 = new Decimal((BigInt(totalTrade) - BigInt(liqui.debt)).toString());
        const pnlrate = decimal2.div(new Decimal(liqui.collateral));
        const pnlrateValue = pnlrate.toNumber();

        liquiArr.push({
          'address': liqui.account,
          'timestamp': liqui.timestamp,
          'network': 'Arbitrum',
          'debtpool': tableDto.debtpool,
          'type': liqui.normal === 1? 'nliqu': 'abliqu',
          'size': totalTrade,
          'tradingfee': tradingfee,
          'remain': remain.toString(),
          'collateral': liqui.collateral,
          synths,
          'snapshot': {
            'adebt': liqui.debt,
            'tdebt': liqui.totalDebt,
            'collateral': liqui.collateral,
            'pnl': (BigInt(totalTrade) - BigInt(liqui.debt)).toString(),
            'pnlrate': pnlrateValue,
            'debtratio': debtratioValue
          }
        });
      }
      return liquiArr;
    }

    if(dtype === 'opos') {
    } else if(dtype === 'cpos') {
    } else if(dtype === 'pos') {
    } else {
      throw new Error(`Error dtype: ${dtype}`);
    }
    const trades = await this.findDurationTradeRelation(parseInt(start), parseInt(end), ledger, account, page, pageSize, dtype);
    if(trades) {
      const tradesArr = [];
      for(const trade of trades) {
        const synths = [];
        if(trade.typet === 3) {
          for(const trade3 of trade.trades3) {
            synths.push({
              name: trade3.currencyKey,
              amount: trade3.amount,
              price: trade3.keyPrice
            });
          }
        } else {
          synths.push({
            name: trade.currencyKey,
            amount: trade.amount,
            price: trade.keyPrice
          });
        }
        tradesArr.push({
          'address': trade.account,
          'timestamp': trade.timestamp,
          'network': 'Arbitrum',
          'debtpool': tableDto.debtpool,
          'type': trade.typet === 3? 'close': 'open',
          'size': this.divDecimal(trade.totalVal),
          'tradingfee': trade.fee,
          synths
        });
      }
      return tradesArr;
    }
    return trades;
  }

  async downloadTables(tableDto: TableDto) {

  }

  /**
   * mysql Trader oprations
   */
  findTraderNum(): Promise<number> {
    return this.traderRepository
      .createQueryBuilder('usd')
      .orderBy('usd.timestamp', 'DESC')
      .getCount();
  }

  findAllTraders(): Promise<Trader[]> {
    return this.traderRepository
      .createQueryBuilder('usd')
      .getMany();
  }

  async insertManyTraders(traders: Trader[]) {
    this.traderRepository.insert(traders);
  }
}


