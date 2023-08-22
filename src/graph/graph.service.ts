import { Injectable } from '@nestjs/common';
import { execute } from '../../.graphclient'
import { BigNumber } from "ethers";

interface Counter {
  count: number,
  timestamp: number
}

@Injectable()
export class GraphService {

  private counters: Map<string, Counter>;
  private readonly LIQUIDATION = 'liquidation';
  private readonly TRADE = 'trade';

  constructor() {
    this.counters = new Map<string, Counter>();
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

    // const key = `${this.TRADE}-${ledger}-${account}`;
    // if(this.counters.has(key)) {
    //   const counter = this.counters.get(key);
    //   const timestamp = counter.timestamp;
    //   const now = new Date().getTime();
    //   const duration = (now - timestamp) / 1000;
    //   if(duration > 30 * 60) {
    //     const count = await this._getHistoryCount(ledger, account);
    //     const newCounter: Counter = {count, timestamp: now};
    //     this.counters.set(key, newCounter);
    //   }
    // } else {
    //   const count = await this._getHistoryCount(ledger, account);
    //   const timestamp = new Date().getTime();
    //   const newCounter: Counter = {count, timestamp};
    //   this.counters.set(key, newCounter);
    // }

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
      return this.divDecimal(val);
    }
    return 0;
  }

  async getVolume24() {
    const myQuery = `
      query pairs {
        volumeFees(orderBy: date, orderDirection: desc, first: 25, where: { ledger: -1 }) {
          id
          ledger
          vol
          fee
          date
        }
      }
    `
    const key = `CUMULATED-VOLFEE`;

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
}
