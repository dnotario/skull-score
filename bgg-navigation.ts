import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome'
  });
  const page = await browser.newPage();
  
  // Navigate to BGG
  await page.goto('https://boardgamegeek.com');
  
  console.log('BGG opened. Please navigate to where you want to post.');
  console.log('Common locations for promotional content:');
  console.log('- Forums > General Gaming > Gaming News');
  console.log('- Game page > Files section');
  console.log('- Game page > Links section');
  console.log('- Your GeekList');
  
  // Keep browser open
  await page.waitForTimeout(300000); // 5 minutes
})();