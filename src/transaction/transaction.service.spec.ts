import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { EmailService } from '../email/email.service';
import {
  TransactionDto,
  TransactionStatus,
  TransactionType,
} from './dto/transaction.dto';

describe('TransactionService', () => {
  let service: TransactionService;
  let mockTransactionRepository: Partial<TransactionRepository>;
  let mockEmailService: Partial<EmailService>;

  beforeEach(async () => {
    mockTransactionRepository = {
      getDailyTransactions: jest.fn(),
      create: jest.fn(),
    };

    mockEmailService = {
      sendEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: mockTransactionRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  describe('sendDailyReport', () => {
    it('should send email with correct transaction summary', async () => {
      const mockTransactions: TransactionDto[] = [
        {
          userId: 'user1',
          symbol: 'AAPL',
          quantity: 10,
          price: 150,
          status: TransactionStatus.SUCCESS,
          type: TransactionType.BUY,
          createdAt: new Date(),
        },
        {
          userId: 'user2',
          symbol: 'GOOGL',
          quantity: 5,
          price: 200,
          status: TransactionStatus.FAILED,
          type: TransactionType.BUY,
          createdAt: new Date(),
        },
      ];

      await service.sendDailyReport(mockTransactions, 'test@example.com');

      expect(mockEmailService.sendEmail).toHaveBeenCalled();
    });
  });
});
