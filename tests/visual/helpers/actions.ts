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
  
  // Wait for the first player input to be ready
  await page.waitForSelector('#player-0', { state: 'visible' });
  
  // Check how many players we start with
  const initialPlayerCount = await page.$$eval('input[id^="player-"]', els => els.length);
  
  // Add players if needed (game starts with 1 player)
  for (let i = initialPlayerCount; i < playerCount; i++) {
    await page.click('#add-player-btn');
    // Wait for the new player input to appear
    await page.waitForSelector(`#player-${i}`, { state: 'visible' });
  }
  
  // Fill in player names
  for (let i = 0; i < playerCount; i++) {
    const selector = `#player-${i}`;
    await page.locator(selector).fill(PIRATE_NAMES[i]);
  }
  
  // Start the game
  await page.click('#start-game-btn');
  await page.waitForSelector('#game-section:not(.hidden)', { state: 'visible' });
  // Wait for first input to be interactive
  await page.waitForSelector('#bid-player-0', { state: 'visible' });
}

/**
 * Fill in bid value for a specific player
 */
export async function setBid(page: Page, playerIndex: number, value: number) {
  const bidInput = await page.$(`#bid-player-${playerIndex}`);
  if (bidInput) {
    await bidInput.fill(value.toString());
  }
}

/**
 * Fill in actual/won value for a specific player
 */
export async function setWon(page: Page, playerIndex: number, value: number) {
  const actualInput = await page.$(`#actual-player-${playerIndex}`);
  if (actualInput) {
    await actualInput.fill(value.toString());
  }
}

/**
 * Fill in bid and won values for a specific player
 */
export async function setPlayerRound(page: Page, playerIndex: number, bid: number, won: number) {
  await setBid(page, playerIndex, bid);
  await setWon(page, playerIndex, won);
}

/**
 * Fill in data for a round
 */
export async function fillRound(page: Page, roundNumber: number, data: RoundData[]) {
  for (let i = 0; i < data.length; i++) {
    await setPlayerRound(page, i, data[i].bid, data[i].actual);
    
    // Handle bonus if player bid equals actual and has bonus
    if (data[i].bonus > 0 && data[i].bid === data[i].actual) {
      await setBonus(page, i, data[i].bonus);
    }
  }
}

/**
 * Set bonus for a player using the bonus calculator
 */
export async function setBonus(page: Page, playerIndex: number, bonusAmount: number) {
  const bonusButton = await page.$(`#bonus-player-${playerIndex}`);
  if (!bonusButton) return;
  
  await bonusButton.click();
  await page.waitForSelector('#bonus-modal-overlay.active', { state: 'visible' });
  
  // Set bonus values directly in one go
  await page.evaluate((amount) => {
    const game = (window as any).game;
    game.clearBonusCalculator();
    
    if (amount === 20) {
      game.updateBonusCounter('black14', 1); // Black 14 is worth 20
    } else if (amount >= 10) {
      const standard14Count = Math.min(3, Math.floor(amount / 10));
      for (let i = 0; i < standard14Count; i++) {
        game.updateBonusCounter('standard14', 1);
      }
    }
    
    game.applyBonusCalculator();
  }, bonusAmount);
  
  await page.waitForSelector('#bonus-modal-overlay.active', { state: 'hidden' });
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
  // Wait for the next round's inputs to be ready
  if (roundNumber < 10) {
    await page.waitForSelector('#bid-player-0', { state: 'visible' });
  }
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
}

/**
 * Play a specific number of rounds
 * First player wins equal to round number, others bid/win 0
 */
export async function playRounds(page: Page, numberOfRounds: number, playerCount: number): Promise<void> {
  for (let round = 1; round <= numberOfRounds; round++) {
    // First player wins equal to round number
    await setBid(page, 0, round);
    await setWon(page, 0, round);
    
    // Other players bid and win 0
    for (let p = 1; p < playerCount; p++) {
      await setBid(page, p, 0);
      await setWon(page, p, 0);
    }
    
    await page.click('#add-round-btn');
    
    // For rounds before the last, wait for next round inputs
    if (round < numberOfRounds) {
      await page.waitForSelector('#bid-player-0', { state: 'visible' });
    }
  }
}