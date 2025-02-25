import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { StocksModule } from './stock/stock.module';
import { TransactionModule } from './transaction/transaction.module';
@Module({
  imports: [StocksModule, TransactionModule],
  providers: [PrismaService],
})
export class AppModule {}
