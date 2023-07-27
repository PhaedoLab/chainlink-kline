import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';

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

  defi(chain: string) {
    return {
      chain,
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

  multiLing() {
    try {
      // 相对路径是相对于应用程序根目录的
      const rawData = fs.readFileSync('./docs/jungle-multi-ling.json');
      const jsonData = JSON.parse(rawData.toString());
      return jsonData;
    } catch (error) {
      console.error(`Read file failed.`, error, fs);
      return null;
    }
  }
}
