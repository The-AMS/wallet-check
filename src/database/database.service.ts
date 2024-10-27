import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(@InjectModel(User.name) public userModel: Model<User>) {}

  async saveUser(chatId: number, walletAddress: string): Promise<User> {
    const existingUser = await this.userModel.findOne({ chatId });
    if (existingUser) {
      existingUser.walletAddress = walletAddress;
      return existingUser.save();
    }
    const newUser = new this.userModel({ chatId, walletAddress });
    return newUser.save();
  }
  async removeUserWallet(chatId: number): Promise<boolean> {
    try {
      const result = await this.userModel.updateOne(
        { chatId },
        { $unset: { walletAddress: '' } },
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error removing wallet:', error);
      return false;
    }
  }
  async findUserByChatId(chatId: number): Promise<User | null> {
    return this.userModel.findOne({ chatId });
  }
}
