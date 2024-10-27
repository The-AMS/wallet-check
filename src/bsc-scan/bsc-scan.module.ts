import { Module } from '@nestjs/common';
import { BscScanService } from './bsc-scan.service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [BscScanService],
  exports: [BscScanService],
})
export class BscScanModule {}
