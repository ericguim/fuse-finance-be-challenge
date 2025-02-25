import { Injectable } from '@nestjs/common';
import { TransactionStatus } from '@prisma/client';
import { TransactionDto } from '../transaction/dto/transaction.dto';
import { TransactionRepository } from './transaction.repository';
import { EmailService } from '../email/email.service';
@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly emailService: EmailService,
  ) {}

  async getDailyTransactions(): Promise<TransactionDto[]> {
    return this.transactionRepository.getDailyTransactions();
  }

  async sendDailyReport(
    transactions: TransactionDto[],
    targetEmail?: string,
  ): Promise<void> {
    // Group transactions by status
    const successful = transactions.filter(
      (tx) => tx.status === TransactionStatus.SUCCESS,
    );
    const failed = transactions.filter(
      (tx) => tx.status === TransactionStatus.FAILED,
    );

    // Calculate total value of successful transactions
    const totalValue = successful.reduce(
      (sum, tx) => sum + tx.quantity * tx.price,
      0,
    );

    // Generate report content
    const report = `
        Daily Transaction Report
        Date: ${new Date().toISOString().split('T')[0]}
        
        Successful Transactions: ${successful.length}
        Failed Transactions: ${failed.length}
        Total Transaction Value: $${totalValue.toFixed(2)}
        
        Transaction Details:
        ${transactions
          .map(
            (tx) =>
              `- ${tx.createdAt!.toISOString()}: ${tx.userId} ${
                tx.status
              } ${tx.quantity} ${tx.symbol} @ $${tx.price}`,
          )
          .join('\n')}
      `;

    console.log('Daily Report:', report);
    await this.emailService.sendEmail(
      report,
      targetEmail ?? process.env.DEFAULT_REPORT_EMAIL!,
    );
  }

  create(transaction: TransactionDto) {
    return this.transactionRepository.create(transaction);
  }
}
