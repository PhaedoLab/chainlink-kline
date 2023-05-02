import { Test, TestingModule } from '@nestjs/testing';
import { ChainlinkController } from './chainlink.controller';

describe('ChainlinkController', () => {
  let controller: ChainlinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChainlinkController],
    }).compile();

    controller = module.get<ChainlinkController>(ChainlinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
