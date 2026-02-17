# 🤖 Polymarket Auto-Claim Bot

> **Automated Puppeteer bot to check your Polymarket portfolio every 10 minutes and automatically claim winnings when available.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-100%25-blue.svg)]()

## 📋 Features

- ✅ **Automatic checking** - Runs every 10 minutes (configurable)
- 🎯 **Smart detection** - Finds claimable positions automatically
- 🔄 **Auto-claim** - Claims all available winnings with one click
- 🔒 **Secure** - Runs locally on your machine
- 📊 **Logging** - Detailed console output with timestamps
- ⚙️ **Configurable** - Customize check intervals and browser settings
- 🌐 **Timezone-aware** - Timestamps in Helsinki/EET timezone
- 💪 **Robust** - Auto-recovery from browser crashes

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- A **Polymarket account** with MetaMask or compatible wallet

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/SimoKiihamaki/polymarket-claim-bot.git
cd polymarket-claim-bot
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment (optional)**

```bash
cp .env.example .env
# Edit .env to customize settings
```

4. **Run the bot**

```bash
npm start
```

## ⚙️ Configuration

Create a `.env` file in the project root (or copy from `.env.example`):

```env
# Check interval (cron format)
CHECK_INTERVAL=*/10 * * * *

# Browser headless mode (true/false)
HEADLESS=true
```

### Check Intervals

| Interval | Cron Expression |
|----------|----------------|
| Every 5 minutes | `*/5 * * * *` |
| Every 10 minutes | `*/10 * * * *` (default) |
| Every 15 minutes | `*/15 * * * *` |
| Every 30 minutes | `*/30 * * * *` |
| Every hour | `0 * * * *` |

## 📖 Usage

### First Run - Connect Wallet

**Important:** On the first run with `HEADLESS=false`, you need to:

1. The browser window will open automatically
2. Navigate to Polymarket and connect your wallet (MetaMask, etc.)
3. Once connected, the bot will start monitoring
4. Leave the browser window open for subsequent checks

### Running in Background

Once your wallet is connected, you can run in headless mode:

```bash
# Set HEADLESS=true in .env
# or
HEADLESS=true npm start
```

### Checking Status

The bot outputs detailed logs:

```
╔═══════════════════════════════════════════════╗
║   Polymarket Auto-Claim Bot Started 🤖      ║
╚═══════════════════════════════════════════════╝

⏱️  Check interval: */10 * * * *
🖥️  Headless mode: true

═════════════════════════════════════════════════

🚀 Initializing browser...
✅ Browser initialized

[17.2.2026 09:00:00] 🔍 Checking for claimable wins...
💤 No claimable wins found

✅ Bot is now running. Checks scheduled every 10 minutes.
   Press Ctrl+C to stop.
```

### When Wins Are Found

```
[17.2.2026 09:10:00] 🔍 Checking for claimable wins...
🎉 Found 2 claimable position(s)!
   Claiming win 1/2...
   ✅ Clicked Claim Proceeds
   ⏳ Waiting for wallet signature...
   ✅ Successfully claimed!
   Claiming win 2/2...
   ✅ Clicked Claim Proceeds
   ⏳ Waiting for wallet signature...
   ✅ Successfully claimed!
✨ Finished claiming all available wins
```

## 🛠️ Development

### Run in Development Mode

```bash
# With visible browser for debugging
HEADLESS=false npm start
```

### Project Structure

```
polymarket-claim-bot/
├── index.js           # Main bot logic
├── package.json       # Dependencies & scripts
├── .env.example       # Configuration template
├── .gitignore         # Git ignore rules
├── LICENSE            # MIT License
└── README.md          # This file
```

## ⚠️ Important Notes

### Security

- **Never share your `.env` file** - it contains sensitive configurations
- **Never commit your wallet private keys** - the bot only interacts with already-connected wallets
- **Run on trusted machines only** - the bot has access to your connected wallet

### Wallet Connection

- You need to **manually connect your wallet** the first time
- The bot **cannot and will not** access your private keys
- It only clicks the "Claim" buttons on markets you've already won
- **You must sign** transactions in MetaMask when prompted

### Limitations

- Requires an active internet connection
- Polymarket must be accessible
- MetaMask or compatible wallet must remain connected
- Browser window should not be closed (in non-headless mode)

## 🐛 Troubleshooting

### Bot not finding claimable wins

- Check that you actually have resolved winning positions
- Ensure your wallet is connected
- Try running with `HEADLESS=false` to see what's happening

### Browser crashes

- The bot automatically attempts to reinitialize
- Check your system resources (RAM, CPU)
- Try increasing system limits or running fewer concurrent processes

### "Wallet not connected" message

- Run with `HEADLESS=false`
- Connect your MetaMask or compatible wallet
- Make sure you're logged into Polymarket

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This bot is for educational and personal use only. Use at your own risk. Always verify transactions before signing with your wallet. The authors are not responsible for any losses or issues arising from the use of this bot.

## 🙏 Acknowledgments

- Built with [Puppeteer](https://pptr.dev/)
- Scheduling with [node-cron](https://github.com/node-cron/node-cron)
- Designed for [Polymarket](https://polymarket.com/)

---

**Made with ❤️ for the Polymarket community**
