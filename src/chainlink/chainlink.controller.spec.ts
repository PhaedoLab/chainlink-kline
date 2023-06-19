import { Test, TestingModule } from '@nestjs/testing';
import { ChainlinkController } from './chainlink.controller';
import { ChainlinkService } from './chainlink.service';

describe('ChainlinkController', () => {
  let controller: ChainlinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChainlinkController],
      providers: [ChainlinkService],
    }).compile();

    controller = module.get<ChainlinkController>(ChainlinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
