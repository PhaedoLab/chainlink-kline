import { Test, TestingModule } from '@nestjs/testing';
import { LiquidationController } from './liquidation.controller';

describe('LiquidationController', () => {
  let controller: LiquidationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiquidationController],
    }).compile();

    controller = module.get<LiquidationController>(LiquidationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
