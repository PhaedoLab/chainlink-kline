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
import { BaseService } from './base/base.service';
import { BaseModule } from './base/base.module';
import { GraphController } from './graph/graph.controller';
import { GraphService } from './graph/graph.service';
import { GraphModule } from './graph/graph.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor, TransformInterceptor } from './app.interceptors';

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
      entities: [Prices, Period],
      synchronize: true,
    }),
    BaseModule,
    GraphModule
  ],
  controllers: [AppController, ChainlinkController, BaseController, GraphController],
  providers: [AppService, ChainlinkService, BaseService, GraphService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
