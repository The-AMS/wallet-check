import { Module } from '@nestjs/common';
import { BscScanController } from './bsc-scan.controller';
import { BscScanService } from './bsc-scan.service';

@Module({
  controllers: [BscScanController],
  providers: [BscScanService],
})
export class BscScanModule {}
