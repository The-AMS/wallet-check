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

  async getWalletBalance(walletAddress: string) {
    const apiKey = process.env.BSC_API_KEY;
    const url = `https://api.bscscan.com/api?module=account&action=balance&address=${walletAddress}&apikey=${apiKey}`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }

  async getTransaction(walletAddress: string) {
    const apiKey = process.env.BSC_API_KEY;
    const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${walletAddress}&startblock=1&endblock=9999999&page=1&offset=10&sort=asc&apikey=${apiKey}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      // بررسی اینکه آیا result وجود دارد و آیا آرایه است
      if (response.data && Array.isArray(response.data.result)) {
        return response.data.result; // برگرداندن آرایه‌ای از تراکنش‌ها
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error; // خطا را پرتاب کنید تا در مکان دیگری مدیریت شود
    }
  }
}
