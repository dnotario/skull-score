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