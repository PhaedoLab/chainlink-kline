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

  it('function: _build5MCandles', async () => {
    let lastDate = new Date(2023, 4, 8, 11, 59, 30);
    let currentDate = new Date(2023, 4, 8, 12, 1, 0);
    console.log(lastDate, currentDate);
    let candle = await service._build5MCandles('BTC', lastDate, currentDate)
    if(candle) {
      console.log(
        '_build15MCandles',
        new Date(candle.start),
        new Date(candle.end),
        new Date(candle.timestamp),
      );
    }

    lastDate = new Date(2023, 4, 8, 12, 4, 30);
    currentDate = new Date(2023, 4, 8, 12, 5, 0);
    console.log(lastDate, currentDate);
    candle = await service._build5MCandles('BTC', lastDate, currentDate)
    if(candle) {
      console.log(
        '_build15MCandles',
        new Date(candle.start),
        new Date(candle.end),
        new Date(candle.timestamp),
      );
    }
  });

  it('function: _build15MCandles', async () => {
    let lastDate = new Date(2023, 4, 8, 11, 59, 30);
    let currentDate = new Date(2023, 4, 8, 12, 1, 0);
    console.log(lastDate, currentDate);
    let candle = await service._build15MCandles('BTC', lastDate, currentDate)
    if(candle) {
      console.log(
        '_build15MCandles',
        new Date(candle.start),
        new Date(candle.end),
        new Date(candle.timestamp),
      );
    }

    lastDate = new Date(2023, 4, 8, 12, 14, 30);
    currentDate = new Date(2023, 4, 8, 12, 15, 10);
    console.log(lastDate, currentDate);
    candle = await service._build15MCandles('BTC', lastDate, currentDate)
    if(candle) {
      console.log(
        '_build15MCandles',
        new Date(candle.start),
        new Date(candle.end),
        new Date(candle.timestamp),
      );
    }
  });

  it('function: _build1HCandles', async () => {
    let lastDate = new Date(2023, 4, 8, 11, 59, 30);
    let currentDate = new Date(2023, 4, 8, 12, 0, 30);
    console.log(lastDate, currentDate);
    let candle = await service._build1HCandles('BTC', lastDate, currentDate)
    if(candle) {
      console.log(
        '_build1HCandles',
        new Date(candle.start),
        new Date(candle.end),
        new Date(candle.timestamp),
      );
    }
  });

  it('function: _build4HCandles', async () => {
    let lastDate = new Date(2023, 4, 8, 11, 59, 0);
    let currentDate = new Date(2023, 4, 8, 12, 0, 30);
    console.log(lastDate, currentDate);
    let candle = await service._build4HCandles('BTC', lastDate, currentDate)
    if(candle) {
      console.log(
        '_build4HCandles',
        new Date(candle.start),
        new Date(candle.end),
        new Date(candle.timestamp),
      );
    }
  });

  it('function: _build1DCandles', async () => {
    let lastDate = new Date(2023, 4, 8, 23, 59, 30);
    let currentDate = new Date(2023, 4, 8, 0, 0, 10);
    console.log(lastDate, currentDate);
    let candle = await service._build1DCandles('BTC', lastDate, currentDate)
    if(candle) {
      console.log(
        '_build1DCandles',
        new Date(candle.start),
        new Date(candle.end),
        new Date(candle.timestamp),
      );
    }
  });
});
