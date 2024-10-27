import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { DatabaseService } from 'src/database/database.service';
import { BscScanService } from 'src/bsc-scan/bsc-scan.service';
import { ethers } from 'ethers';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  // command List for /help
  private commandList: string[] = [
    '/start - Start the bot and get a welcome message.',
    '/help - Show the list of available commands.',
    '/setwallet - Sets a BSC wallet to observe.',
    '/getbalance - Check the balance of wallet',
    '/checktransaction - Fetches the last N transactions for the set wallet.',
    '/removewallet - Removes the saved wallet address for the user.',
  ];

  // injecting the database service
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly bscScanService: BscScanService,
  ) {}

  // turning bot on
  onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.bot = new TelegramBot(token, { polling: true });
    this.regirterCommands();
  }
  unitConvert(weiValue: any): string {
    const etherValue = ethers.formatUnits(weiValue, 'ether');
    return etherValue;
  }

  // handling commands
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
    this.bot.onText(/\/setwallet/, (msg) => {
      const chatId = msg.chat.id;

      // Send message asking for wallet address
      this.bot.sendMessage(chatId, 'Please enter your wallet address:');

      // Set up listener for the next message containing the wallet address
      this.bot.once('message', async (msg) => {
        const walletAddress = msg.text;

        // Validate the wallet address format
        const regex = /^0x[a-fA-F0-9]{40}$/;
        const validAddress = regex.test(walletAddress);

        if (!validAddress) {
          this.bot.sendMessage(
            chatId,
            'Invalid wallet address format. Please try again with a valid BSC address.\nTry again /setwallet',
          );
          return;
        }

        try {
          await this.databaseService.saveUser(chatId, walletAddress);
          this.bot.sendMessage(
            chatId,
            `Wallet address ${walletAddress} saved successfully.`,
          );
        } catch (error) {
          this.bot.sendMessage(
            chatId,
            `An error occurred while saving your wallet address.\nerror: ${error}`,
          );
        }
      });
    });

    // removewallet
    this.bot.onText(/\/removewallet/, async (msg) => {
      const chatId = msg.chat.id;

      this.bot.sendMessage(
        chatId,
        `Are you sure to remove your wallet address?`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Yes', callback_data: 'yes' },
                { text: 'No', callback_data: 'no' },
              ],
            ],
          },
        },
      );

      // Set up listener for the next callback query
      this.bot.once('callback_query', async (query) => {
        const answer = query.data;

        if (answer === 'yes') {
          try {
            const result = await this.databaseService.removeUserWallet(chatId);
            if (result) {
              this.bot.sendMessage(
                chatId,
                `Wallet address removed successfully.`,
              );
            } else {
              this.bot.sendMessage(
                chatId,
                'No wallet address found to remove.',
              );
            }
          } catch (error) {
            this.bot.sendMessage(
              chatId,
              'An error occurred while removing your wallet address.',
            );
          }
        } else {
          this.bot.sendMessage(chatId, `Wallet removal cancelled.`);
        }

        // Acknowledge the callback to prevent timeouts
        this.bot.answerCallbackQuery(query.id);
      });
    });

    // getbalance
    this.bot.onText(/\/getbalance/, async (msg) => {
      const chatId = msg.chat.id;

      try {
        // First, retrieve the user's wallet address from the database
        const user = await this.databaseService.findUserByChatId(chatId);
        if (!user || !user.walletAddress) {
          this.bot.sendMessage(
            chatId,
            'Your wallet address was not found. Please register it first.',
          );
          return;
        }

        // Fetch wallet information from BscScan API
        const walletData = await this.bscScanService.getWalletData(
          user.walletAddress,
        );

        // converting wei format to bnb
        let convertedData = this.unitConvert(walletData.result);

        // Send the data to the user
        this.bot.sendMessage(
          chatId,
          `Your wallet information:\nBalance: ${convertedData} bnb`,
        );
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        this.bot.sendMessage(
          chatId,
          'There was an issue retrieving your wallet information.',
        );
      }
    });
  }
}
