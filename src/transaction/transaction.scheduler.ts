import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TransactionService } from './transaction.service';

@Injectable()
export class TransactionScheduler {
  constructor(private readonly transactionService: TransactionService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyReport() {
    try {
      const transactions = await this.transactionService.getDailyTransactions();
      await this.transactionService.sendDailyReport(transactions);
    } catch (error) {
      console.error('Failed to generate daily report:', error);
    }
  }
}
