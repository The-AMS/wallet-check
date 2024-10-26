import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private commandList: string[] = [
    '/start - Start the bot and get a welcome message.',
    '/help - Show the list of available commands.',
    '/setwallet - Sets a BSC wallet to observe.',
    '/checktransaction - Fetches the last N transactions for the set wallet.',
  ];

  // injecting the data base service
  constructor(private readonly databaseService: DatabaseService) {}

  onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.bot = new TelegramBot(token, { polling: true });
    this.regirterCommands();
  }

  private regirterCommands() {
    // start
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(
        chatId,
        'Welcome to our bot!\nTo learn more, please enter the /help command.',
      );
    });

    // help
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(
        chatId,
        `Here is available command list: \n${this.commandList.join('\n')}`,
      );
    });

    // setwallet
    this.bot.onText(/\/setwallet (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const walletAddress = match[1];

      try {
        await this.databaseService.saveUser(chatId, walletAddress);
        this.bot.sendMessage(
          chatId,
          `Wallet address ${walletAddress} saved successfully.`,
        );
      } catch (error) {
        this.bot.sendMessage(
          chatId,
          `An error occurred while saving your wallet address.\nerror :${error}`,
        );
      }
    });
  }
}
