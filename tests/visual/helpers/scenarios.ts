/**
 * Visual test scenario definitions
 */

import { Page } from 'playwright';
import * as actions from './actions';

export interface Scenario {
  name: string;
  description: string;
  execute: (page: Page) => Promise<void>;
  tags?: string[];
}

export const scenarios: Record<string, Scenario> = {
  // Landing page scenarios
  landing_page: {
    name: 'landing_page',
    description: 'Landing page with game description',
    execute: async (page: Page) => {
      // Just the landing page, no actions needed
      await page.waitForLoadState('domcontentloaded');
    },
    tags: ['basic', 'landing']
  },
  
  // Player setup scenarios
  player_setup_empty: {
    name: 'player_setup_empty',
    description: 'Player setup screen with empty inputs',
    execute: async (page: Page) => {
      await page.click('#new-game-btn');
      await page.waitForSelector('#player-names-section:not(.hidden)');
      await page.waitForSelector('#player-0', { state: 'visible' });
    },
    tags: ['basic', 'setup']
  },
  
  player_setup_8_players: {
    name: 'player_setup_8_players',
    description: 'Maximum 8 players setup',
    execute: async (page: Page) => {
      await page.click('#new-game-btn');
      await page.waitForSelector('#player-names-section:not(.hidden)');
      await page.waitForSelector('#player-0', { state: 'visible' });
      
      // Fill first player
      await page.fill('#player-0', actions.PIRATE_NAMES[0]);
      
      // Add and fill 7 more players  
      for (let i = 1; i < 8; i++) {
        await page.click('#add-player-btn');
        await page.waitForSelector(`#player-${i}`, { state: 'visible' });
        await page.fill(`#player-${i}`, actions.PIRATE_NAMES[i]);
      }
    },
    tags: ['edge', 'setup']
  },
  
  // Scoring mode scenarios
  scoring_mode_rascal: {
    name: 'scoring_mode_rascal',
    description: 'Player setup with Rascal scoring selected',
    execute: async (page: Page) => {
      await page.click('#new-game-btn');
      await page.waitForSelector('#player-names-section:not(.hidden)');
      await page.waitForSelector('#player-0', { state: 'visible' });
      await actions.selectScoringMode(page, 'rascal');
    },
    tags: ['basic', 'setup', 'scoring']
  },
  
  // Game play scenarios
  game_setup_complete: {
    name: 'game_setup_complete',
    description: 'Game setup with 4 players filled and game started',
    execute: async (page: Page) => {
      // This uses the fixed setupGame that handles input properly
      await actions.setupGame(page, 4);
      // Game is now started, showing round 1
    },
    tags: ['game', 'setup']
  },
  
  game_round_1_filled: {
    name: 'game_round_1_filled',
    description: 'First round with bids entered',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Use the helper functions to fill round data without bonus
      await actions.setPlayerRound(page, 0, 0, 0);  // Captain Jack: bid 0, got 0
      await actions.setPlayerRound(page, 1, 1, 1);  // Anne Bonny: bid 1, got 1
      
      // Wait for scores to update
      await page.waitForFunction(() => {
        const scoreEl = document.querySelector('#score-player-1');
        return scoreEl && scoreEl.textContent !== '0';
      });
    },
    tags: ['game', 'round']
  },
  
  game_round_5: {
    name: 'game_round_5',
    description: 'Mid-game round 5',
    execute: async (page: Page) => {
      await actions.setupGame(page, 3);
      
      // Play rounds 1-4
      await actions.playRounds(page, 4, 3);
      
      // Now fill round 5 with interesting data
      await actions.setPlayerRound(page, 0, 2, 3);  // Captain Jack: bid 2, got 3 (missed)
      await actions.setPlayerRound(page, 1, 1, 1);  // Anne Bonny: bid 1, got 1 (correct)
      await actions.setPlayerRound(page, 2, 1, 1);  // Blackbeard: bid 1, got 1 (correct)
      
      // Anne Bonny gets bonus
      await actions.setBonus(page, 1, 20);
    },
    tags: ['game', 'round']
  },
  
  bonus_error_traditional: {
    name: 'bonus_error_traditional',
    description: 'Bonus modal error when bid != actual in Traditional mode',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Set bid != actual for first player
      await page.fill('#bid-player-0', '2');
      await page.fill('#actual-player-0', '1');
      
      // Try to open bonus modal - should show error
      await page.click('#bonus-player-0');
      
      // Wait for error modal to appear
      await page.waitForSelector('#modal:not(.hidden)');
      await page.waitForSelector('#modal-title');
      
      // Ensure the error message is visible
      await page.waitForFunction(() => {
        const modalMessage = document.querySelector('#modal-message');
        return modalMessage && modalMessage.textContent?.includes('Bonus only allowed');
      });
    },
    tags: ['game', 'modal', 'error']
  },
  
  bonus_error_rascal: {
    name: 'bonus_error_rascal',
    description: 'Bonus modal error when off by 2+ in Rascal mode',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Switch to Rascal scoring mode
      await page.click('#new-game-btn');
      await page.waitForSelector('#player-names-section:not(.hidden)');
      await page.click('#scoring-rascal');
      await page.fill('#player-0', 'Captain Jack');
      await page.fill('#player-1', 'Anne Bonny');
      await page.click('#start-game-btn');
      await page.waitForSelector('#game-section:not(.hidden)');
      
      // Set bid off by 3 for first player
      await page.fill('#bid-player-0', '5');
      await page.fill('#actual-player-0', '2');
      
      // Try to open bonus modal - should show error
      await page.click('#bonus-player-0');
      
      // Wait for error modal to appear
      await page.waitForSelector('#modal:not(.hidden)');
      await page.waitForSelector('#modal-title');
      
      // Ensure the error message is visible
      await page.waitForFunction(() => {
        const modalMessage = document.querySelector('#modal-message');
        return modalMessage && modalMessage.textContent?.includes('off by 2 or more');
      });
    },
    tags: ['game', 'modal', 'error', 'rascal']
  },
  
  game_round_10: {
    name: 'game_round_10',
    description: 'Final round of the game',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Play all 10 rounds using the helper
      await actions.playRounds(page, 10, 2);
      
      // Wait for winner announcement to appear
      await page.waitForSelector('#winner-announcement:not(.hidden)', { state: 'visible' });
    },
    tags: ['game', 'round', 'final']
  },
  
  game_complete: {
    name: 'game_complete',
    description: 'Game complete with winner announcement',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Play all 10 rounds using the helper
      await actions.playRounds(page, 10, 2);
      
      // Wait for winner announcement to appear
      await page.waitForSelector('#winner-announcement', { state: 'visible' });
    },
    tags: ['game', 'complete']
  },
  
  // Modal scenarios
  bonus_calculator_empty: {
    name: 'bonus_calculator_empty',
    description: 'Bonus calculator modal (empty)',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Player 0 bids and wins 1 (so they can add bonus)
      await actions.setPlayerRound(page, 0, 1, 1);
      // Player 1 bids and wins 0
      await actions.setPlayerRound(page, 1, 0, 0);
      
      // Click bonus button for player 0 to open calculator
      await page.click('#bonus-player-0');
      await page.waitForSelector('#bonus-modal-overlay.active', { state: 'visible' });
    },
    tags: ['modal', 'bonus']
  },
  
  bonus_calculator_filled: {
    name: 'bonus_calculator_filled',
    description: 'Bonus calculator with values',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Player 0 bids and wins 1 (so they can add bonus)
      await actions.setPlayerRound(page, 0, 1, 1);
      // Player 1 bids and wins 0
      await actions.setPlayerRound(page, 1, 0, 0);
      
      // Click bonus button for player 0 to open calculator
      await page.click('#bonus-player-0');
      await page.waitForSelector('#bonus-modal-overlay.active', { state: 'visible' });
      
      // Add bonus values in one go
      await page.evaluate(() => {
        const game = (window as any).game;
        game.updateBonusCounter('standard14', 2); // 2 x 10 = 20
        game.updateBonusCounter('skullPirate', 1); // 1 x 30 = 30
      });
      
      // Wait for total to update
      await page.waitForFunction(() => {
        const totalEl = document.querySelector('#bonus-total-value');
        return totalEl && totalEl.textContent === '50';
      });
    },
    tags: ['modal', 'bonus']
  },

  // Expansion card scenarios
  expansion_cards_round_entry: {
    name: 'expansion_cards_round_entry',
    description: 'Round entry with Kraken and Whale checkboxes',
    execute: async (page: Page) => {
      await actions.setupGame(page, 3);
      await actions.fillRound(page, 1, [
        { bid: 1, actual: 0, bonus: 0 },
        { bid: 0, actual: 1, bonus: 0 },
        { bid: 0, actual: 0, bonus: 10 }
      ]);
      
      // Check the expansion card checkboxes
      await page.check('#kraken-played');
      await page.check('#whale-played');
      
      // Wait for UI to update
      await page.waitForTimeout(100);
    },
    tags: ['expansion', 'round_entry']
  },

  bonus_calculator_with_loot: {
    name: 'bonus_calculator_with_loot',
    description: 'Bonus calculator showing Loot alliance option',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Player 0 bids and wins 1 (so they can add bonus)
      await actions.setPlayerRound(page, 0, 1, 1);
      // Player 1 bids and wins 0
      await actions.setPlayerRound(page, 1, 0, 0);
      
      // Click bonus button for player 0 to open calculator
      await page.click('#bonus-player-0');
      await page.waitForSelector('#bonus-modal-overlay.active', { state: 'visible' });
      
      // Set some loot bonuses using JavaScript evaluation
      await page.evaluate(() => {
        const game = (window as any).game;
        game.updateBonusCounter('loot', 2); // 2 x 20 = 40
        game.updateBonusCounter('standard14', 1); // 1 x 10 = 10
        game.updateBonusCounter('mermaidPirate', 1); // 1 x 20 = 20
      });
      
      // Wait for total to update
      await page.waitForFunction(() => {
        const totalEl = document.querySelector('#bonus-total-value');
        return totalEl && totalEl.textContent === '70';
      });
    },
    tags: ['expansion', 'bonus', 'modal']
  },

  round_history_with_expansion: {
    name: 'round_history_with_expansion',
    description: 'Past rounds showing Kraken/Whale icons',
    execute: async (page: Page) => {
      await actions.setupGame(page, 3);
      
      // Round 1: Normal round
      await actions.fillRound(page, 1, [
        { bid: 1, actual: 1, bonus: 0 },
        { bid: 0, actual: 0, bonus: 10 },
        { bid: 0, actual: 0, bonus: 0 }
      ]);
      await page.click('#add-round-btn');
      await page.waitForTimeout(100);
      
      // Round 2: Kraken played (2 tricks destroyed)
      await actions.fillRound(page, 2, [
        { bid: 1, actual: 1, bonus: 0 },
        { bid: 1, actual: 0, bonus: 0 },
        { bid: 0, actual: 1, bonus: 0 }
      ]);
      await page.check('#kraken-played');
      await page.click('#add-round-btn');
      await page.waitForTimeout(100);
      
      // Round 3: Both Kraken and Whale
      await actions.fillRound(page, 3, [
        { bid: 2, actual: 1, bonus: 0 },
        { bid: 0, actual: 0, bonus: 0 },
        { bid: 1, actual: 0, bonus: 0 }
      ]);
      await page.check('#kraken-played');
      await page.check('#whale-played');
      await page.click('#add-round-btn');
      
      // Scroll to show history
      await page.evaluate(() => {
        document.getElementById('previous-rounds')?.scrollIntoView();
      });
      
      await page.waitForTimeout(100);
    },
    tags: ['expansion', 'history']
  },
  
};

/**
 * Get all scenario names
 */
export function getAllScenarioNames(): string[] {
  return Object.keys(scenarios);
}

/**
 * Get scenarios by tags
 */
export function getScenariosByTags(tags: string[]): string[] {
  return Object.entries(scenarios)
    .filter(([_, scenario]) => 
      tags.some(tag => scenario.tags?.includes(tag))
    )
    .map(([name, _]) => name);
}

/**
 * Get scenarios from a selection
 */
export function getScenarios(selection: string | string[]): string[] {
  // If it's already an array, return it
  if (Array.isArray(selection)) {
    return selection.filter(name => name in scenarios);
  }
  
  // If it's 'all', return all scenarios
  if (selection === 'all') {
    return getAllScenarioNames();
  }
  
  // If it's a tag, return scenarios with that tag
  const taggedScenarios = getScenariosByTags([selection]);
  if (taggedScenarios.length > 0) {
    return taggedScenarios;
  }
  
  // If it's a single scenario name
  if (selection in scenarios) {
    return [selection];
  }
  
  // If it's comma-separated scenario names
  if (selection.includes(',')) {
    return selection.split(',')
      .map(s => s.trim())
      .filter(name => name in scenarios);
  }
  
  // Default to empty array (no valid scenarios found)
  return [];
}