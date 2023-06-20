import { Controller, Get, Logger, Query } from '@nestjs/common';
import { BaseService } from './base.service';

@Controller('api/v1/base')
export class BaseController {

  private readonly logger = new Logger(BaseController.name);
  
  constructor(private readonly baseService: BaseService) {}

  /**
   * get community urls like: discord telegram twitter
   * ETC: curl 'http://127.0.0.1:3002/api/base/community'
   */
   @Get('community')
   async community(): Promise<any> {
     const community = this.baseService.community();
     return community;
   }

   /**
   * get defi operation urls
   * ETC: curl 'http://127.0.0.1:3002/api/base/defi'
   */
    @Get('defi')
    async defi(@Query('chain') chain: string): Promise<any> {
      this.logger.log(chain);
      if(!chain) {
        chain = 'arb';
      }
      const defi = this.baseService.defi(chain);
      return defi;
    }
}
