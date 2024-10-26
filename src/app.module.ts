import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { DatabaseModule } from './database/database.module';
import { BscScanModule } from './bsc-scan/bsc-scan.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    TelegramModule,
    DatabaseModule,
    BscScanModule,
  ],
  providers: [AppService],
})
export class AppModule {}
