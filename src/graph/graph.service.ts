import { Injectable } from '@nestjs/common';
import { execute } from '../../.graphclient'
import { BigNumber } from "ethers";

@Injectable()
export class GraphService {

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

  async getHistory(ledger: string, limit: string, lastID: string, old: string) {
    // const keyword = old === '1'? "id_lt": "id_gt"
    const myQuery = `
      query pairs {
        trades(orderBy: id, orderDirection: desc, first: ${limit}, where: { ledger: ${ledger}}) {
          id
          account
          ledger
          currencyKey
          timestamp
          amount
          totalVal
          type
        }
      }
    `
    
    console.log(myQuery);
    const result = await execute(myQuery, {})
    const trades = result.data?.trades;
    for(const trade of trades) {
      trade.totalVal = this.divDecimal(trade.totalVal);
    }
    return trades;
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
    const last24Hour = this.lastNHourFormat(24);
    let vols = [];
    if(vfs) {
      console.log(lastHour, last24Hour, vfs.length);
      const decials = BigNumber.from(10).pow(18);
      for(const vf of vfs) {
        if(vf.date === key) {
          continue;
        }
        if(vf.date >= last24Hour && vf.date <= lastHour) {
          // const bigint = BigNumber.from(vf.vol);
          // total = total.add(bigint.div(decials));
          console.log(vf);
          vols.push(vf);
        }
      }
    }
    if(vols.length === 0) {
      return BigNumber.from(0).toString();
    }
    const end = vols[0];
    const start = vols[vols.length - 1];
    const decials = BigNumber.from(10).pow(18);
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
    if(vfs) {
      const bigint = BigNumber.from(vfs[0].vol);
      console.log(decials.toString());
      console.log(bigint.toString());
      
      return bigint.div(decials).toString();
    }
    return -1;
  }
}
