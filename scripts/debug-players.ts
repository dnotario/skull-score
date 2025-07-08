#!/usr/bin/env node
/**
 * Debug player input generation
 */

import { chromium } from 'playwright';

async function debugPlayerInputs() {
  const browser = await chromium.launch({ 
    headless: false, // Show browser to see what's happening
    slowMo: 500 // Slow down actions
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1200, height: 800 }
    });
    const page = await context.newPage();
    
    console.log('🔍 Debugging player inputs...\n');
    
    // Navigate
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    
    // Click new game
    console.log('1. Clicking new game button...');
    await page.click('#new-game-btn');
    await page.waitForTimeout(1000);
    
    // Check what inputs exist
    console.log('2. Looking for player inputs...');
    const inputs = await page.$$eval('#player-names-inputs input', elements => 
      elements.map(el => ({
        id: el.id,
        placeholder: el.getAttribute('placeholder'),
        type: el.type,
        value: el.value
      }))
    );
    
    console.log('   Found inputs:', inputs);
    
    // Try to fill them
    console.log('\n3. Trying to fill players...');
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].id) {
        try {
          await page.fill(`#${inputs[i].id}`, `Player ${i + 1}`);
          console.log(`   ✓ Filled ${inputs[i].id}`);
        } catch (e) {
          console.log(`   ✗ Failed to fill ${inputs[i].id}`);
        }
      }
    }
    
    // Try adding more players
    console.log('\n4. Adding more players...');
    for (let i = 2; i < 5; i++) {
      console.log(`   Clicking add player button (attempt ${i - 1})...`);
      await page.click('#add-player-btn');
      await page.waitForTimeout(1000);
      
      // Check inputs again
      const newInputs = await page.$$eval('#player-names-inputs input', elements => 
        elements.map(el => el.id)
      );
      console.log(`   Now have inputs:`, newInputs);
    }
    
    // Wait to see result
    console.log('\n✅ Debug complete. Browser will close in 5 seconds...');
    await page.waitForTimeout(5000);
    
  } finally {
    await browser.close();
  }
}

debugPlayerInputs().catch(console.error);