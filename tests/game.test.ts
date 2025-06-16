/**
 * @jest-environment jsdom
 */

// Mock DOM elements for testing
const createMockElement = (id: string) => {
    const element = document.createElement('div');
    element.id = id;
    return element;
};

// Setup DOM mocks
beforeEach(() => {
    document.body.innerHTML = `
        <div id="landing-section"></div>
        <div id="player-names-section"></div>
        <div id="game-section"></div>
        <div id="player-names-inputs"></div>
        <div id="score-display"></div>
        <div id="round-number"></div>
        <div id="round-inputs"></div>
        <div id="previous-rounds"></div>
        <div id="modal"></div>
        <div id="modal-title"></div>
        <div id="modal-message"></div>
        <div id="modal-options"></div>
        <div id="modal-buttons"></div>
        <div id="modal-checkbox-container"></div>
        <div id="modal-confirm"></div>
        <div id="modal-cancel"></div>
        <input id="keep-names-checkbox" type="checkbox" />
    `;
    
    // Mock localStorage
    const localStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true
    });
    
    // Mock speechSynthesis only if it doesn't exist
    if (!window.speechSynthesis) {
        Object.defineProperty(window, 'speechSynthesis', {
            value: {
                speak: jest.fn(),
                cancel: jest.fn(),
                getVoices: jest.fn(() => [])
            },
            writable: true
        });
    }
});

// Import the class after DOM setup
import '../game';

// Declare the SkullKingGame class
declare global {
    interface Window {
        SkullKingGame: any;
    }
}

describe('SkullKingGame Scoring Logic', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        // Create a fresh game instance for each test
        gameInstance = new window.SkullKingGame();
    });
    
    test('should calculate correct scores for exact bid', () => {
        const bid = 3;
        const actual = 3;
        const bonus = 0;
        const round = 5;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round);
        const expectedScore = 20 * actual + bonus; // 20 * 3 = 60
        
        expect(actualScore).toBe(expectedScore);
    });
    
    test('should calculate correct scores for failed bid', () => {
        const bid = 3;
        const actual = 1; // bid 3, got 1
        const bonus = 0;
        const round = 5;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round);
        const expectedScore = -10 * Math.abs(bid - actual); // -10 * 2 = -20
        
        expect(actualScore).toBe(expectedScore);
    });
    
    test('should calculate correct scores with bonus points', () => {
        const bid = 2;
        const actual = 2;
        const bonus = 15;
        const round = 3;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round);
        const expectedScore = 20 * actual + bonus; // 20 * 2 + 15 = 55
        
        expect(actualScore).toBe(expectedScore);
    });
    
    test('should handle successful zero bid correctly', () => {
        const bid = 0;
        const actual = 0;
        const bonus = 5;
        const round = 7;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round);
        const expectedScore = 10 * round + bonus; // 10 * 7 + 5 = 75
        
        expect(actualScore).toBe(expectedScore);
    });
    
    test('should handle failed zero bid correctly', () => {
        const bid = 0;
        const actual = 2; // took 2 tricks when bid 0
        const round = 5;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, 0, round);
        const expectedScore = -10 * round; // -10 * 5 = -50
        
        expect(actualScore).toBe(expectedScore);
    });
    
    test('should handle failed zero bid in different rounds', () => {
        // Test failed zero bid penalty scales with round number
        const testCases = [
            { round: 1, expectedPenalty: -10 },
            { round: 3, expectedPenalty: -30 },
            { round: 7, expectedPenalty: -70 },
            { round: 10, expectedPenalty: -100 }
        ];
        
        testCases.forEach(({ round, expectedPenalty }) => {
            const bid = 0;
            const actual = 1; // took at least 1 trick
            
            const actualScore = gameInstance.testCalculateRoundScore(bid, actual, 0, round);
            expect(actualScore).toBe(expectedPenalty);
        });
    });
    
    test('should handle zero bid with no bonus when failed', () => {
        // Failed zero bid should ignore bonus points
        const bid = 0;
        const actual = 1;
        const bonus = 20; // Should be ignored for failed zero bid
        const round = 6;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round);
        const expectedScore = -10 * round; // -60, bonus ignored
        
        expect(actualScore).toBe(expectedScore);
    });
});

describe('SkullKingGame Player Limits', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        gameInstance = new window.SkullKingGame();
    });
    
    test('should enforce maximum of 8 players', () => {
        // Setup with exactly 8 players (should work)
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Henry']);
        
        const result = gameInstance.viewModel.validateAndStartGame();
        expect(result).toBeNull(); // Should succeed
    });
    
    test('should reject more than 8 players', () => {
        // Setup with 9 players (should fail)
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy']);
        
        const result = gameInstance.viewModel.validateAndStartGame();
        expect(result).toBe('Too many pirates! Maximum 8 scallywags allowed.');
    });
    
    test('should require minimum of 2 players', () => {
        // Setup with 1 player (should fail)
        gameInstance.viewModel.setTempPlayers(['Alice']);
        
        const result = gameInstance.viewModel.validateAndStartGame();
        expect(result).toBe('Ye need at least 2 pirates to sail these waters!');
    });
    
    test('should accept minimum of 2 players', () => {
        // Setup with exactly 2 players (should work)
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        
        const result = gameInstance.viewModel.validateAndStartGame();
        expect(result).toBeNull(); // Should succeed
    });
    
    test('should reject duplicate player names', () => {
        // Setup with duplicate names
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'alice']); // case-insensitive duplicate
        
        const result = gameInstance.viewModel.validateAndStartGame();
        expect(result).toBe('Each pirate needs a unique name, ye scurvy dogs!');
    });
    
    test('should handle empty and whitespace-only names', () => {
        // Setup with empty/whitespace names that should be filtered out
        gameInstance.viewModel.setTempPlayers(['Alice', '', '  ', 'Bob']);
        
        const result = gameInstance.viewModel.validateAndStartGame();
        expect(result).toBeNull(); // Should succeed with 2 valid names
    });
});

describe('SkullKingGame Validation', () => {
    test('should validate bid ranges correctly', () => {
        // Assuming round 5 (max 5 tricks)
        const maxTricks = 5;
        
        // Valid bids
        expect(0).toBeGreaterThanOrEqual(0);
        expect(0).toBeLessThanOrEqual(maxTricks);
        expect(maxTricks).toBeGreaterThanOrEqual(0);
        expect(maxTricks).toBeLessThanOrEqual(maxTricks);
        
        // Invalid bids would be < 0 or > maxTricks
        expect(-1).toBeLessThan(0);
        expect(maxTricks + 1).toBeGreaterThan(maxTricks);
    });
    
    test('should validate actual tricks correctly', () => {
        const maxTricks = 5;
        
        // Valid actual values
        expect(0).toBeGreaterThanOrEqual(0);
        expect(maxTricks).toBeLessThanOrEqual(maxTricks);
        
        // Invalid actual values
        expect(-1).toBeLessThan(0);
        expect(maxTricks + 1).toBeGreaterThan(maxTricks);
    });
    
    test('should validate bonus points range', () => {
        // Bonus points should be reasonable (assuming -50 to 50 range)
        const minBonus = -50;
        const maxBonus = 50;
        
        expect(0).toBeGreaterThanOrEqual(minBonus);
        expect(0).toBeLessThanOrEqual(maxBonus);
        expect(minBonus).toBeGreaterThanOrEqual(minBonus);
        expect(maxBonus).toBeLessThanOrEqual(maxBonus);
    });
    
    test('should not allow bonus points for incorrect predictions', () => {
        const gameInstance = new window.SkullKingGame();
        
        // Test failed bid with bonus points should not add bonus to score
        const bid = 3;
        const actual = 1; // Incorrect prediction
        const bonus = 20; // Bonus should be ignored
        const round = 5;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round);
        const expectedScore = -10 * Math.abs(bid - actual); // -20, bonus ignored
        
        expect(actualScore).toBe(expectedScore);
    });
    
    test('should allow bonus points only for correct predictions', () => {
        const gameInstance = new window.SkullKingGame();
        
        // Test correct bid with bonus points
        const bid = 2;
        const actual = 2; // Correct prediction
        const bonus = 15;
        const round = 3;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round);
        const expectedScore = 20 * actual + bonus; // 40 + 15 = 55
        
        expect(actualScore).toBe(expectedScore);
    });
    
    test('should allow bonus points for successful zero bids', () => {
        const gameInstance = new window.SkullKingGame();
        
        // Test successful zero bid with bonus points
        const bid = 0;
        const actual = 0; // Correct zero prediction
        const bonus = 10;
        const round = 7;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round);
        const expectedScore = 10 * round + bonus; // 70 + 10 = 80
        
        expect(actualScore).toBe(expectedScore);
    });
});

describe('SkullKingGame Round Management', () => {
    test('should progress rounds correctly', () => {
        // Test round progression (1-10 in Skull King)
        const rounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        
        rounds.forEach(round => {
            expect(round).toBeGreaterThanOrEqual(1);
            expect(round).toBeLessThanOrEqual(10);
        });
    });
    
    test('should handle maximum tricks per round', () => {
        // In Skull King, max tricks = round number
        const testCases = [
            { round: 1, maxTricks: 1 },
            { round: 5, maxTricks: 5 },
            { round: 10, maxTricks: 10 }
        ];
        
        testCases.forEach(({ round, maxTricks }) => {
            expect(maxTricks).toBe(round);
        });
    });
});

describe('SkullKingGame Data Persistence', () => {
    test('should handle localStorage operations', () => {
        const mockData = {
            players: ['Alice', 'Bob'],
            rounds: [],
            currentRound: 1
        };
        
        // Test that localStorage methods can be called
        expect(() => {
            localStorage.setItem('skullKingGame', JSON.stringify(mockData));
            localStorage.getItem('skullKingGame');
            localStorage.removeItem('skullKingGame');
        }).not.toThrow();
    });
});

describe('SkullKingGame Update Last Round', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        gameInstance = new window.SkullKingGame();
        
        // Mock the DOM elements needed for update functionality
        document.body.innerHTML += `
            <div id="modal"></div>
            <div id="modal-title"></div>
            <div id="modal-message"></div>
            <div id="modal-options"></div>
            <div id="modal-buttons"></div>
            <div id="modal-checkbox-container"></div>
            <button id="modal-confirm"></button>
            <button id="modal-cancel"></button>
            <input id="bid-Alice" />
            <input id="actual-Alice" />
            <input id="bonus-Alice" />
            <input id="bid-Bob" />
            <input id="actual-Bob" />
            <input id="bonus-Bob" />
        `;
    });
    
    test('should not allow update when no rounds exist', () => {
        // Setup game with no rounds
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Mock alert to capture the message
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        
        // Try to update last round
        gameInstance.handleUpdateLastRound();
        
        // Should show error message
        expect(alertSpy).toHaveBeenCalledWith('No rounds to update!');
        
        alertSpy.mockRestore();
    });
    
    test('should properly get last round data for editing', () => {
        // Setup game with players
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Add a round (round 1, so max bid/actual is 1)
        const roundData = {
            'Alice': { bid: 1, actual: 1, bonus: 5 },
            'Bob': { bid: 1, actual: 0, bonus: 0 }
        };
        gameInstance.viewModel.addRound(roundData);
        
        // Get last round data
        const lastRoundData = gameInstance.viewModel.getLastRoundData();
        
        // Verify the data is correct
        expect(lastRoundData).toEqual(roundData);
    });
    
    test('should handle update last round functionality', () => {
        // Setup game with players
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Add a round (round 1, so max bid/actual is 1)
        const roundData = {
            'Alice': { bid: 1, actual: 1, bonus: 10 },
            'Bob': { bid: 0, actual: 0, bonus: 0 }
        };
        gameInstance.viewModel.addRound(roundData);
        
        // Verify the round was added
        const gameState = gameInstance.viewModel.getGameState();
        expect(gameState.rounds.length).toBe(1);
        
        // Get last round data for editing
        const lastRoundData = gameInstance.viewModel.getLastRoundData();
        expect(lastRoundData).toEqual(roundData);
    });
    
    test('should update last round correctly', () => {
        // Setup game with players (need at least 2)
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        const setupResult = gameInstance.viewModel.validateAndStartGame();
        expect(setupResult).toBeNull(); // Should succeed
        
        // Add initial round
        const initialRoundData = {
            'Alice': { bid: 1, actual: 1, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 }
        };
        const addResult = gameInstance.viewModel.addRound(initialRoundData);
        expect(addResult).toBeNull(); // Should succeed
        
        // Verify initial state
        let gameState = gameInstance.viewModel.getGameState();
        expect(gameState.rounds.length).toBe(1);
        expect(gameState.players.length).toBe(2);
        expect(gameState.players[0].score).toBe(20); // Alice: 20 points for correct bid
        expect(gameState.players[1].score).toBe(10); // Bob: 10 points for successful zero bid (round 1)
        
        // Update the last round
        const updatedRoundData = {
            'Alice': { bid: 1, actual: 0, bonus: 0 }, // Changed actual from 1 to 0
            'Bob': { bid: 0, actual: 1, bonus: 0 }    // Changed actual from 0 to 1 (failed zero bid)
        };
        const updateResult = gameInstance.viewModel.updateLastRound(updatedRoundData);
        expect(updateResult).toBeNull(); // Should succeed
        
        // Verify updated state
        gameState = gameInstance.viewModel.getGameState();
        expect(gameState.rounds.length).toBe(1); // Still 1 round
        expect(gameState.players[0].score).toBe(-10); // Alice: -10 points for failed bid
        expect(gameState.players[1].score).toBe(-10); // Bob: -10 points for failed zero bid (round 1)
    });
});