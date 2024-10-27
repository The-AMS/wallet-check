import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BscScanService {
  constructor(
    private databaseService: DatabaseService,
    private httpService: HttpService,
  ) {}

  async getWalletData(walletAddress: string) {
    const apiKey = process.env.BSC_API_KEY;
    const url = `https://api.bscscan.com/api?module=account&action=balance&address=${walletAddress}&apikey=${apiKey}`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }
}
