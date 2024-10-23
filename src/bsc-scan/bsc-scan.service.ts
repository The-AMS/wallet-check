import { Injectable } from '@nestjs/common';
import axiios from 'axios';
@Injectable()
export class BscScanService {
  private apiKey = process.env.BSC_API_KEY;
}
