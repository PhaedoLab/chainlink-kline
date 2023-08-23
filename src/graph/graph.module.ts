import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USDStacked, Collateral } from './graph.entiry';
import { EthereumService } from 'src/liquidation/ethereum.service';

@Module({
  imports: [TypeOrmModule.forFeature([USDStacked, Collateral])],
  exports: [TypeOrmModule],
  providers: [EthereumService],
  controllers: [],
})
export class GraphModule {}
