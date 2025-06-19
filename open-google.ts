import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome' // Use the system's Chrome installation
  });
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  
  console.log('Google.com opened successfully!');
  console.log('Press Ctrl+C to close the browser...');
})();