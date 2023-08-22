import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity('emails')
export class Emails {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 50, default: '', nullable: true })
  email: string;

  @Column({ name: 'account', type: 'varchar', length: 50, default: '', nullable: true })
  account: string;

  @Column({ name: 'started_at', type: 'varchar', length: 50, default: '', nullable: true })
  startedAt: string;

  @Column({ name: 'updated_at', type: 'varchar', length: 50, default: '', nullable: true })
  updatedAt: string;
}


@Entity('jemails')
export class JEmails {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 50, default: '', nullable: true })
  email: string;

  @Column({ name: 'account', type: 'varchar', length: 50, default: '', nullable: true })
  account: string;
  
  @Column({ name: 'general', type: 'tinyint', default: 0, nullable: true })
  general: number;

  @Column({ name: 'trading', type: 'tinyint', default: 0, nullable: true })
  trading: number;

  @Column({ name: 'code', type: 'varchar', length: 500, nullable: true })
  code: string;

  @Column({ name: 'verify', type: 'tinyint', default: 0, nullable: true })
  verify: number;

  @Column({ name: 'started_at', type: 'varchar', length: 50, default: '', nullable: true })
  startedAt: string;

  @Column({ name: 'updated_at', type: 'varchar', length: 50, default: '', nullable: true })
  updatedAt: string;
}
