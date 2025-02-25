import { Test, TestingModule } from '@nestjs/testing';
import { TransactionScheduler } from './transaction.scheduler';
import { TransactionService } from './transaction.service';

describe('TransactionScheduler', () => {
  let scheduler: TransactionScheduler;
  let mockTransactionService: Partial<TransactionService>;

  beforeEach(async () => {
    mockTransactionService = {
      getDailyTransactions: jest.fn().mockResolvedValue([]),
      sendDailyReport: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionScheduler,
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    scheduler = module.get<TransactionScheduler>(TransactionScheduler);
  });

  describe('handleDailyReport', () => {
    it('should call getDailyTransactions and sendDailyReport', async () => {
      await scheduler.handleDailyReport();

      expect(mockTransactionService.getDailyTransactions).toHaveBeenCalled();
      expect(mockTransactionService.sendDailyReport).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockTransactionService.getDailyTransactions = jest
        .fn()
        .mockRejectedValue(new Error('Test error'));

      await expect(scheduler.handleDailyReport()).resolves.not.toThrow();
    });
  });
});
