import puppeteer from 'puppeteer';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

const POLYMARKET_URL = 'https://polymarket.com/portfolio';
const CHECK_INTERVAL = process.env.CHECK_INTERVAL || '*/10 * * * *'; // Every 10 minutes
const HEADLESS = process.env.HEADLESS !== 'false';

let browser;
let page;

async function initBrowser() {
  console.log('🚀 Initializing browser...');
  browser = await puppeteer.launch({
    headless: HEADLESS,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });
  page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  console.log('✅ Browser initialized');
}

async function checkForWins() {
  try {
    console.log(`\n[${new Date().toLocaleString('en-FI', { timeZone: 'Europe/Helsinki' })}] 🔍 Checking for claimable wins...`);
    
    await page.goto(POLYMARKET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForTimeout(3000);

    // Check if we need to connect wallet
    const needsWalletConnection = await page.$('button:has-text(\"Connect Wallet\")');
    if (needsWalletConnection) {
      console.log('⚠️  Wallet not connected. Please connect your wallet manually.');
      console.log('   Open the browser window and connect your MetaMask or wallet.');
      return;
    }

    // Look for the Markets Won banner or Claim button
    const claimButtons = await page.$$('button:has-text(\"Claim\")');
    
    if (claimButtons.length > 0) {
      console.log(`🎉 Found ${claimButtons.length} claimable position(s)!`);
      
      for (let i = 0; i < claimButtons.length; i++) {
        try {
          console.log(`   Claiming win ${i + 1}/${claimButtons.length}...`);
          
          // Click the Claim button
          await claimButtons[i].click();
          await page.waitForTimeout(2000);

          // Wait for and click "Claim Proceeds" if it appears
          const claimProceedsButton = await page.waitForSelector(
            'button:has-text(\"Claim Proceeds\")',
            { timeout: 5000 }
          ).catch(() => null);

          if (claimProceedsButton) {
            await claimProceedsButton.click();
            console.log('   ✅ Clicked Claim Proceeds');
            await page.waitForTimeout(3000);
          }

          // Wait for wallet signature (MetaMask popup)
          console.log('   ⏳ Waiting for wallet signature...');
          await page.waitForTimeout(10000); // Give time for MetaMask interaction
          
          // Check for confirmation message
          const confirmation = await page.$('text=\"redeemed\"').catch(() => null);
          if (confirmation) {
            console.log('   ✅ Successfully claimed!');
          }
          
        } catch (error) {
          console.error(`   ❌ Error claiming win ${i + 1}:`, error.message);
        }
      }
      
      console.log('✨ Finished claiming all available wins');
    } else {
      console.log('💤 No claimable wins found');
    }
    
  } catch (error) {
    console.error('❌ Error during check:', error.message);
    
    // Try to reinitialize browser if it crashed
    if (error.message.includes('Target closed') || error.message.includes('Session closed')) {
      console.log('🔄 Browser crashed, reinitializing...');
      await closeBrowser();
      await initBrowser();
    }
  }
}

async function closeBrowser() {
  if (browser) {
    await browser.close();
    console.log('🔒 Browser closed');
  }
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║   Polymarket Auto-Claim Bot Started 🤖      ║');
  console.log('╚═══════════════════════════════════════════════╝\n');
  console.log(`⏱️  Check interval: ${CHECK_INTERVAL}`);
  console.log(`🖥️  Headless mode: ${HEADLESS}`);
  console.log('\n═════════════════════════════════════════════════\n');

  await initBrowser();

  // Run initial check
  await checkForWins();

  // Schedule periodic checks
  cron.schedule(CHECK_INTERVAL, async () => {
    await checkForWins();
  });

  console.log(`\n✅ Bot is now running. Checks scheduled every 10 minutes.`);
  console.log('   Press Ctrl+C to stop.\n');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down bot...');
  await closeBrowser();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Shutting down bot...');
  await closeBrowser();
  process.exit(0);
});

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
