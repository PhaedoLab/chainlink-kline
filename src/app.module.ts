import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChainlinkController } from './chainlink/chainlink.controller';
import { ChainlinkService } from './chainlink/chainlink.service';
import { ChainlinkModule } from './chainlink/chainlink.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prices, Period } from './chainlink/chainlink.entiry';
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
import { Collateral, RiskFund, USDStacked, Trade, Liquidation, Histogram, Trader } from './graph/graph.entiry';

@Module({
  imports: [
    ChainlinkModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      database: 'test',
      entities: [Prices, Period, Emails, JEmails, Collateral, USDStacked, Trade, Liquidation, RiskFund, Histogram, Trader],
      synchronize: true,
    }),
    BaseModule,
    GraphModule,
    LiquidationModule
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
    EthereumService
  ],
})
export class AppModule {}
