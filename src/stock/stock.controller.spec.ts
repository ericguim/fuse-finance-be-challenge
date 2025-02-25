import { Test, TestingModule } from '@nestjs/testing';
import { StocksController } from './stock.controller';
import { StocksService } from './stock.service';
import { TransactionType } from '../transaction/dto/transaction.dto';

describe('StocksController', () => {
  let controller: StocksController;
  let mockStocksService: Partial<StocksService>;

  beforeEach(async () => {
    mockStocksService = {
      executeTransaction: jest.fn(),
      getUserPortfolio: jest.fn(),
      fetchStocks: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksController],
      providers: [
        {
          provide: StocksService,
          useValue: mockStocksService,
        },
      ],
    }).compile();

    controller = module.get<StocksController>(StocksController);
  });

  describe('buyStock', () => {
    it('should execute buy transaction', async () => {
      const buyStockDto = {
        userId: 'user1',
        quantity: 10,
        price: 150,
      };
      const mockTransaction = {
        userId: 'user1',
        symbol: 'AAPL',
        quantity: 10,
        price: 150,
        type: TransactionType.BUY,
        status: 'SUCCESS',
      };

      (mockStocksService.executeTransaction as jest.Mock).mockResolvedValue(
        mockTransaction,
      );

      const result = await controller.buyStock('AAPL', buyStockDto);

      expect(result).toBe(mockTransaction);
      expect(mockStocksService.executeTransaction).toHaveBeenCalledWith(
        'AAPL',
        10,
        'user1',
        expect.any(Number),
        TransactionType.BUY,
      );
    });
  });

  describe('getPortfolio', () => {
    it('should return user portfolio', async () => {
      const mockPortfolio = {
        userId: 'user1',
        stocks: [
          { symbol: 'AAPL', quantity: 10, currentPrice: 150 },
          { symbol: 'GOOGL', quantity: 5, currentPrice: 200 },
        ],
        totalValue: 2500,
      };

      (mockStocksService.getUserPortfolio as jest.Mock).mockResolvedValue(
        mockPortfolio,
      );

      const result = await controller.getUserPortfolio('user1');

      expect(result).toBe(mockPortfolio);
      expect(mockStocksService.getUserPortfolio).toHaveBeenCalledWith('user1');
    });
  });

  describe('getStocks', () => {
    it('should return list of stocks', async () => {
      const mockStocks = {
        stocks: [
          { symbol: 'AAPL', price: 150, available: 100 },
          { symbol: 'GOOGL', price: 200, available: 50 },
        ],
      };

      (mockStocksService.fetchStocks as jest.Mock).mockResolvedValue(
        mockStocks,
      );

      const result = await controller.getStocks();

      expect(result).toBe(mockStocks);
      expect(mockStocksService.fetchStocks).toHaveBeenCalled();
    });
  });
});
