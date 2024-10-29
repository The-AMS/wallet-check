import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { DatabaseService } from 'src/database/database.service';
import { BscScanService } from 'src/bsc-scan/bsc-scan.service';
import { unitConvert } from './utils/conversion';
import {
  handleStartCommand,
  handleHelpCommand,
  handleSetWalletCommand,
  handleRemoveWalletCommand,
  handleGetBalanceCommand,
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
    handleStartCommand(this.bot);
    handleHelpCommand(this.bot, this.commandList);
    handleSetWalletCommand(this.bot, this.databaseService);
    handleRemoveWalletCommand(this.bot, this.databaseService);
    handleGetBalanceCommand(
      this.bot,
      this.databaseService,
      this.bscScanService,
      this.unitConvert.bind(this),
    );
  }
}
