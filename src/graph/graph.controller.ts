import { Body, Controller, Get, Logger, Post, Query, Res } from '@nestjs/common';
import { GraphService } from './graph.service';
import { Response } from 'express';

export class HistogramDto {
  start: string;
  end: string;
  dtype: string;
}

export class TableDto {
  start: string;
  end: string;
  dtype: string; // 
  page: string; 
  pagesize: string;
  account: string; //
  network: string;
  ledger: number; //
  order: string;
}

@Controller('api/v1/graph')
export class GraphController {
  private readonly logger = new Logger(GraphController.name);

  constructor(private readonly graphService: GraphService) {}

  /**
   * get the lastest prices of a target token
   * ETC: curl 'http://127.0.0.1:3002/api/v1/graph/tlocked'
   */
  @Get('tlocked')
  async tlocked(): Promise<any> {
    const tvl = await this.graphService.getTlocked();
    return {
      value: tvl,
    };
  }

  @Get('tvolume')
  async tvolume(): Promise<any> {
    const vol = await this.graphService.getTvolumeFee(true);
    return {
      value: vol,
    };
  }

  @Get('volume24')
  async volume24(): Promise<any> {
    const vol24 = await this.graphService.getVolume24(true);
    return {
      value: vol24,
    };
  }

  @Get('ttradingfee')
  async ttradingfee(): Promise<any> {
    const fee = await this.graphService.getTvolumeFee(false);
    return {
      value: fee,
    };
  }

  @Get('tusers')
  async tusers(): Promise<any> {
    const users = await this.graphService.getTusers();
    return {
      value: users,
    };
  }

  @Get('trades')
  async trades(@Query('num') num, @Query('ledger') ledger, @Query('offset') offset, @Query('account') account): Promise<any> {
    if(!ledger && !account) {
      throw new Error('ledger and account can not be null at the same time.');
    }
    if(!num) {
      num = '10'
    }
    if(!account) {
      account = ''
    } else {
      account = account.toLowerCase();
    }

    this.logger.log(`Number: ${num}, Ledger: ${ledger}.`);
    const trades = await this.graphService.getHistory(ledger, num, offset, account);
    return trades;
  }

  @Get('utrades')
  async utrades(@Query('ledger') ledger, @Query('account') account): Promise<any> {
    if(!ledger && !account) {
      throw new Error('ledger and account can not be null at the same time.');
    }
    if(!account) {
      account = ''
    } else {
      account = account.toLowerCase();
    }

    this.logger.log(`Ledger: ${ledger}.`);
    const trades = await this.graphService.getUHistory(ledger, account);
    return trades;
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

  @Get('liquidation')
  async liquidation(@Query('num') num, @Query('ledger') ledger, @Query('account') account): Promise<any> {
    if(!num) {
      num = '10'
    }

    this.logger.log(`Ledger: ${ledger}, Account: ${account}.`);
    const liqs = await this.graphService.getLiquidations(ledger, num, account);
    return liqs;
  }

  @Get('metrics')
  async metrics(): Promise<any> {
    const mets = await this.graphService.getMetrics();
    return mets;
  }

  @Post('histogram')
  async histograms(@Body() body: HistogramDto) {
    const start = body.start? parseInt(body.start): 0;
    const end = body.end? parseInt(body.end): 0;
    if(start === 0 || end === 0) {
      throw new Error('start and end can not be null at the same time.');
    }
    const hist = await this.graphService.getHistograms(start, end, body.dtype);
    return hist;
  }
  /**
   * curl -H "Content-Type: application/json" -X POST -d '{"start": 0, "end": 1690950621, "dtype":"liqui", "page": 0, "pagesize": 10  }' 'http://127.0.0.1:3000/api/v1/graph/tables'
   * curl -H "Content-Type: application/json" -X POST -d '{"start": 0, "end": 1690950621, "dtype":"opos", "page": 0, "pagesize": 10  }' 'http://127.0.0.1:3000/api/v1/graph/tables'
   */
  @Post('tables')
  async tables(@Body() body: TableDto) {
    this.logger.log(`body`);
    this.logger.log(body);
    const tables = await this.graphService.getTables(body);
    return tables;
  }

  @Post('downloadtables')
  async downloadtables(@Res() res: Response) {
    // const filePath = await this.graphService.downloadTables();
    const filePath = `public/test.txt`;
    res.download(filePath);
  }
}
