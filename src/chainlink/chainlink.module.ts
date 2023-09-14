import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prices, Period, CMCPrice } from './chainlink.entiry';
import { HttpModule } from '@nestjs/axios';
import { CmcService } from './cmc.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prices, Period, CMCPrice]), 
    HttpModule.register({
      baseURL: "https://pro-api.coinmarketcap.com",
      headers: {
          "X-CMC_PRO_API_KEY": "c75d4f39-1cb7-4e13-aa77-402d685a103a"
        }
    }),  
  ],
  exports: [TypeOrmModule],
  providers: [],
  controllers: [],
})
export class ChainlinkModule {}