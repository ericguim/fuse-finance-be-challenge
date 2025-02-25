import { ApiProperty } from '@nestjs/swagger';

export class PortfolioItemDto {
  @ApiProperty({
    description: 'Stock symbol',
    example: 'AAPL',
  })
  symbol: string;

  @ApiProperty({
    description: 'Quantity of shares owned',
    example: 100,
  })
  quantity: number;

  @ApiProperty({
    description: 'Current stock price',
    example: 150.5,
  })
  currentPrice: number;
}

export class PortfolioDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'List of stocks in portfolio',
    type: [PortfolioItemDto],
  })
  stocks: PortfolioItemDto[];

  @ApiProperty({
    description: 'Total portfolio value',
    example: 15050.0,
  })
  totalValue: number;
}
