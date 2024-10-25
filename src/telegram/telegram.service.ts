import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private commandList: string[] = [
    '/start - Start the bot and get a welcome message.',
    '/help - Show the list of available commands.',
    '/setwallet - Sets a BSC wallet to observe.',
    '/checktransaction - Fetches the last N transactions for the set wallet.',
  ];
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
  }
}
