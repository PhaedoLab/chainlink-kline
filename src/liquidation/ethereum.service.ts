import { Injectable } from '@nestjs/common';
import { ethers, BigNumber } from "ethers";

@Injectable()
export class EthereumService {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  private erc20: ethers.Contract;
  private jungleWrapper: ethers.Contract;
  private contractAddr: string;
  private riskResFund: string;

  private ABI = [
    "function liquidationRatio(uint ledger, address user) external view returns(int256)",
    "function liquidation(uint ledger, address user) external",
    "function allLedgers() external view returns(uint[] memory)",
    "function allActiveAddrs(uint ledger) external view returns (address[] memory)"
  ];

  private erc20ABI = [
    "function balanceOf(address account) external view returns (uint256)",
  ];

  private jungelWrapperABI = [
    "function allLedgers() external view returns(uint[] memory,string[] memory,uint[] memory,bool[] memory,uint8[][] memory)",
  ];

  constructor() {
    const rpc = 'https://arb-goerli.g.alchemy.com/v2/Py17iqVe0nh_q0XwUWvXoQiRqVjarG0M';
    this.provider = new ethers.providers.JsonRpcProvider(rpc);
    const privateKey = '130b1380f8e1ee25ce026e1a9cade501139f3db26c751060c5efa0af8f48ef09';
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contractAddr = '0xea943e47D8a41E8FCFDf4498C6296f59A6372A2f';
    this.contract = new ethers.Contract(this.contractAddr, this.ABI, this.wallet);

    const jusdAddr = '0xD35cF3B60ef47932493fDa61BA6553dbc1BBB70b';
    this.erc20 = new ethers.Contract(jusdAddr, this.erc20ABI, this.wallet);

    const wrapperContract = '0xeB51d8B19CccD9eD15a1f6B8312cb2ceF0059e58';
    this.jungleWrapper = new ethers.Contract(wrapperContract, this.jungelWrapperABI, this.wallet);

    this.riskResFund = '0x344CB4a9C9D73f1d537fD4947Ac72229B311635B';
  }

  async allLedgers() {
    let ledgers: any;
    try {
      ledgers = await this.jungleWrapper.allLedgers();
    } catch(error) {
      console.log(error);
    }
    return ledgers;
  }

  async getJungleBalanceOf() {
    let balanceOf: any;
    try {
      balanceOf = await this.erc20.balanceOf(this.contractAddr);
    } catch(error) {
      console.log(error);
    }
    return balanceOf.toString();
  }

  async getRiskFundBalanceOf() {
    let balanceOf: any;
    try {
      balanceOf = await this.erc20.balanceOf(this.riskResFund);
    } catch(error) {
      console.log(error);
    }
    return balanceOf.toString();
  }
  
  async getAllLedgers() {
    let ledgers = [];
    try {
      ledgers = await this.contract.allLedgers();
    } catch(error) {
      console.log(error);
    }
    return ledgers;
  }

  async getLedgerUsers(ledger: BigNumber) {
    let users = [];
    try{
      users = await this.contract.allActiveAddrs(ledger);
    } catch(error) {
      console.log(error);
    }
    return users;
  }

  async getLiquidationRatio(ledger: BigNumber, user: string) {
    let ratio: BigNumber;
    try{
      ratio = await this.contract.liquidationRatio(ledger, user);
    } catch(error) {
      console.log(error);
    }
    return ratio;
  }

  async liquidate(ledger: BigNumber, user: string) {
    try{
      console.log(`liquidating user: ${ledger} ${user}.`);
      await this.contract.liquidation(ledger, user);
      return true;
    } catch(error) {
      console.log(`liquidation user: ${ledger} ${user} failed.`);
      console.log(error);
      return false;
    }
  }
}
