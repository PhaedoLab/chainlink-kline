import { Module } from '@nestjs/common';
import { BaseModule } from 'src/base/base.module';
import { BaseService } from 'src/base/base.service';

@Module({
  imports: [BaseModule],
  providers: [BaseService],
  controllers: [],
})
export class LiquidationModule {}
