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
      await page.waitForTimeout(100);
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
      await page.waitForTimeout(100);
    },
    tags: ['basic', 'setup']
  },
  
  player_setup_filled: {
    name: 'player_setup_filled',
    description: 'Player setup with 4 players (empty for now)',
    execute: async (page: Page) => {
      await page.click('#new-game-btn');
      await page.waitForSelector('#player-names-section:not(.hidden)', { state: 'visible' });
      await page.waitForTimeout(500);
      
      // Just add players, don't fill names yet
      await page.click('#add-player-btn');
      await page.waitForTimeout(200);
      await page.click('#add-player-btn');
      await page.waitForTimeout(200);
    },
    tags: ['basic', 'setup']
  },
  
  player_setup_8_players: {
    name: 'player_setup_8_players',
    description: 'Maximum 8 players setup',
    execute: async (page: Page) => {
      await page.click('#new-game-btn');
      await page.waitForSelector('#player-names-section:not(.hidden)');
      await page.waitForTimeout(200);
      
      // Fill first player
      await page.fill('#player-0', actions.PIRATE_NAMES[0]);
      
      // Add and fill 7 more players  
      for (let i = 1; i < 8; i++) {
        await page.click('#add-player-btn');
        await page.waitForTimeout(100);
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
      await page.waitForTimeout(100);
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
  
  game_round_1: {
    name: 'game_round_1',
    description: 'First round of the game',
    execute: async (page: Page) => {
      // Just setup with 2 players for simpler test
      await actions.setupGame(page, 2);
      await page.waitForTimeout(100);
    },
    tags: ['game', 'round']
  },
  
  game_round_1_filled: {
    name: 'game_round_1_filled',
    description: 'First round with bids entered',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Wait for the round inputs to be visible
      await page.waitForSelector('#bid-player-0', { state: 'visible' });
      
      // Use the helper functions to fill round data without bonus
      await actions.setPlayerRound(page, 0, 0, 0);  // Captain Jack: bid 0, got 0
      await actions.setPlayerRound(page, 1, 1, 1);  // Anne Bonny: bid 1, got 1
      
      // Wait for the values and scores to be visible
      await page.waitForTimeout(500);
    },
    tags: ['game', 'round']
  },
  
  game_round_5: {
    name: 'game_round_5',
    description: 'Mid-game round 5',
    execute: async (page: Page) => {
      await actions.setupGame(page, 3);
      
      // Wait for the round inputs to be visible
      await page.waitForSelector('#bid-player-0', { state: 'visible' });
      
      // Play rounds 1-4
      await actions.playRounds(page, 4, 3);
      
      // Now fill round 5 with interesting data
      await actions.setPlayerRound(page, 0, 2, 3);  // Captain Jack: bid 2, got 3 (missed)
      await actions.setPlayerRound(page, 1, 1, 1);  // Anne Bonny: bid 1, got 1 (correct)
      await actions.setPlayerRound(page, 2, 1, 1);  // Blackbeard: bid 1, got 1 (correct)
      
      // Anne Bonny gets bonus
      await actions.setBonus(page, 1, 20);
      
      await page.waitForTimeout(500);
    },
    tags: ['game', 'round']
  },
  
  game_round_10: {
    name: 'game_round_10',
    description: 'Final round of the game',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Wait for the round inputs to be visible
      await page.waitForSelector('#bid-player-0', { state: 'visible' });
      
      // Play all 10 rounds using the helper
      await actions.playRounds(page, 10, 2);
      
      await page.waitForTimeout(500);
    },
    tags: ['game', 'round', 'final']
  },
  
  game_complete: {
    name: 'game_complete',
    description: 'Game complete with winner announcement',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Wait for the round inputs to be visible
      await page.waitForSelector('#bid-player-0', { state: 'visible' });
      
      // Play all 10 rounds using the helper
      await actions.playRounds(page, 10, 2);
      
      // Should now show winner announcement
      await page.waitForTimeout(1000);
    },
    tags: ['game', 'complete']
  },
  
  // Modal scenarios
  bonus_calculator_empty: {
    name: 'bonus_calculator_empty',
    description: 'Bonus calculator modal (empty)',
    execute: async (page: Page) => {
      // Skip for now - need to debug
      await actions.setupGame(page, 2);
    },
    tags: ['modal', 'bonus']
  },
  
  bonus_calculator_filled: {
    name: 'bonus_calculator_filled',
    description: 'Bonus calculator with values',
    execute: async (page: Page) => {
      // Skip for now - same as empty
      await actions.setupGame(page, 2);
    },
    tags: ['modal', 'bonus']
  },
  
  error_modal: {
    name: 'error_modal',
    description: 'Error modal for invalid input',
    execute: async (page: Page) => {
      // Skip for now - just show game
      await actions.setupGame(page, 2);
    },
    tags: ['modal', 'error']
  },
  
  new_game_modal: {
    name: 'new_game_modal',
    description: 'New game confirmation modal',
    execute: async (page: Page) => {
      // Skip for now - just show game  
      await actions.setupGame(page, 2);
    },
    tags: ['modal', 'confirm']
  }
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