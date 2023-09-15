import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChainlinkController } from './chainlink/chainlink.controller';
import { ChainlinkService } from './chainlink/chainlink.service';
import { ChainlinkModule } from './chainlink/chainlink.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prices, Period, CMCPrice } from './chainlink/chainlink.entiry';
import { BaseController } from './base/base.controller';
import { Emails, JEmails } from './base/base.entiry';
import { BaseService } from './base/base.service';
import { BaseModule } from './base/base.module';
import { GraphController } from './graph/graph.controller';
import { GraphService } from './graph/graph.service';
import { GraphModule } from './graph/graph.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor, TransformInterceptor } from './app.interceptors';
import { LiquidationController } from './liquidation/liquidation.controller';
import { LiquidationService } from './liquidation/liquidation.service';
import { LiquidationModule } from './liquidation/liquidation.module';
import { EthereumService } from './liquidation/ethereum.service';
import { Collateral, RiskFund, USDStacked, Trade, Liquidation, Histogram, Trader, Trade3} from './graph/graph.entiry';
import { CmcService } from './chainlink/cmc.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ChainlinkModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      database: 'test',
      entities: [Prices, Period, Emails, JEmails, Collateral, USDStacked, Trade, Liquidation, RiskFund, Histogram, Trader, Trade3, CMCPrice],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // 指定文件存储的根目录
      serveRoot: '/public', // 可选，设置公开访问的文件路径前缀
    }),
    BaseModule,
    GraphModule,
    LiquidationModule,
    HttpModule.register({
      baseURL: "https://pro-api.coinmarketcap.com",
      headers: {
          "X-CMC_PRO_API_KEY": "c75d4f39-1cb7-4e13-aa77-402d685a103a"
        }
    }),  
  ],
  controllers: [AppController, ChainlinkController, BaseController, GraphController, LiquidationController],
  providers: [AppService, ChainlinkService, BaseService, GraphService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    LiquidationService,
    EthereumService,
    CmcService
  ],
})
export class AppModule {}
