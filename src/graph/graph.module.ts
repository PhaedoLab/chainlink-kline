import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USDStacked, Collateral, Trade } from './graph.entiry';
import { EthereumService } from 'src/liquidation/ethereum.service';

@Module({
  imports: [TypeOrmModule.forFeature([USDStacked, Collateral, Trade])],
  exports: [TypeOrmModule],
  providers: [EthereumService],
  controllers: [],
})
export class GraphModule {}
