import { Controller, Get, Logger, Query, UseInterceptors } from '@nestjs/common';
import { GraphService } from './graph.service';

@Controller('api/v1/graph')
export class GraphController {
  private readonly logger = new Logger(GraphController.name);
  
  constructor(private readonly graphService: GraphService) {}

  /**
   * get the lastest prices of a target token
   * ETC: curl 'http://127.0.0.1:3002/api/prices?token=ETH'
   */
  @Get('tlocked')
  async tlocked(): Promise<any> {
    const data = 680000000;
    return {
      value: data,
    };
  }

  @Get('tvolume')
  async tvolume(): Promise<any> {
    const data = 680000000;
    return {
      value: data,
    };
  }

  @Get('volume24')
  async volume24(): Promise<any> {
    const data = 1000000;
    return {
      value: data,
    };
  }

  @Get('ttradingfee')
  async ttradingfee(): Promise<any> {
    const data = 20000;
    return {
      value: data,
    };
  }

  @Get('tusers')
  async tusers(): Promise<any> {
    const data = 864;
    return {
      value: data,
    };
  }

  @Get('trades')
  async trades(@Query('num') num, @Query('ledger') ledger, @Query('lastid') lastid,  @Query('old') old): Promise<any> {
    if(!num) {
      num = '10'
    }
    if(!ledger) {
      ledger = '0';
    }
    if(!lastid) {
      lastid = "";
    }
    if(!old) {
      old = '0';
    }
    if(old === '1' && lastid === '') {
      return {}
    }
    this.logger.log(typeof num, typeof ledger, typeof lastid, typeof old);
    this.logger.log(`Number: ${num}, Ledger: ${ledger}.`);
    const trades = await this.graphService.getHistory(ledger, num, lastid, old);
    return {
      trades,
    };
  }

  @Get('lvol24')
  async lvol24(@Query('ledger') ledger): Promise<any> {
    if(!ledger) {
      ledger = 0;
    }
    this.logger.log(`Ledger: ${ledger}.`);
    // const vols = await this.graphService.getLast24H(ledger);
    const vols = await this.graphService.getLast24H(ledger);
    return {
      value: vols
    };
  }

  @Get('lvols')
  async lvols(@Query('ledger') ledger): Promise<any> {
    if(!ledger) {
      ledger = 0;
    }
    this.logger.log(`Ledger: ${ledger}.`);
    const vols = await this.graphService.getLVols(ledger);
    return {
      value: vols
    };
  }
}
