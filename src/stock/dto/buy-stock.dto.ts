import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class BuyStockDto {
  @ApiProperty({
    description: 'Number of shares to buy',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Price of the stock',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'ID of the user making the purchase',
  })
  @IsString()
  userId: string;
}
