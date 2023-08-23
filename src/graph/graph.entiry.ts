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
