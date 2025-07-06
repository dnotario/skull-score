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
  await page.waitForTimeout(1000); // Give time for JS to generate inputs
  
  // Add players if needed (default is 2)
  for (let i = 2; i < playerCount; i++) {
    await page.click('#add-player-btn');
    await page.waitForTimeout(300);
  }
  
  // Fill in player names
  for (let i = 0; i < playerCount; i++) {
    const selector = `#player-${i}`;
    await page.waitForSelector(selector, { state: 'visible' });
    await page.locator(selector).fill(PIRATE_NAMES[i]);
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
 * Play multiple rounds
 */
export async function playRounds(page: Page, roundCount: number) {
  for (let round = 1; round <= roundCount; round++) {
    await completeRound(page, round);
  }
}

/**
 * Open bonus calculator for a player
 */
export async function openBonusCalculator(page: Page, playerIndex: number) {
  const calcButtons = await page.$$('.bonus-calculator-btn');
  if (calcButtons[playerIndex]) {
    await calcButtons[playerIndex].click();
    await page.waitForSelector('.modal-overlay.active', { state: 'visible' });
    await page.waitForTimeout(300);
  }
}

/**
 * Add bonus selections in the calculator
 */
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