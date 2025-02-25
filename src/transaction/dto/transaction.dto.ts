import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class TransactionDto {
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
  price: number;

  @ApiProperty({
    description: 'Transaction type',
    example: 'BUY',
  })
  type: TransactionType;

  @ApiProperty({
    description: 'Transaction status',
    example: 'SUCCESS',
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'Transaction date',
    example: '2024-01-01',
  })
  @IsOptional()
  createdAt?: Date;
}
