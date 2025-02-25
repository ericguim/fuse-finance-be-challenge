import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { StocksModule } from './stock/stock.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from './email/email.module';
@Module({
  imports: [
    StocksModule,
    TransactionModule,
    EmailModule,
    ScheduleModule.forRoot(),
    UserModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
