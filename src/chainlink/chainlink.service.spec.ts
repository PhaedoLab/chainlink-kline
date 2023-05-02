import { Test, TestingModule } from '@nestjs/testing';
import { ChainlinkService } from './chainlink.service';

describe('ChainlinkService', () => {
  let service: ChainlinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChainlinkService],
    }).compile();

    service = module.get<ChainlinkService>(ChainlinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
