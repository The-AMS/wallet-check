import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { DatabaseModule } from 'src/database/database.module';
import { BscScanModule } from 'src/bsc-scan/bsc-scan.module';

@Module({
  imports: [DatabaseModule, BscScanModule],
  providers: [TelegramService],
})
export class TelegramModule {}
