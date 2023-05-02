import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChainlinkController } from './chainlink/chainlink.controller';
import { ChainlinkService } from './chainlink/chainlink.service';
import { ChainlinkModule } from './chainlink/chainlink.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prices } from './chainlink/chainlink.entiry';

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
      entities: [Prices],
      synchronize: true,
    }),
  ],
  controllers: [AppController, ChainlinkController],
  providers: [AppService, ChainlinkService],
})
export class AppModule {}
