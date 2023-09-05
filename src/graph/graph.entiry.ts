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
