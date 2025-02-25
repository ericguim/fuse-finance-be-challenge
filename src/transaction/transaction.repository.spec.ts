import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from './transaction.repository';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { TransactionType, TransactionStatus } from './dto/transaction.dto';
describe('TransactionRepository', () => {
  let repository: TransactionRepository;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    repository = module.get<TransactionRepository>(TransactionRepository);
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const transactionDto = {
        userId: 'user1',
        symbol: 'AAPL',
        quantity: 10,
        price: 150,
        type: TransactionType.BUY,
        status: TransactionStatus.SUCCESS,
      };
      const expectedTransaction = {
        id: '1',
        ...transactionDto,
        createdAt: new Date(),
      };

      prisma.transaction.create.mockResolvedValue(expectedTransaction);

      const result = await repository.create(transactionDto);
      expect(result).toBe(expectedTransaction);
      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: transactionDto,
      });
    });
  });

  describe('getDailyTransactions', () => {
    it('should return transactions for the current day', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const expectedTransactions = [
        {
          id: '1',
          userId: 'user1',
          symbol: 'AAPL',
          quantity: 10,
          price: 150,
          type: TransactionType.BUY,
          status: TransactionStatus.SUCCESS,
          createdAt: new Date(),
        },
      ];

      prisma.transaction.findMany.mockResolvedValue(expectedTransactions);

      const result = await repository.getDailyTransactions();
      expect(result).toStrictEqual(expectedTransactions);
      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });
    });
  });
});
