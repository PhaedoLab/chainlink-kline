import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { SendEmailCommand, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
import { SESClient } from "@aws-sdk/client-ses";
import { Emails, JEmails } from "./base.entiry";
import { Repository, InsertResult, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';


const sesClient = new SESClient({ region: 'us-west-1' });
const createSendEmailCommand = (toAddress, fromAddress, content, subject) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: content,
        },
        Text: {
          Charset: "UTF-8",
          Data: content,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const createSendTemplatedEmailCommand = (toAddress, fromAddress, template, data, unsub='') => {
  return new SendTemplatedEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Template: template, // required
    TemplateData: data, // required
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
    // Tags: [
    //   {
    //     Name: "List-Unsubscribe",
    //     Value: unsub,
    //   },
    // ]
  });
};

@Injectable()
export class BaseService {
  private readonly logger = new Logger(BaseService.name);

  constructor(
    @InjectRepository(Emails)
    private emailsRepository: Repository<Emails>,
    @InjectRepository(JEmails)
    private jemailsRepository: Repository<JEmails>
  ) {}
  
  /**
   * Mysql Emails operation
   */

  findBundleEmails(email: string): Promise<Emails> {
    return this.emailsRepository
      .createQueryBuilder('email')
      .where(`email.email = :email`, 
        { email: email })
      .getOne();
  }

  insertManyEmails(emails: Emails[]): Promise<InsertResult> {
    return this.emailsRepository.insert(emails);
  }

  updateBundleEmails(newEmail: string, active: number, code): Promise<UpdateResult> {
    return this.emailsRepository
      .createQueryBuilder()
      .update(Emails)
      .set({ active, code })
      .where("email = :email", { email: newEmail })
      .execute();
  }

  /**
   * Mysql JEmails operation
   */

  findVerifiedJEmails(): Promise<JEmails[]> {
    return this.jemailsRepository
      .createQueryBuilder('email')
      .where(`email.verify = :verify`, 
        { verify: 1 })
      .getMany();
  }

  findBundleJEmails(account: string): Promise<JEmails> {
    return this.jemailsRepository
      .createQueryBuilder('email')
      .where(`email.account = :account`, 
        { account: account })
      .getOne();
  }

  findBundleJEmailsByEmail(email: string): Promise<JEmails> {
    return this.jemailsRepository
      .createQueryBuilder('email')
      .where(`email.email = :email`, 
        { email: email })
      .getOne();
  }

  insertManyJEmails(emails: JEmails[]): Promise<InsertResult> {
    return this.jemailsRepository.insert(emails);
  }

  updateManyJEmails(jemail: JEmails): Promise<UpdateResult> {
    return this.jemailsRepository
      .createQueryBuilder()
      .update(JEmails)
      .set({ email: jemail.email, general: jemail.general, trading: jemail.trading, code: jemail.code, verify: jemail.verify })
      .where('account = :account', { account: jemail.account })
      .execute();
  }

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
        swap: 'https://app.uniswap.org/#/swap',
        buy: 'https://www.moonpay.com/buy',
        bridge: 'https://testnet.layerswap.io/'
      },
      eth: {
        buy: 'https://buy.simplex.com/',
        bridge: 'https://bridge.arbitrum.io/'
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

  async notifyAllVerifiedEmails() {
    const emails = await this.findVerifiedJEmails();
    for(let i = 0; i < emails.length; i++) {
      const email = emails[i];
      this._sendCommonEmail(email.email, `General Notification from Jungle Protocol.`, 'General Notification');
      console.log(`Send ${email.email} success!`);
    }
  }

  /**
   * Jungle open/close/liquidation sending email
   */
  async open(account: string, email: string, poolName: string, timestamp: string, amount: string, name: string) {
    const emailObj = await this.findBundleJEmails(account);
    if(emailObj && emailObj.trading === 1) {
      const content = `You just opened position in ${poolName} debt pool at ${timestamp}. Transaction Details: ${amount} ${name}`;
      const title = `Open Position`;
      this.logger.log(`${title} Send ${email} success!`);
      this._sendTemplateEmail(email, 'open-position',
        JSON.stringify({
          "official_url": "https://main.d6j42zwh06pm8.amplifyapp.com/",
          title,
          content
        })
      );
    }
  }

  async close(account: string, email: string, poolName: string, timestamp: string, amount: string, name: string) {
    const emailObj = await this.findBundleJEmails(account);
    if(emailObj && emailObj.trading === 1) {
      const content = `You just closed position in ${poolName} debt pool at ${timestamp}. Transaction Details: ${amount} ${name}`;
      const title = `Close Position`;
      this.logger.log(`${title} Send ${email} success!`);
      this._sendTemplateEmail(email, 'close-position',
        JSON.stringify({
          "official_url": "https://main.d6j42zwh06pm8.amplifyapp.com/",
          title,
          content
        })
      );
    }
  }

  async liquidation(account: string, poolName: string, timestamp: string) {
    const email = await this.findBundleJEmails(account);
    if(email && email.trading === 1) {
      const content = `Your position in ${poolName} debt pool was liquidated at ${timestamp}`;
      const title = `Liquidation`;
      this.logger.log(`${title} Send ${email} success!`);
      this._sendTemplateEmail(email.email, 'liqui',
        JSON.stringify({
          "official_url": "https://main.d6j42zwh06pm8.amplifyapp.com/",
          title,
          content
        })
      );
    }
  }

  async warning(account: string, poolName: string) {
    const email = await this.findBundleJEmails(account);
    if(email && email.trading === 1) {
      const content = `Your position in ${poolName} debt pool is closed to be liquidated.`;
      const title = `Liquidation Warning`;
      this.logger.log(`${title} Send ${email} success!`);
      this._sendTemplateEmail(email.email, 'liqui-warning',
        JSON.stringify({
          "official_url": "https://main.d6j42zwh06pm8.amplifyapp.com/",
          title,
          content
        })
      );
    }
  }


  async registe(email: string, account: string, general: number, trading: number) {
    let jMails: JEmails = await this.findBundleJEmails(account);
    if(jMails) {
      return {
        code: 800,
        msg: 'account already exists'
      }
    }
    jMails = new JEmails();
    jMails.account = account;
    jMails.email = email;
    jMails.general = general;
    jMails.trading = trading;
    jMails.code = crypto.createHash('sha256').update(email+Date.now()).digest('hex').substring(0, 50);;
    this.insertManyJEmails([jMails]);
    return this.sendVerifyEmail(email, account, jMails.code);
  }

  async updateEmail(email: string, account: string, general: number, trading: number) {
    let jMails: JEmails = await this.findBundleJEmails(account);
    if(jMails) {
      jMails.code = crypto.createHash('sha256').update(email+Date.now()).digest('hex');
      if(jMails.email === email) {
        jMails.general = general;
        jMails.trading = trading;
        this.updateManyJEmails(jMails);
        return {
          code: 900,
          msg: 'ok'
        };
      } else {
        jMails = new JEmails();
        jMails.account = account;
        jMails.email = email;
        jMails.general = general;
        jMails.trading = trading;
        jMails.code = crypto.createHash('sha256').update(email+Date.now()).digest('hex');
        jMails.verify = 0;
        this.updateManyJEmails(jMails);
        return this.sendVerifyEmail(email, account, jMails.code);
      }
    } else {
      jMails = new JEmails();
      jMails.account = account;
      jMails.email = email;
      jMails.general = general;
      jMails.trading = trading;
      jMails.code = crypto.createHash('sha256').update(email+Date.now()).digest('hex');
      this.insertManyJEmails([jMails]);
      return this.sendVerifyEmail(email, account, jMails.code);
    }
  }

  async verfify(account: string, code: string) {
    const jMails: JEmails = await this.findBundleJEmails(account);
    if(jMails) {
      if(jMails.code === code) {
        jMails.verify = 1;
        this.updateManyJEmails(jMails);
        return {
          code: 200,
          msg: 'ok'
        }
      } else {
        return {
          code: 400,
          msg: 'code error'
        }
      }
    } else {
      return {
        code: 300,
        msg: 'no data in database'
      }
    }
  }

  async getEmail(account: string) {
    const jMails: JEmails = await this.findBundleJEmails(account);
    if(jMails) {
      return {
        account: jMails.account,
        email: jMails.email,
        general: jMails.general,
        trading: jMails.trading,
        verify: jMails.verify
      };
    } else {
      return {
        code: 300,
        msg: 'no data in database'
      }
    }
  }

  async sendVerifyEmail(recepient: string, account: string, code: string) {
    // const content = `Click this url to verify: https://main.d7u2msnczqldy.amplifyapp.com?account=${account}&code=${code}`
    const url = `https://main.d7u2msnczqldy.amplifyapp.com?account=${account}&code=${code}`;
    return this._sendTemplateEmail(recepient, 'verify',
      JSON.stringify(
        {"official_url": "https://main.d6j42zwh06pm8.amplifyapp.com/", "app_url": url}
      )
    );
  }

  async _sendCommonEmail(recepient: string, content: string, subject: string) {
    const sendEmailCommand = createSendEmailCommand(
      recepient,
      "Jungle <official@jungle.exchange>",
      content, subject
    );
  
    try {
      const res = await sesClient.send(sendEmailCommand);
      return {
        code: res.$metadata.httpStatusCode,
        msg: 'ok'
      };
    } catch (e) {
      console.error("Failed to send email.");
      console.error(Object.keys(e));
      console.error(e.message);
      console.error(e.Code);
      return {
        code: e.$metadata.httpStatusCode,
        msg: e?.message
      };
    }
  }

  async sendEmail(recepient: string, account: string='') {
    const code = crypto.createHash('sha256').update(recepient+Date.now()).digest('hex').substring(0, 50);;
    const unsub = `https://main.d6j42zwh06pm8.amplifyapp.com/unsubscribe.html?token=${code}`;
    this._sendTemplateEmail(recepient, 'welcome',
      JSON.stringify({"official_url": "https://main.d6j42zwh06pm8.amplifyapp.com/",
        "unsubscribe": unsub
      }), unsub
    );
    const emailObj = await this.findBundleEmails(recepient);
    if(emailObj) {
      let active = 0;
      if(emailObj.active === 0) {
        active = 1;
      }
      this.updateBundleEmails(recepient, active, code);
    } else {
      const email = new Emails();
      email.account = account;
      email.email = recepient;
      email.code = code;
      await this.insertManyEmails([email]);
    }
  }

  async unsubscribe(recepient: string, code: string) {
    const emailObj = await this.findBundleEmails(recepient);
    if(emailObj) {
      if(emailObj.code === code && emailObj.active === 1) {
        await this.updateBundleEmails(recepient, 0, code);
      } else {
        return {
          code: 400,
          msg: 'code error'
        }
      }
    }
    return {
      code: 200,
      msg: 'ok'
    };
  }
  
  async _sendTemplateEmail(recepient: string, template: string, data: string = "{}", unsub: string = '') {
    const sendEmailCommand = createSendTemplatedEmailCommand(
      recepient,
      "Jungle <official@jungle.exchange>",
      template, data, unsub
    );
  
    try {
      const res = await sesClient.send(sendEmailCommand);
      return {
        code: res.$metadata.httpStatusCode,
        msg: 'ok'
      };
    } catch (e) {
      console.error("Failed to send email.");
      console.error(Object.keys(e));
      console.error(e.message);
      console.error(e.Code);
      return {
        code: e.$metadata.httpStatusCode,
        msg: e?.message
      };
    }
  }

  async officialMedia() {
    return {
      twitter: 'https://twitter.com/jungle_exchange',
      discord: 'https://discord.com/invite/QhePXWPwX5',
      medium: 'https://medium.com/@junglefi.io',
      telegram: 'https://medium.com/@junglefi.io',
      github: 'https://medium.com/@junglefi.io',
    }
  }

  tokens() {
    return [
      {
        token: 'BTC',
        icon: 'https://jungle-nft.s3.us-west-1.amazonaws.com/jungle-website/btc.svg',
      },
      {
        token: 'ETH',
        icon: 'https://jungle-nft.s3.us-west-1.amazonaws.com/jungle-website/eth.svg',
      },
      {
        token: 'GBP',
        icon: 'https://jungle-nft.s3.us-west-1.amazonaws.com/jungle-website/gbp.svg',
      },
      {
        token: 'EUR',
        icon: 'https://jungle-nft.s3.us-west-1.amazonaws.com/jungle-website/eur.svg',
      },
      {
        token: 'JPY',
        icon: 'https://jungle-nft.s3.us-west-1.amazonaws.com/jungle-website/jpy.svg',
      },
      {
        token: 'XAU',
        icon: 'https://jungle-nft.s3.us-west-1.amazonaws.com/jungle-website/xau.svg',
      },
    ]
  }
}
