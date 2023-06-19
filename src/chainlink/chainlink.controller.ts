import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ChainlinkService } from './chainlink.service';

@Controller('api/')
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
  @Get('candles/:token')
  async candles(@Param('token') token: string,
    @Query('period') period,
    @Query('limit') limit
  ): Promise<string> {
    if(!token || !period || !limit) {
      return 'error';
    }
    this.logger.log(token, period, limit);

    const candles = await this.chainlinkService.getCandles(token, period, limit);
    let jsonText = JSON.stringify(candles);
    return jsonText;
  }
}
