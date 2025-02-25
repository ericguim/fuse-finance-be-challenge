import { Test, TestingModule } from '@nestjs/testing';
import { StocksService } from './stock.service';
import { FuseApiClient } from './fuse-api.client';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionType } from '../transaction/dto/transaction.dto';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('StocksService', () => {
  let service: StocksService;
  let mockFuseApiClient: Partial<FuseApiClient>;
  let mockPrisma: DeepMockProxy<PrismaService>;
  let mockTransactionService: Partial<TransactionService>;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockFuseApiClient = {
      getStocksData: jest.fn(),
      buyStock: jest.fn(),
    };

    mockPrisma = mockDeep<PrismaService>();
    mockTransactionService = {
      create: jest.fn(),
    };
    mockUserService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        {
          provide: FuseApiClient,
          useValue: mockFuseApiClient,
        },
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<StocksService>(StocksService);
  });

  describe('fetchStocks', () => {
    it('should fetch stocks successfully', async () => {
      const mockResponse = {
        data: {
          items: [{ symbol: 'AAPL', price: 150, available: 100 }],
          nextToken: null,
        },
      };
      mockFuseApiClient.getStocksData = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await service.fetchStocks();
      expect(result.stocks).toHaveLength(1);
      expect(result.stocks[0].symbol).toBe('AAPL');
    });

    it('should throw BadRequestException on API failure', async () => {
      mockFuseApiClient.getStocksData = jest
        .fn()
        .mockRejectedValue(new Error());
      await expect(service.fetchStocks()).rejects.toThrow(BadRequestException);
    });
  });

  describe('executeTransaction', () => {
    it('should throw NotFoundException when user not found', async () => {
      mockUserService.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.executeTransaction(
          'AAPL',
          10,
          'user1',
          150,
          TransactionType.BUY,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should execute successful transaction', async () => {
      mockUserService.findOne = jest.fn().mockResolvedValue({ id: 'user1' });
      mockFuseApiClient.getStocksData = jest.fn().mockResolvedValue({
        data: { items: [{ symbol: 'AAPL', price: 150 }], nextToken: null },
      });
      mockFuseApiClient.buyStock = jest.fn().mockResolvedValue(undefined);
      mockPrisma.userPortfolio.upsert.mockResolvedValue({
        symbol: 'AAPL',
        quantity: 10,
        id: '1',
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.executeTransaction(
        'AAPL',
        10,
        'user1',
        150,
        TransactionType.BUY,
      );

      expect(result.status).toBe('SUCCESS');
      expect(mockTransactionService.create).toHaveBeenCalled();
    });

    it('should handle failed transaction', async () => {
      mockUserService.findOne = jest.fn().mockResolvedValue({ id: 'user1' });
      mockFuseApiClient.getStocksData = jest.fn().mockResolvedValue({
        data: { items: [{ symbol: 'AAPL', price: 150 }], nextToken: null },
      });
      mockFuseApiClient.buyStock = jest
        .fn()
        .mockRejectedValue(new Error('Failed'));

      const result = await service.executeTransaction(
        'AAPL',
        10,
        'user1',
        150,
        TransactionType.BUY,
      );

      expect(result.status).toBe('FAILED');
      expect(mockTransactionService.create).toHaveBeenCalled();
    });
  });

  describe('getUserPortfolio', () => {
    it('should return user portfolio with calculated total value', async () => {
      const mockStocks = [
        {
          symbol: 'AAPL',
          quantity: 10,
          id: '1',
          userId: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          symbol: 'GOOGL',
          quantity: 5,
          id: '2',
          userId: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const stockData = [
        { symbol: 'AAPL', price: 150, available: 100 },
        { symbol: 'GOOGL', price: 200, available: 100 },
      ];

      mockUserService.findOne = jest.fn().mockResolvedValue({ id: 'user1' });
      mockPrisma.userPortfolio.findMany.mockResolvedValue(mockStocks);
      mockFuseApiClient.getStocksData = jest.fn().mockResolvedValue({
        data: { items: stockData, nextToken: null },
      });

      // Populate cache first
      await service.fetchStocks();

      // Force cache update to ensure data is available
      stockData.forEach((stock) => {
        (service as any).stockCache.set(stock.symbol, stock);
      });

      const portfolio = await service.getUserPortfolio('user1');

      expect(portfolio.userId).toBe('user1');
      expect(portfolio.stocks).toHaveLength(2);
      expect(portfolio.totalValue).toBe(2500); // (10 * 150) + (5 * 200)
    });

    it('should throw NotFoundException for non-existent user', async () => {
      mockUserService.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getUserPortfolio('user1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
