import * as TelegramBot from 'node-telegram-bot-api';
import { DatabaseService } from 'src/database/database.service';
import { BscScanService } from 'src/bsc-scan/bsc-scan.service';

// start command handler
export function startCommand(bot: TelegramBot) {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      'Welcome to our bot!\nTo learn more, please enter the /help command.',
    );
  });
}

// help command handler
export function helpCommand(bot: TelegramBot, commandList: string[]) {
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      `Here is the available command list: \n${commandList.join('\n')}`,
    );
  });
}

// setwallet command handler
export function setWalletCommand(
  bot: TelegramBot,
  databaseService: DatabaseService,
) {
  bot.onText(/\/setwallet/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Please enter your wallet address:');

    bot.once('message', async (msg) => {
      const walletAddress = msg.text;
      const regex = /^0x[a-fA-F0-9]{40}$/;
      const validAddress = regex.test(walletAddress);

      if (!validAddress) {
        bot.sendMessage(
          chatId,
          'Invalid wallet address format. Please try again with a valid BSC address.\nTry again /setwallet',
        );
        return;
      }

      try {
        await databaseService.saveUser(chatId, walletAddress);
        bot.sendMessage(
          chatId,
          `Wallet address ${walletAddress} saved successfully.`,
        );
      } catch (error) {
        bot.sendMessage(
          chatId,
          `An error occurred while saving your wallet address.\nerror: ${error}`,
        );
      }
    });
  });
}

// removewallet command handler
export function removeWalletCommand(
  bot: TelegramBot,
  databaseService: DatabaseService,
) {
  bot.onText(/\/removewallet/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `Are you sure to remove your wallet address?`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Yes', callback_data: 'yes' },
            { text: 'No', callback_data: 'no' },
          ],
        ],
      },
    });

    bot.once('callback_query', async (query) => {
      const answer = query.data;

      if (answer === 'yes') {
        try {
          const result = await databaseService.removeUserWallet(chatId);
          bot.sendMessage(
            chatId,
            result
              ? 'Wallet address removed successfully.'
              : 'No wallet address found to remove.',
          );
        } catch (error) {
          bot.sendMessage(
            chatId,
            'An error occurred while removing your wallet address.',
          );
        }
      } else {
        bot.sendMessage(chatId, 'Wallet removal cancelled.');
      }

      bot.answerCallbackQuery(query.id);
    });
  });
}

// getbalance command handler
export function getBalanceCommand(
  bot: TelegramBot,
  databaseService: DatabaseService,
  bscScanService: BscScanService,
  unitConvert: (weiValue: any) => string,
) {
  bot.onText(/\/getbalance/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await databaseService.findUserByChatId(chatId);
      if (!user || !user.walletAddress) {
        bot.sendMessage(
          chatId,
          'Your wallet address was not found. Please register it first.',
        );
        return;
      }

      const walletData = await bscScanService.getWalletBalance(
        user.walletAddress,
      );
      const convertedData = unitConvert(walletData.result);

      bot.sendMessage(
        chatId,
        `Your wallet information:\nBalance: ${convertedData} bnb`,
      );
    } catch (error) {
      bot.sendMessage(
        chatId,
        'There was an issue retrieving your wallet information.',
      );
    }
  });
}

// checktransaction command handler

export function checkTransactionCommand(
  bot: TelegramBot,
  databaseService: DatabaseService,
  bscScanService: BscScanService,
) {
  bot.onText(/\/checktransaction/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await databaseService.findUserByChatId(chatId);
      if (!user || !user.walletAddress) {
        bot.sendMessage(
          chatId,
          'Your wallet address was not found. Please register it first.',
        );
        return;
      }

      const transactionData = await bscScanService.getTransaction(
        user.walletAddress,
      );

      if (!transactionData || transactionData.length === 0) {
        bot.sendMessage(chatId, 'No transactions found for this wallet.');
      } else {
        const transactionDetails = transactionData
          .map((tx) => `Hash: ${tx.hash}, Value: ${tx.value}`)
          .join('\n');
        bot.sendMessage(chatId, `Transaction Data:\n${transactionDetails}`);
      }
    } catch (error) {
      console.error('Error retrieving transaction data:', error);
      bot.sendMessage(
        chatId,
        `There was an issue retrieving your transaction information.`,
      );
    }
  });
}
