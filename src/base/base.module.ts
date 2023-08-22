import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emails, JEmails } from './base.entiry';

@Module({
  imports: [TypeOrmModule.forFeature([Emails, JEmails])],
  exports: [TypeOrmModule],
  providers: [],
  controllers: [],
})
export class BaseModule {}
