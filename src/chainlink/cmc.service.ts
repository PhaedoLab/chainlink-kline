import { Logger, Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { Cron, Interval } from '@nestjs/schedule';
import { CMCPrice } from './chainlink.entiry';
import { InsertResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CmcService {

  private readonly logger = new Logger('CmcService');
  private readonly idTokens = new Map<number, string>();
  private readonly ids: string;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(CMCPrice)
    private readonly pricesRepository: Repository<CMCPrice>,
  ) {
    this.idTokens.set(11841, 'ARB');
    this.idTokens.set(7083, 'UNI');
    this.idTokens.set(18876, 'APE');
    this.idTokens.set(5728, 'BAL');
    this.idTokens.set(11857, 'GMX');
    this.idTokens.set(7278, 'AAVE');
    
    this.ids = Array.from(this.idTokens.keys()).join(",");
  }

  insertManyPrices(prices: CMCPrice[]): Promise<InsertResult> {
    return this.pricesRepository.insert(prices);
  }

  _getRoundSec(): Date {
    const now = new Date();
    const nowMinu = new Date(now);
    nowMinu.setDate(now.getDate());
    nowMinu.setSeconds(0);
    nowMinu.setMilliseconds(0);
    return nowMinu;
  }
    
  async saveTokenQuote() {
    const resp = await this.httpService.get(
      "v2/cryptocurrency/quotes/latest", {
      params: {
        id: this.ids,
      }
    }).toPromise();
    if(resp.data.status.error_code == 0) {
      const now = this._getRoundSec().getTime();
      const prices = [];
      this.logger.log(resp.data);
      const keys = Array.from(this.idTokens.keys());
      for(const id of keys) {
        const coin = resp.data.data[`${id}`];
        const cmcprice = new CMCPrice();
        cmcprice.tokenName = this.idTokens.get(id);
        cmcprice.c = coin.quote.USD.price;
        cmcprice.o = coin.quote.USD.price;
        cmcprice.h = coin.quote.USD.price;
        cmcprice.l = coin.quote.USD.price;
        cmcprice.t = `${Math.round(now/1000)}`
        prices.push(cmcprice);
      }
      this.logger.log(`saveTokenQuote: ${JSON.stringify(prices)}`);
      await this.insertManyPrices(prices);
    } else {
      throw new Error("coin market cap api error" + JSON.stringify(resp));
    }
  }

  @Cron('0 */5 * * * *')
  async handleCron() {
    await this.saveTokenQuote();
  }
}