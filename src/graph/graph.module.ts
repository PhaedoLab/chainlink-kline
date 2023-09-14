import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USDStacked, Collateral, RiskFund, Trade, Liquidation, Histogram, Trader, Trade3 } from './graph.entiry';
import { EthereumService } from 'src/liquidation/ethereum.service';

@Module({
  imports: [TypeOrmModule.forFeature([USDStacked, Collateral, Trade, Liquidation, RiskFund, Histogram, Trader, Trade3])],
  exports: [TypeOrmModule],
  providers: [EthereumService],
  controllers: [],
})
export class GraphModule {}
