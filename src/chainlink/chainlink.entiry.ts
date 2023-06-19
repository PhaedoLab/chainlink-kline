import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity('prices')
export class Prices {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'token_name', type: 'varchar', length: 20, default: '', nullable: true })
  tokenName: string;

  @Column({ name: 'round_id', type: 'varchar', length: 50, default: '', nullable: true })
  roundId: string;

  @Column({ name: 'phrase', type: 'varchar', length: 50, default: '', nullable: true })
  phrase: string;

  @Column({ name: 'agg_round_id', type: 'varchar', length: 50, default: '', nullable: true })
  aggRoundId: string;

  @Column({ type: 'varchar', length: 50, default: '', nullable: true })
  answer: string;

  @Column({ name: 'started_at', type: 'varchar', length: 50, default: '', nullable: true })
  startedAt: string;

  @Column({ name: 'updated_at', type: 'varchar', length: 50, default: '', nullable: true })
  updatedAt: string;

  @Column({ name: 'answered_in_round', type: 'varchar', length: 50, default: '', nullable: true })
  answeredInRound: string;
}

@Entity('period')
export class Period {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'token_name',type: 'varchar', length: 20, nullable: false })
  tokenName: string;
  
  @Column({ type: 'varchar', length: 20, nullable: false })
  period: string;

  @Column({ type: 'double', nullable: false })
  o: number;

  @Column({ type: 'double', nullable: false })
  c: number;

  @Column({ type: 'double', nullable: false })
  h: number;

  @Column({ type: 'double', nullable: false })
  l: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  t: string;
}