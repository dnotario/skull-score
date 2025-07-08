#!/usr/bin/env node
/**
 * Debug version of bonus screen test - takes screenshots at each step
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function debugBonusScreen() {
  console.log('🔍 Debug Bonus Screen Test');
  console.log('=' .repeat(50));

  const outputDir = path.join(__dirname, '..', 'visual-tests', 'debug');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: false }); // Run with UI

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false
    });

    const page = await context.newPage();
    let stepCount = 0;

    const takeDebugScreenshot = async (name: string) => {
      stepCount++;
      const filename = `${stepCount.toString().padStart(2, '0')}_${name}.png`;
      await page.screenshot({
        path: path.join(outputDir, filename),
        fullPage: false
      });
      console.log(`  📸 ${filename}`);
    };

    // Step 1: Navigate
    console.log('\n1. Navigating to page...');
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    await takeDebugScreenshot('initial_load');

    // Step 2: Clear storage and reload
    console.log('\n2. Clearing storage...');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
    await takeDebugScreenshot('after_clear');

    // Step 3: Click new game
    console.log('\n3. Clicking new game...');
    const newGameBtn = await page.$('#new-game-btn');
    if (!newGameBtn) {
      console.error('❌ New game button not found');
      return;
    }
    await newGameBtn.click();
    await page.waitForTimeout(2000);
    await takeDebugScreenshot('after_new_game_click');

    // Step 4: Check what sections are visible
    console.log('\n4. Checking visible sections...');
    const sections = await page.evaluate(() => {
      const results: Record<string, boolean> = {};
      const sectionIds = ['landing-section', 'player-names-section', 'game-section'];
      sectionIds.forEach(id => {
        const elem = document.getElementById(id);
        results[id] = elem ? !elem.classList.contains('hidden') : false;
      });
      return results;
    });
    console.log('  Visible sections:', sections);

    // Step 5: Fill players
    console.log('\n5. Filling player names...');
    const player0 = await page.$('#player-0');
    const player1 = await page.$('#player-1');
    
    if (player0) {
      await player0.fill('Jack Sparrow');
      console.log('  ✓ Filled player 0');
    } else {
      console.error('  ❌ Player 0 input not found');
    }
    
    if (player1) {
      await player1.fill('Davy Jones');
      console.log('  ✓ Filled player 1');
    } else {
      console.error('  ❌ Player 1 input not found');
    }
    
    await page.waitForTimeout(500);
    await takeDebugScreenshot('after_player_names');

    // Step 6: Check start button
    console.log('\n6. Checking start button...');
    const startBtn = await page.$('#start-game-btn');
    if (startBtn) {
      const isDisabled = await startBtn.evaluate(el => (el as HTMLButtonElement).disabled);
      console.log(`  Start button found. Disabled: ${isDisabled}`);
      
      if (!isDisabled) {
        console.log('  Clicking start button...');
        await startBtn.click();
        await page.waitForTimeout(1000);
        await takeDebugScreenshot('after_start_click');
      }
    } else {
      console.error('  ❌ Start button not found');
    }

    // Step 7: Check game section
    console.log('\n7. Checking game section visibility...');
    const gameSection = await page.$('#game-section');
    if (gameSection) {
      const isHidden = await gameSection.evaluate(el => el.classList.contains('hidden'));
      console.log(`  Game section found. Hidden: ${isHidden}`);
      
      if (!isHidden) {
        await takeDebugScreenshot('game_section_visible');
      } else {
        // Check what's preventing it
        const sectionsAfterStart = await page.evaluate(() => {
          const results: Record<string, boolean> = {};
          const sectionIds = ['landing-section', 'player-names-section', 'game-section'];
          sectionIds.forEach(id => {
            const elem = document.getElementById(id);
            results[id] = elem ? !elem.classList.contains('hidden') : false;
          });
          return results;
        });
        console.log('  Sections after start:', sectionsAfterStart);
      }
    } else {
      console.error('  ❌ Game section not found');
    }

    console.log(`\n✅ Debug complete! Screenshots saved to: ${path.resolve(outputDir)}`);
    console.log('Press Ctrl+C to close the browser...');
    
    // Keep browser open for inspection
    await new Promise(() => {});

  } finally {
    await browser.close();
  }
}

// Run the debug script
debugBonusScreen().catch(console.error);