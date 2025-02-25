import NodeCache from 'node-cache';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  TransactionDto,
  TransactionType,
  TransactionStatus,
} from './dto/transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDailyTransactions(): Promise<TransactionDto[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
    });

    return transactions.map((tx) => ({
      ...tx,
      type: tx.type as TransactionType,
      status: tx.status as TransactionStatus,
    }));
  }

  create(transaction: TransactionDto) {
    return this.prisma.transaction.create({
      data: transaction,
    });
  }
}
