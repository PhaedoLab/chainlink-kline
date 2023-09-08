import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usdstacked')
export class USDStacked {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'user', type: 'varchar', length: 50, default: '', nullable: true })
  user: string;

  @Column({ name: 'amount', type: 'varchar', length: 50, default: '', nullable: true })
  amount: string;
  
  @Column({ name: 'mint', type: 'tinyint', default: 0, nullable: true })
  mint: number;

  @Column({ name: 'timestamp', type: 'varchar', length: 50, default: '', nullable: true })
  timestamp: string;
}

@Entity('collateral')
export class Collateral {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'amount', type: 'varchar', length: 50, default: '', nullable: true })
  amount: string;

  @Column({ name: 'timestamp', type: 'varchar', length: 50, default: '', nullable: true })
  timestamp: string;
}

// ALTER TABLE `trades` ADD UNIQUE INDEX unitrader (trader);
@Entity('trades')
export class Trader {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'trader', type: 'varchar', length: 50, default: '', nullable: true })
  trader: string;

  @Column({ name: 'timestamp', type: 'varchar', length: 50, default: '', nullable: true })
  timestamp: string;
}

@Entity('riskfund')
export class RiskFund {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'amount', type: 'varchar', length: 50, default: '', nullable: true })
  amount: string;

  @Column({ name: 'timestamp', type: 'varchar', length: 50, default: '', nullable: true })
  timestamp: string;
}

@Entity('trade')
export class Trade {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'ledger', type: 'tinyint', default: -1, nullable: true })
  ledger: number;

  @Column({ name: 'account', type: 'varchar', length: 50, default: '', nullable: true })
  account: string;

  @Column({ name: 'currencykey', type: 'varchar', length: 50, default: '', nullable: true })
  currencyKey: string;

  @Column({ name: 'amount', type: 'varchar', length: 100, default: '', nullable: true })
  amount: string;
  
  @Column({ name: 'keyprice', type: 'varchar', length: 50, default: '', nullable: true })
  keyPrice: string;

  @Column({ name: 'fee', type: 'varchar', length: 100, default: '', nullable: true })
  fee: string;

  @Column({ name: 'typet', type: 'tinyint', default: -1, nullable: true })
  typet: number;

  @Column({ name: 'totalval', type: 'varchar', length: 100, default: '', nullable: true })
  totalVal: string;

  @Column({ name: 'timestamp', type: 'varchar', length: 50, default: '', nullable: true })
  timestamp: string;

  @Column({ name: 'eventid', type: 'varchar', length: 60, default: '', nullable: true })
  eventid: string;

  @Column({ name: 'pnl', type: 'varchar', length: 100, default: '', nullable: true })
  pnl: string;

  @Column({ name: 'hash', type: 'varchar', length: 100, default: '', nullable: true })
  hash: string;
}


@Entity('liquidation')
export class Liquidation {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'ledger', type: 'tinyint', default: -1, nullable: true })
  ledger: number;

  @Column({ name: 'account', type: 'varchar', length: 50, default: '', nullable: true })
  account: string;

  @Column({ name: 'operator', type: 'varchar', length: 50, default: '', nullable: true })
  operator: string;

  @Column({ name: 'collateral', type: 'varchar', length: 50, default: '', nullable: true })
  collateral: string;

  @Column({ name: 'debt', type: 'varchar', length: 100, default: '', nullable: true })
  debt: string;
  
  @Column({ name: 'totalDebt', type: 'varchar', length: 50, default: '', nullable: true })
  totalDebt: string;

  @Column({ name: 'normal', type: 'tinyint', default: -1, nullable: true })
  normal: number;

  @Column({ name: 'eventid', type: 'varchar', length: 60, default: '', nullable: true })
  eventid: string;

  @Column({ name: 'timestamp', type: 'varchar', length: 50, default: '', nullable: true })
  timestamp: string;

  @Column({ name: 'hash', type: 'varchar', length: 100, default: '', nullable: true })
  hash: string;
}

@Entity('histogram')
export class Histogram {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'tvl', type: 'varchar', length: 50, default: '', nullable: true })
  tvl: string;

  @Column({ name: 'ttvl', type: 'varchar', length: 50, default: '', nullable: true })
  ttvl: string;

  @Column({ name: 'vol', type: 'varchar', length: 50, default: '', nullable: true })
  vol: string;

  @Column({ name: 'tvol', type: 'varchar', length: 50, default: '', nullable: true })
  tvol: string;

  @Column({ name: 'traders', type: 'varchar', length: 50, default: '', nullable: true })
  traders: string;

  @Column({ name: 'ttraders', type: 'varchar', length: 50, default: '', nullable: true })
  ttraders: string;

  @Column({ name: 'trades', type: 'varchar', length: 50, default: '', nullable: true })
  trades: string;

  @Column({ name: 'ttrades', type: 'varchar', length: 50, default: '', nullable: true })
  ttrades: string;

  @Column({ name: 'fee', type: 'varchar', length: 50, default: '', nullable: true })
  fee: string;

  @Column({ name: 'tfee', type: 'varchar', length: 50, default: '', nullable: true })
  tfee: string;

  @Column({ name: 'rfund', type: 'varchar', length: 50, default: '', nullable: true })
  rfund: string;

  @Column({ name: 'trfund', type: 'varchar', length: 50, default: '', nullable: true })
  trfund: string;

  @Column({ name: 'timestamp', type: 'varchar', length: 50, default: '', nullable: true })
  timestamp: string;
}