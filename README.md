# Wallet Check

## Description
Wallet Check is a NestJS application designed to interact with the Binance Smart Chain (BSC) and provide users with wallet checking functionalities through a Telegram bot.

## Features
- Check BSC wallet balances and transaction histories.
- Store user wallet addresses in a MongoDB database.
- Integration with BscScan API for fetching wallet data.

## Installation

To get started with Wallet Check, clone the repository and install the dependencies:

```bash
git clone https://github.com/The-AMS/wallet-check.git
cd wallet-check
npm install
```

## Scripts

Available npm scripts:

- `npm run start`: Start the application.
- `npm run start:dev`: Start the application in development mode with auto-reload.

## Usage

To start the application in development mode, use:

```bash
npm run start:dev
```

Once the application is running, you can interact with the Telegram bot to check wallet balances.

## Dependencies

This project relies on the following packages:

- `@nestjs/axios`
- `@nestjs/common`
- `@nestjs/config`
- `@nestjs/core`
- `@nestjs/mongoose`
- `axios`
- `dotenv`
- `ethers`
- `mongoose`
- `node-telegram-bot-api`
- `rxjs`
- `reflect-metadata`

## Contributing

If you would like to contribute to Wallet Check, feel free to fork the repository and submit a pull request.

## License

This project is licensed under the UNLICENSED license.
