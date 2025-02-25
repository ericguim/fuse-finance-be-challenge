import { Module } from '@nestjs/common';
import { StocksController } from './stock.controller';
import { StocksService } from './stock.service';
import { PrismaService } from '../prisma/prisma.service';
import { FuseApiClient } from './fuse-api.client';
import { TransactionModule } from '../transaction/transaction.module';
@Module({
  imports: [TransactionModule],
  controllers: [StocksController],
  providers: [StocksService, PrismaService, FuseApiClient],
  exports: [StocksService],
})
export class StocksModule {}
