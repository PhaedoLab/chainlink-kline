import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChainlinkService } from './chainlink.service';
import { ChainlinkController } from './chainlink.controller';
import { Prices } from './chainlink.entiry';

@Module({
  imports: [TypeOrmModule.forFeature([Prices])],
  exports: [TypeOrmModule],
  providers: [ChainlinkService],
  controllers: [ChainlinkController],
})
export class ChainlinkModule {}