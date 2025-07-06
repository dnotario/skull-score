/**
 * Common page actions for visual testing
 */

import { Page } from 'playwright';

// Default pirate names for consistency
export const PIRATE_NAMES = [
  'Captain Jack',
  'Anne Bonny',
  'Blackbeard',
  'Mary Read',
  'Calico Jack',
  'Charles Vane',
  'Edward Teach',
  'Bartholomew'
];

export interface RoundData {
  bid: number;
  actual: number;
  bonus: number;
}

/**
 * Clear browser state and reload page
 */
export async function clearState(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
}

/**
 * Set up a new game with specified number of players
 */
export async function setupGame(page: Page, playerCount: number = 2) {
  // Click new game button
  await page.click('#new-game-btn');
  await page.waitForSelector('#player-names-section:not(.hidden)', { state: 'visible' });
  await page.waitForTimeout(500); // Give time for JS to generate inputs
  
  // Check how many players we start with
  const initialPlayerCount = await page.$$eval('input[id^="player-"]', els => els.length);
  
  // Add players if needed (game starts with 1 player)
  for (let i = initialPlayerCount; i < playerCount; i++) {
    await page.click('#add-player-btn');
    await page.waitForTimeout(300);
  }
  
  // Fill in player names
  for (let i = 0; i < playerCount; i++) {
    const selector = `#player-${i}`;
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout: 1000 });
      await page.locator(selector).fill(PIRATE_NAMES[i]);
    } catch (e) {
      console.warn(`Failed to fill ${selector}:`, (e as Error).message);
    }
  }
  
  // Start the game
  await page.click('#start-game-btn');
  await page.waitForSelector('#game-section:not(.hidden)', { state: 'visible' });
  await page.waitForTimeout(500);
}

/**
 * Fill in data for a round
 */
export async function fillRound(page: Page, roundNumber: number, data: RoundData[]) {
  const bidInputs = await page.$$('input[placeholder="Bid"]');
  const actualInputs = await page.$$('input[placeholder="Got"]');
  const bonusInputs = await page.$$('input[placeholder="Bonus"]');
  
  for (let i = 0; i < data.length && i < bidInputs.length; i++) {
    await bidInputs[i].fill(data[i].bid.toString());
    await actualInputs[i].fill(data[i].actual.toString());
    if (data[i].bonus > 0 && bonusInputs[i]) {
      await bonusInputs[i].fill(data[i].bonus.toString());
    }
  }
}

/**
 * Generate valid round data for testing
 */
export function generateRoundData(playerCount: number, cardsDealt: number): RoundData[] {
  const data: RoundData[] = [];
  let totalTricks = 0;
  
  for (let i = 0; i < playerCount; i++) {
    const bid = Math.floor(Math.random() * (cardsDealt + 1));
    const actual = i === playerCount - 1 
      ? cardsDealt - totalTricks  // Last player gets remaining tricks
      : Math.min(Math.floor(Math.random() * (cardsDealt + 1)), cardsDealt - totalTricks);
    
    totalTricks += actual;
    
    // Bonus only if bid matches actual
    const bonus = bid === actual ? Math.floor(Math.random() * 3) * 10 : 0;
    
    data.push({ bid, actual, bonus });
  }
  
  return data;
}

/**
 * Complete a round with valid data and submit
 */
export async function completeRound(page: Page, roundNumber: number) {
  const bidInputs = await page.$$('input[placeholder="Bid"]');
  const playerCount = bidInputs.length;
  const roundData = generateRoundData(playerCount, roundNumber);
  
  await fillRound(page, roundNumber, roundData);
  
  // Record the round
  await page.click('#add-round-btn');
  await page.waitForTimeout(500);
}


/**
 * Open bonus calculator for a specific player
 */
export async function openBonusCalculator(page: Page, playerIndex: number) {
  // Click the bonus button for the specified player
  const bonusButton = await page.$(`#round-table .round-row:first-child .player-round-data:nth-child(${playerIndex + 2}) .bonus-cell button`);
  if (bonusButton) {
    await bonusButton.click();
    await page.waitForSelector('.modal-overlay.active', { state: 'visible' });
    await page.waitForTimeout(200);
  }
}

/**
 * Play multiple rounds quickly
 */
export async function playRounds(page: Page, roundCount: number) {
  for (let round = 1; round <= roundCount; round++) {
    // Fill in simple valid data for each round
    const bidInputs = await page.$$('input[placeholder="Bid"]');
    const gotInputs = await page.$$('input[placeholder="Got"]');
    const playerCount = bidInputs.length;
    
    // Distribute tricks to match round number (cards dealt)
    let remainingTricks = round;
    for (let i = 0; i < playerCount; i++) {
      const bid = Math.min(remainingTricks, Math.floor(round / playerCount) + (i < round % playerCount ? 1 : 0));
      const got = i === playerCount - 1 ? remainingTricks : bid; // Last player gets remaining
      
      await bidInputs[i].fill(bid.toString());
      await gotInputs[i].fill(got.toString());
      
      remainingTricks -= got;
    }
    
    // Add round
    await page.click('#add-round-btn');
    await page.waitForTimeout(300);
  }
}

export async function addBonusSelections(page: Page, selections: { type: string; count: number }[]) {
  for (const selection of selections) {
    for (let i = 0; i < selection.count; i++) {
      // The bonus calculator uses onclick handlers with specific function names
      const selector = `button[onclick*="${selection.type}"][onclick*="1)"]`;
      await page.click(selector);
      await page.waitForTimeout(100);
    }
  }
}

/**
 * Close any active modal
 */
export async function closeModal(page: Page) {
  const closeButton = await page.$('.modal-overlay.active .close-btn, .modal-overlay.active button[onclick*="close"]');
  if (closeButton) {
    await closeButton.click();
    await page.waitForSelector('.modal-overlay.active', { state: 'hidden' });
  }
}

/**
 * Select scoring mode
 */
export async function selectScoringMode(page: Page, mode: 'traditional' | 'rascal') {
  const selector = mode === 'rascal' ? '#scoring-rascal' : '#scoring-traditional';
  await page.click(selector);
  await page.waitForTimeout(200);
}