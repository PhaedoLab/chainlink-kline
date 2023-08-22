import { Controller, Get, Post, Body, Logger, Query } from '@nestjs/common';
import { BaseService } from './base.service';

export class EmailDto {
  recepient: string;
}

export class JEmailDto {
  account: string;
  email: string;
  general: string;
  trading: string;
  code: string;
  verify: string;
}

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

    @Get('multi_ling')
    async multiLing(): Promise<any> {
      const data = this.baseService.multiLing();
      return data;
    }
  /**
   * curl -H "Content-Type: application/json" -X POST -d '{"account": "123", "email": "faria.chen@ingroup.chat", "general": "1", "trading": "0" }' 'http://statistic.enchanter.fi/api/v1/base/registe'
   */
  @Post('registe')
   async registe(@Body() jEmailDto: JEmailDto): Promise<any> {
     if(jEmailDto.general !== '0' && jEmailDto.general !== '1') {
       return {
        code: 400,
        msg: 'general is invalid'
       }
     }
     if(jEmailDto.trading !== '0' && jEmailDto.trading !== '1') {
      return {
       code: 400,
       msg: 'trading is invalid'
      }
    }
     const community = this.baseService.registe(jEmailDto.email, jEmailDto.account, 
        parseInt(jEmailDto.general), parseInt(jEmailDto.trading));
     return community;
   }

   /**
    * curl -H "Content-Type: application/json" -X POST -d '{"account": "123", "email": "faria.chen@ingroup.chat", "general": "1", "trading": "0" }' 'http://statistic.enchanter.fi/api/v1/base/registe'
    */
   @Post('update')
   async update(@Body() jEmailDto: JEmailDto): Promise<any> {
    if(jEmailDto.general !== '0' && jEmailDto.general !== '1') {
      return {
       code: 400,
       msg: 'general is invalid'
      }
    }
    if(jEmailDto.trading !== '0' && jEmailDto.trading !== '1') {
     return {
      code: 400,
      msg: 'trading is invalid'
     }
   }
    const community = this.baseService.updateEmail(jEmailDto.email, jEmailDto.account, 
       parseInt(jEmailDto.general), parseInt(jEmailDto.trading));
    return community;
   }

   /**
    * curl -H "Content-Type: application/json" -X POST -d '{"account": "1234", "code": "8d22c3bc5cd879907d3cee4dc934228cc4dd252ee56c364ececc9366e413fad9"}' 'http://statistic.enchanter.fi/api/v1/base/verify'
    */
   @Post('verify')
   async verify(@Body() jEmailDto: JEmailDto): Promise<any> {
     const community = this.baseService.verfify(jEmailDto.account, jEmailDto.code);
     return community;
   }

   /**
    * curl 'http://statistic.enchanter.fi/api/v1/base/getemail?account=1234'
    */
   @Get('getemail')
   async getEmail(@Query('account') account: string): Promise<any> {
     const community = this.baseService.getEmail(account);
     return community;
   }

    // ================= WebSite =====================

    /**
   * get community urls like: discord telegram twitter
   * ETC: curl 'http://127.0.0.1:3002/api/v1/base/ocommunity'
   */
    @Get('ocommunity')
   async ocommunity(): Promise<any> {
     const community = this.baseService.officialMedia();
     return community;
   }

   /**
   * get community urls like: discord telegram twitter
   * ETC: curl 'http://127.0.0.1:3002/api/v1/base/send_email?recepient=xxx'
   */
   @Post('send_email')
    async sendEmail(@Body() emailDto: EmailDto): Promise<any> {
      const data = this.baseService.sendEmail(emailDto.recepient);
      return data;
    }
    
    /**
   * get community urls like: discord telegram twitter
   * ETC: curl 'http://127.0.0.1:3002/api/v1/base/tokens'
   */
    @Get('tokens')
    async tokens(): Promise<any> {
      const data = this.baseService.tokens();
      return data;
    }
}
