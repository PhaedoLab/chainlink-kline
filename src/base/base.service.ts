import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BaseService {
  private readonly logger = new Logger(BaseService.name);

  constructor() {}

  community() {
    return {
      twitter: 'https://twitter.com/Jungle_Fi',
      discord: 'https://discord.com/invite/QhePXWPwX5',
      medium: 'https://medium.com/@junglefi.io',
    }
  }

  defi() {
    return {
      usdc: {
        swap: 'https://uniswap.org/',
        buy: 'https://uniswap.org/',
        bridge: 'https://uniswap.org/'
      },
      eth: {
        buy: 'https://uniswap.org/',
        bridge: 'https://uniswap.org/'
      }
    }
  }
}
