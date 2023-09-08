import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USDStacked, Collateral, RiskFund, Trade, Liquidation, Histogram, Trader } from './graph.entiry';
import { EthereumService } from 'src/liquidation/ethereum.service';

@Module({
  imports: [TypeOrmModule.forFeature([USDStacked, Collateral, Trade, Liquidation, RiskFund, Histogram, Trader])],
  exports: [TypeOrmModule],
  providers: [EthereumService],
  controllers: [],
})
export class GraphModule {}
