import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { DatabaseService } from 'src/database/database.service';
import { BscScanService } from 'src/bsc-scan/bsc-scan.service';
import { unitConvert } from './utils/conversion';
import {
  startCommand,
  helpCommand,
  setWalletCommand,
  removeWalletCommand,
  getBalanceCommand,
  checkTransactionCommand,
} from './commands/command.handlers';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  private commandList: string[] = [
    '/start - Start the bot and get a welcome message.',
    '/help - Show the list of available commands.',
    '/setwallet - Sets a BSC wallet to observe.',
    '/getbalance - Check the balance of wallet',
    '/checktransaction - Fetches the last N transactions for the set wallet.',
    '/removewallet - Removes the saved wallet address for the user.',
  ];

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly bscScanService: BscScanService,
  ) {}

  onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.bot = new TelegramBot(token, { polling: true });
    this.registerCommands();
  }

  private registerCommands() {
    startCommand(this.bot);
    helpCommand(this.bot, this.commandList);
    setWalletCommand(this.bot, this.databaseService);
    removeWalletCommand(this.bot, this.databaseService);
    getBalanceCommand(
      this.bot,
      this.databaseService,
      this.bscScanService,
      unitConvert,
    );
    checkTransactionCommand(
      this.bot,
      this.databaseService,
      this.bscScanService,
    );
  }
}
