import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [TelegramModule, WalletModule, TransactionModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
