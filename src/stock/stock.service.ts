import * as NodeCache from 'node-cache';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PortfolioDto, PortfolioItemDto } from './dto/portfolio.dto';
import { FuseApiClient, FuseStock } from './fuse-api.client';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  TransactionDto,
  TransactionType as TransactionTypeDTO,
  TransactionStatus as TransactionStatusDTO,
} from '../transaction/dto/transaction.dto';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
@Injectable()
export class StocksService {
  private stockCache: NodeCache;
  private readonly CACHE_DURATION = 300; // 5 minutes in seconds

  constructor(
    private readonly fuseApiClient: FuseApiClient,
    private readonly prisma: PrismaService,
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
  ) {
    this.stockCache = new NodeCache({
      stdTTL: this.CACHE_DURATION,
      checkperiod: 60, // Check for expired keys every 60 seconds
    });
  }

  private async refreshStockCache(): Promise<void> {
    // Only fetch if cache is empty or expired
    if (this.stockCache.getStats().keys === 0) {
      try {
        let nextToken: string | undefined;

        do {
          const response = await this.fetchStocks(nextToken);
          response.stocks.forEach((stock) => {
            this.stockCache.set(stock.symbol, stock);
          });
          nextToken = response.nextToken;
        } while (nextToken);
      } catch (error) {
        console.error('Failed to refresh stock cache:', error);
        // If cache refresh fails and cache is empty, throw error
        if (this.stockCache.getStats().keys === 0) {
          throw new Error('Unable to fetch stocks from vendor');
        }
        // Otherwise, continue using existing cache
      }
    }
  }

  async fetchStocks(nextToken?: string): Promise<{
    stocks: Array<{ symbol: string; price: number; available: number }>;
    nextToken?: string;
  }> {
    try {
      const response = await this.fuseApiClient.getStocksData(nextToken);
      return {
        stocks: response.data.items,
        nextToken: response.data.nextToken,
      };
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw new BadRequestException('Failed to fetch stocks from vendor');
    }
  }

  async fetchUserStocks(userId: string): Promise<PortfolioItemDto[]> {
    const portfolio: PortfolioItemDto[] = [];
    const userPortfolio = await this.prisma.userPortfolio.findMany({
      where: {
        userId,
      },
    });
    await Promise.all(
      userPortfolio.map((position) => {
        const stockData = this.stockCache.get<FuseStock>(position.symbol);
        if (stockData) {
          portfolio.push({
            symbol: position.symbol,
            quantity: position.quantity,
            currentPrice: stockData.price,
          });
        }
      }),
    );

    return portfolio;
  }

  async getUserPortfolio(userId: string): Promise<PortfolioDto> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const getUserStocks = await this.fetchUserStocks(userId);

    // Calculate total value and format response
    const portfolio = {
      userId,
      stocks: getUserStocks,
      totalValue: getUserStocks.reduce(
        (total, stock) => total + stock.quantity * stock.currentPrice,
        0,
      ),
    };

    return portfolio;
  }

  async executeTransaction(
    symbol: string,
    quantity: number,
    userId: string,
    price: number,
    type: TransactionTypeDTO,
  ): Promise<TransactionDto> {
    console.log('Executing transaction: ', new Date().toISOString());
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.refreshStockCache();
    console.log('Stock cache refreshed: ', new Date().toISOString());
    const transaction: TransactionDto = {
      userId,
      symbol,
      quantity,
      price,
      type,
      status: TransactionStatusDTO.FAILED,
    };

    try {
      // Try to execute the purchase through Fuse API
      await this.fuseApiClient.buyStock(symbol, price, quantity);

      // If successful, update user portfolio in database
      await this.prisma.userPortfolio.upsert({
        where: {
          userId_symbol: {
            userId,
            symbol,
          },
        },
        update: {
          quantity: {
            increment: type === TransactionType.BUY ? quantity : -quantity,
          },
        },
        create: {
          userId,
          symbol,
          quantity: type === TransactionType.BUY ? quantity : -quantity,
        },
      });

      transaction.status = TransactionStatusDTO.SUCCESS;
    } catch (error) {
      transaction.status = TransactionStatusDTO.FAILED;
      console.error(`Transaction failed: ${error.message}`);
    }

    // Store transaction
    await this.transactionService.create(transaction);

    return transaction;
  }
}
