import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChainlinkController } from './chainlink/chainlink.controller';
import { ChainlinkService } from './chainlink/chainlink.service';
import { ChainlinkModule } from './chainlink/chainlink.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ChainlinkModule, 
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '54.183.182.125',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController, ChainlinkController],
  providers: [AppService, ChainlinkService],
})
export class AppModule {}
