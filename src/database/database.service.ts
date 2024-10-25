import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async saveUser(chatId: number, walletAddress: string): Promise<User> {
    const existingUser = await this.userModel.findOne({ chatId });
    if (existingUser) {
      existingUser.walletAddress = walletAddress;
      return existingUser.save();
    }
    const newUser = new this.userModel({ chatId, walletAddress });
    return newUser.save();
  }
}
