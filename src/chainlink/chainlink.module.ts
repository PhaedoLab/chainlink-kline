import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prices, Period } from './chainlink.entiry';

@Module({
  imports: [TypeOrmModule.forFeature([Prices, Period])],
  exports: [TypeOrmModule],
  providers: [],
  controllers: [],
})
export class ChainlinkModule {}