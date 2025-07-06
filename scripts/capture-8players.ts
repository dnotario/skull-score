#!/usr/bin/env node
/**
 * Simple 8-player capture script
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const outputDir = path.join(__dirname, '..', 'visual-tests', 'current');
  const browser = await chromium.launch({ headless: true });
  
  console.log('🏴‍☠️ Capturing 8-player setup...\n');

  // Mobile test
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  
  const mobilePage = await mobile.newPage();
  await mobilePage.goto('http://localhost:8080');
  await mobilePage.waitForTimeout(1000);
  
  // Open player setup
  await mobilePage.click('#new-game-btn');
  await mobilePage.waitForTimeout(2000); // Extra time for JS
  
  // Add 6 more players (to make 8 total)
  console.log('📱 iPhone: Adding players...');
  for (let i = 0; i < 6; i++) {
    await mobilePage.click('#add-player-btn');
    await mobilePage.waitForTimeout(300);
  }
  
  // Take screenshot
  await mobilePage.screenshot({
    path: path.join(outputDir, 'iPhone_12_Pro_player_setup_8_players.png'),
    fullPage: false
  });
  console.log('✓ iPhone screenshot captured');
  
  await mobile.close();
  
  // Desktop test
  const desktop = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  
  const desktopPage = await desktop.newPage();
  await desktopPage.goto('http://localhost:8080');
  await desktopPage.waitForTimeout(1000);
  
  // Open player setup
  await desktopPage.click('#new-game-btn');
  await desktopPage.waitForTimeout(2000);
  
  // Add 6 more players
  console.log('\n🖥️  Desktop: Adding players...');
  for (let i = 0; i < 6; i++) {
    await desktopPage.click('#add-player-btn');
    await desktopPage.waitForTimeout(300);
  }
  
  // Take screenshot
  await desktopPage.screenshot({
    path: path.join(outputDir, 'Desktop_HD_player_setup_8_players.png'),
    fullPage: false
  });
  console.log('✓ Desktop screenshot captured');
  
  await desktop.close();
  await browser.close();
  
  console.log('\n✅ Done! Check visual-tests/current/');
}

main().catch(console.error);