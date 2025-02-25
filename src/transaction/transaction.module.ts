import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionRepository } from './transaction.repository';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, TransactionRepository],
  exports: [TransactionService],
})
export class TransactionModule {}
