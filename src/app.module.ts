import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { StocksModule } from './stock/stock.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [StocksModule, TransactionModule, UserModule],
  providers: [PrismaService],
})
export class AppModule {}
