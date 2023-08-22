import { Controller, Get, Logger, Query } from '@nestjs/common';
import { LiquidationService } from './liquidation.service';

@Controller('api/v1/liq')
export class LiquidationController {
  private readonly logger = new Logger(LiquidationController.name);

  constructor(private readonly liquidationService: LiquidationService) {}

  @Get('trigger')
  async trigger(@Query('state') state) {
    await this.liquidationService.manualTrigger(state);
  }

  @Get('info')
  async getInfo(@Query('state') state) {
    const info = await this.liquidationService.getQueueInfo(state);
    return info;
  }
}
