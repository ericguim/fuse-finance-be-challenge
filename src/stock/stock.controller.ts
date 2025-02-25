import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StocksService } from './stock.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PortfolioDto } from './dto/portfolio.dto';
import { TransactionType } from '../transaction/dto/transaction.dto';
import { TransactionDto } from 'src/transaction/dto/transaction.dto';
import { BuyStockDto } from './dto/buy-stock.dto';

@ApiTags('stock')
@Controller('api/v1/stock')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  @ApiOperation({ summary: 'List available stocks' })
  @ApiQuery({
    name: 'nextToken',
    required: false,
    description: 'Token for pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available stocks',
  })
  async getStocks(@Query('nextToken') nextToken?: string) {
    return this.stocksService.fetchStocks(nextToken);
  }

  @Get('portfolio/:userId')
  @ApiOperation({ summary: 'Get user portfolio' })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'User portfolio retrieved successfully',
    type: PortfolioDto,
  })
  async getUserPortfolio(@Param('userId') userId: string) {
    return this.stocksService.getUserPortfolio(userId);
  }

  @Post(':symbol/buy')
  @ApiOperation({ summary: 'Execute stock purchase' })
  @ApiParam({
    name: 'symbol',
    description: 'Stock symbol (e.g., AAPL)',
  })
  @ApiResponse({
    status: 201,
    description: 'Stock purchased successfully',
    type: TransactionDto,
  })
  async buyStock(
    @Param('symbol') symbol: string,
    @Body() buyStockDto: BuyStockDto,
  ) {
    return this.stocksService.executeTransaction(
      symbol,
      buyStockDto.quantity,
      buyStockDto.userId,
      buyStockDto.price,
      TransactionType.BUY,
    );
  }
}
