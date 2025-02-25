import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
@ApiTags('transaction')
@Controller('api/v1/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  /**
   * Generate and send daily report
   * It runs via schedule every day at 12:00 AM, but can be called manually to send the report immediately
   * @returns {Promise<{ message: string }>}
   */
  @Post('reports/daily')
  @ApiOperation({ summary: 'Generate and send daily report' })
  @ApiResponse({
    status: 200,
    description: 'Daily report generated and sent successfully',
  })
  async generateDailyReport(@Query('targetEmail') targetEmail: string) {
    const transactions = await this.transactionService.getDailyTransactions();
    await this.transactionService.sendDailyReport(transactions, targetEmail);
    return { message: 'Daily report generated and sent successfully' };
  }
}
