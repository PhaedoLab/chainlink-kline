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

  async getHistory(ledger: number, limit: number, ) {
    const myQuery = `
      query pairs {
        trades(orderBy: timestamp, orderDirection: desc, first: ${limit}, where: { ledger: ${ledger} }) {
          id
          account
          ledger
          currencyKey
          timestamp
          amount
          type
        }
      }
    `

    const result = await execute(myQuery, {})
    const trades = result.data?.trades;
    return trades;
  }

  async getLast24H(ledger: number) {
    const myQuery = `
      query pairs {
        volumeFees(orderBy: date, orderDirection: desc, first: 24, where: { ledger: ${ledger} }) {
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
          const bigint = BigNumber.from(vf.vol);
          vols.push({
            'value': bigint.div(decials).toString(),
            'date': vf.date
          });
        }
      }
    }
    return vols;
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
    if(vfs) {
      const decials = BigNumber.from(10).pow(18);
      const bigint = BigNumber.from(vfs[0].vol);
      return bigint.div(decials).toString();  
    }
    return -1;
  }
}
