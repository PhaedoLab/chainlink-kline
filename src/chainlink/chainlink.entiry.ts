import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity('prices')
export class Prices {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'token_name', type: 'varchar', length: 20, default: '', nullable: true })
  tokenName: string;

  @Column({ name: 'round_id', type: 'varchar', length: 50, default: '', nullable: true })
  roundId: string;

  @Column({ type: 'varchar', length: 50, default: '', nullable: true })
  answer: string;

  @Column({ name: 'started_at', type: 'varchar', length: 50, default: '', nullable: true })
  startedAt: string;

  @Column({ name: 'updated_at', type: 'varchar', length: 50, default: '', nullable: true })
  updatedAt: string;

  @Column({ name: 'answered_in_round', type: 'varchar', length: 50, default: '', nullable: true })
  answeredInRound: string;
}