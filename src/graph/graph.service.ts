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


}
