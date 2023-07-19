import { Controller, Get, Logger } from '@nestjs/common';
import { LiquidationService } from './liquidation.service';

@Controller('api/v1/liq')
export class LiquidationController {
  private readonly logger = new Logger(LiquidationController.name);

  constructor(private readonly liquidationService: LiquidationService) {}

  @Get('trigger')
  async trigger() {
    await this.liquidationService.test();
  }
}
