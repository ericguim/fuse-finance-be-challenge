import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionRepository } from './transaction.repository';
import { TransactionScheduler } from './transaction.scheduler';
import { EmailService } from '../email/email.service';
@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    PrismaService,
    TransactionRepository,
    TransactionScheduler,
    EmailService,
  ],
  exports: [TransactionService],
})
export class TransactionModule {}
