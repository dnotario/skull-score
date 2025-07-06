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
    description: 'Player setup with 4 players named',
    execute: async (page: Page) => {
      await page.click('#new-game-btn');
      await page.waitForSelector('#player-names-section:not(.hidden)');
      await page.waitForTimeout(200);
      
      // Fill first 2 players
      await page.fill('#player-0', actions.PIRATE_NAMES[0]);
      await page.fill('#player-1', actions.PIRATE_NAMES[1]);
      
      // Add and fill 2 more players
      await page.click('#add-player-btn');
      await page.waitForTimeout(100);
      await page.fill('#player-2', actions.PIRATE_NAMES[2]);
      
      await page.click('#add-player-btn');
      await page.waitForTimeout(100);
      await page.fill('#player-3', actions.PIRATE_NAMES[3]);
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
      
      // Fill first 2 players
      await page.fill('#player-0', actions.PIRATE_NAMES[0]);
      await page.fill('#player-1', actions.PIRATE_NAMES[1]);
      
      // Add and fill 6 more players
      for (let i = 2; i < 8; i++) {
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
  game_round_1: {
    name: 'game_round_1',
    description: 'First round of the game',
    execute: async (page: Page) => {
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
      await actions.fillRound(page, 1, [
        { bid: 0, actual: 0, bonus: 0 },
        { bid: 1, actual: 1, bonus: 10 }
      ]);
    },
    tags: ['game', 'round']
  },
  
  game_round_5: {
    name: 'game_round_5',
    description: 'Mid-game round 5',
    execute: async (page: Page) => {
      await actions.setupGame(page, 3);
      await actions.playRounds(page, 4);
      await page.waitForTimeout(100);
    },
    tags: ['game', 'round']
  },
  
  game_round_10: {
    name: 'game_round_10',
    description: 'Final round of the game',
    execute: async (page: Page) => {
      await actions.setupGame(page, 3);
      await actions.playRounds(page, 9);
      await page.waitForTimeout(100);
    },
    tags: ['game', 'round', 'final']
  },
  
  game_complete: {
    name: 'game_complete',
    description: 'Game complete with winner announcement',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      await actions.playRounds(page, 10);
      await page.waitForSelector('#winner-announcement:not(.hidden)');
      await page.waitForTimeout(100);
    },
    tags: ['game', 'complete']
  },
  
  // Modal scenarios
  bonus_calculator_empty: {
    name: 'bonus_calculator_empty',
    description: 'Bonus calculator modal (empty)',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Set up a player who can get bonus
      await page.fill('input[placeholder="Bid"]:first-of-type', '3');
      await page.fill('input[placeholder="Got"]:first-of-type', '3');
      await page.waitForTimeout(200);
      
      await actions.openBonusCalculator(page, 0);
    },
    tags: ['modal', 'bonus']
  },
  
  bonus_calculator_filled: {
    name: 'bonus_calculator_filled',
    description: 'Bonus calculator with values',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Set up a player who can get bonus
      await page.fill('input[placeholder="Bid"]:first-of-type', '3');
      await page.fill('input[placeholder="Got"]:first-of-type', '3');
      await page.waitForTimeout(200);
      
      await actions.openBonusCalculator(page, 0);
      
      // Add some bonus selections
      await actions.addBonusSelections(page, [
        { type: 'standard14', count: 2 },
        { type: 'mermaidPirate', count: 1 },
        { type: 'skullPirate', count: 1 }
      ]);
    },
    tags: ['modal', 'bonus']
  },
  
  error_modal: {
    name: 'error_modal',
    description: 'Error modal for invalid input',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      
      // Create invalid round data (tricks don't sum to cards dealt)
      await page.fill('input[placeholder="Bid"]:first-of-type', '5');
      await page.fill('input[placeholder="Got"]:first-of-type', '3');
      await page.fill('input[placeholder="Bid"]:last-of-type', '2');
      await page.fill('input[placeholder="Got"]:last-of-type', '1');
      
      await page.click('#add-round-btn');
      await page.waitForSelector('.modal-overlay.active');
      await page.waitForTimeout(100);
    },
    tags: ['modal', 'error']
  },
  
  new_game_modal: {
    name: 'new_game_modal',
    description: 'New game confirmation modal',
    execute: async (page: Page) => {
      await actions.setupGame(page, 2);
      await actions.playRounds(page, 3);
      await page.click('#new-game-ingame-btn');
      await page.waitForSelector('.modal-overlay.active');
      await page.waitForTimeout(100);
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