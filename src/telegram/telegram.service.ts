import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  // command List for /help
  private commandList: string[] = [
    '/start - Start the bot and get a welcome message.',
    '/help - Show the list of available commands.',
    '/setwallet - Sets a BSC wallet to observe.',
    '/checktransaction - Fetches the last N transactions for the set wallet.',
    '/removewallet - Removes the saved wallet address for the user.',
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
    // Set up listener for /setwallet command
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
        `Are you sure to remove your wallet address?\nPlease answer with 'yes' or 'no'`,
      );

      // Set up listener for the next message containing the answer
      this.bot.once('message', async (msg) => {
        const answer = msg.text;

        // Validate the answer format
        const regex = /^(yes|no)$/i;
        const validAnswer = regex.test(answer);
        if (!validAnswer) {
          this.bot.sendMessage(
            chatId,
            `Invalid answer\nTry again /removewallet `,
          );
          return;
        }

        try {
          const result = await this.databaseService.removeUserWallet(chatId);
          if (result) {
            this.bot.sendMessage(
              chatId,
              `Wallet address removed successfully.`,
            );
          } else {
            this.bot.sendMessage(chatId, 'No wallet address found to remove.');
          }
        } catch (error) {
          this.bot.sendMessage(
            chatId,
            'An error occurred while removing your wallet address.',
          );
        }
      });
    });
  }
}
