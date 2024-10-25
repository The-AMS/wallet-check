import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TelegramService],
})
export class TelegramModule {}
