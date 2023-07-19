import { Injectable } from '@nestjs/common';
import { ethers, BigNumber } from "ethers";

@Injectable()
export class EthereumService {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  private ABI = [
    "function liquidationRatio(uint ledger, address user) external view returns(int256)",
    "function liquidation(uint ledger, address user) external",
    "function allLedgers() external view returns(uint[] memory)",
    "function allActiveAddrs(uint ledger) external view returns (address[] memory)"
  ];

  constructor() {
    const rpc = 'https://arb-goerli.g.alchemy.com/v2/Py17iqVe0nh_q0XwUWvXoQiRqVjarG0M';
    this.provider = new ethers.providers.JsonRpcProvider(rpc);
    const privateKey = '130b1380f8e1ee25ce026e1a9cade501139f3db26c751060c5efa0af8f48ef09';
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    const contractAddr = '0x89D7a0A1f0E3204F3fcBC251a9C262B1A60bEd5E';
    this.contract = new ethers.Contract(contractAddr, this.ABI, this.wallet);
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
      await this.contract.liquidate(ledger, user);
    } catch(error) {
      console.log(error);
    }
  }
}
