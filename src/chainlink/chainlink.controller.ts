import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ChainlinkService } from './chainlink.service';

@Controller('api/v1/kline')
export class ChainlinkController {
  private readonly logger = new Logger(ChainlinkController.name);
  
  constructor(private readonly chainlinkService: ChainlinkService) {}

  /**
   * get the lastest prices of a target token
   * ETC: curl 'http://127.0.0.1:3002/api/prices?token=ETH'
   */
  @Get('prices')
  async prices(@Query('token') token): Promise<string> {
    if(!token) {
      this.logger.log(`Token is null.`);
    }
    const prices = await this.chainlinkService.getLastestPrice(token);
    return JSON.stringify(prices);
  }

  /**
   * get the candles of a target token
   * ETC: curl 'http://127.0.0.1:3002/api/candles/ETH?period=5m&limit=1'
   */
  @Get('candles')
  async candles(@Query('token') token: string,
    @Query('period') period,
    @Query('limit') limit,
    @Query('gap') gap
  ): Promise<string> {
    const st = new Date().getTime();
    if(!token || !period || !limit) {
      return 'error';
    }
    limit = parseInt(limit);

    const candles = await this.chainlinkService.getCandles(token, period, limit, gap);
    let jsonText = JSON.stringify(candles);
    this.logger.log(`Get candles: ${(new Date().getTime() - st) / 1000} s costed.`);
    return jsonText;
  }

  /**
   * get the candles of a target token
   * ETC: curl 'http://127.0.0.1:3002/api/v1/kline/prices24?token=ETH'
   */
   @Get('prices24')
   async prices24(@Query('token') token: string
   ) {
    const st = new Date().getTime();
     if(!token) {
       return 'error';
     }
 
     const prices = await this.chainlinkService.get24hPrices(token);
     this.logger.log(`Get prices24: ${(new Date().getTime() - st) / 1000} s costed.`);
     return prices;
   }

   @Get('tokendetail')
   async tokendetail(@Query('token') token: string
   ) {
    const st = new Date().getTime();
     if(!token) {
       return 'error';
     }
 
     const detail = await this.chainlinkService.getTokenInfo(token);
     this.logger.log(`Get prices24: ${(new Date().getTime() - st) / 1000} s costed.`);
     return detail;
   }
}
