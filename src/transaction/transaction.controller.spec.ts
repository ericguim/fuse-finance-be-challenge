import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  let mockTransactionService: Partial<TransactionService>;

  beforeEach(async () => {
    mockTransactionService = {
      getDailyTransactions: jest.fn(),
      sendDailyReport: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  describe('getDailyTransactions', () => {
    it('should return daily transactions', async () => {
      const mockTransactions = [
        {
          userId: 'user1',
          symbol: 'AAPL',
          quantity: 10,
          price: 150,
          type: 'BUY',
          status: 'SUCCESS',
          createdAt: new Date(),
        },
      ];

      (
        mockTransactionService.getDailyTransactions as jest.Mock
      ).mockResolvedValue(mockTransactions);

      const result = await controller.generateDailyReport('test@test.com');

      expect(result).toStrictEqual({
        message: 'Daily report generated and sent successfully',
      });
      expect(mockTransactionService.getDailyTransactions).toHaveBeenCalled();
    });
  });
});
