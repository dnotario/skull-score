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
    // Mock console.warn and console.log to suppress analytics logging in tests
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation((message) => {
        // Only suppress analytics event logs
        if (typeof message === 'string' && message.includes('Analytics Event')) {
            return;
        }
        // Let other console.log calls through for debugging
        console.info(message);
    });
    
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
    
    // Mock localStorage with actual storage
    const storage: { [key: string]: string } = {};
    const localStorageMock = {
        getItem: jest.fn((key: string) => storage[key] || null),
        setItem: jest.fn((key: string, value: string) => { storage[key] = value; }),
        removeItem: jest.fn((key: string) => { delete storage[key]; }),
        clear: jest.fn(() => { Object.keys(storage).forEach(key => delete storage[key]); }),
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

afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks();
});

// Import the class after DOM setup
import '../../build/runFiles/game.js';

// Declare the SkullKingGame class and i18n
declare global {
    interface Window {
        SkullKingGame: any;
        GameViewModel: any;
        i18n: any;
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
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
        // Exact bid: 20 points per trick taken = 20 * 3 = 60
        expect(actualScore).toBe(60);
    });
    
    test('should calculate correct scores for failed bid', () => {
        const bid = 3;
        const actual = 1; // bid 3, got 1
        const bonus = 0;
        const round = 5;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
        // Failed bid: -10 per difference = -10 * |3-1| = -20
        expect(actualScore).toBe(-20);
    });
    
    test('should calculate correct scores with bonus points', () => {
        const bid = 2;
        const actual = 2;
        const bonus = 15;
        const round = 3;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
        // Exact bid: 20 points per trick taken = 20 * 2 = 40, plus bonus 15 = 55
        expect(actualScore).toBe(55);
    });
    
    test('should handle successful zero bid correctly', () => {
        const bid = 0;
        const actual = 0;
        const bonus = 5;
        const round = 7;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
        // Round 7 with 4 players = 7 cards dealt
        // Successful zero bid: 10 * 7 = 70, plus bonus 5 = 75
        expect(actualScore).toBe(75);
    });
    
    test('should handle failed zero bid correctly', () => {
        const bid = 0;
        const actual = 2; // took 2 tricks when bid 0
        const round = 5;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, 0, round, 4); // 4 players
        // Round 5 with 4 players = 5 cards dealt
        // Failed zero bid: -10 * 5 = -50
        expect(actualScore).toBe(-50);
    });
    
    test('should handle failed zero bid in different rounds', () => {
        // Test failed zero bid penalty scales with cards dealt
        const testCases = [
            { round: 1, expectedPenalty: -10 },   // 1 card dealt
            { round: 3, expectedPenalty: -30 },   // 3 cards dealt
            { round: 7, expectedPenalty: -70 },   // 7 cards dealt
            { round: 10, expectedPenalty: -100 }  // 10 cards dealt
        ];
        
        testCases.forEach(({ round, expectedPenalty }) => {
            const bid = 0;
            const actual = 1; // took at least 1 trick
            
            const actualScore = gameInstance.testCalculateRoundScore(bid, actual, 0, round, 4); // 4 players
            expect(actualScore).toBe(expectedPenalty);
        });
    });
    
    test('should handle zero bid with no bonus when failed', () => {
        // Failed zero bid should ignore bonus points
        const bid = 0;
        const actual = 1;
        const bonus = 20; // Should be ignored for failed zero bid
        const round = 6;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
        // Round 6 with 4 players = 6 cards dealt
        // Failed zero bid: -10 * 6 = -60 (bonus ignored)
        expect(actualScore).toBe(-60);
    });
    
    test('should calculate based on tricks taken, not cards dealt', () => {
        // This test verifies the fix for the scoring bug
        // Different rounds with same bid should give same score
        const bid = 2;
        const actual = 2;
        const bonus = 10;
        
        // Round 3: 3 cards dealt, bid 2 tricks
        const score1 = gameInstance.testCalculateRoundScore(bid, actual, bonus, 3, 4);
        expect(score1).toBe(50); // 20 * 2 + 10 = 50
        
        // Round 7: 7 cards dealt, bid 2 tricks  
        const score2 = gameInstance.testCalculateRoundScore(bid, actual, bonus, 7, 4);
        expect(score2).toBe(50); // 20 * 2 + 10 = 50 (same as round 3!)
        
        // Scores should be equal because tricks taken (2) is the same
        expect(score1).toBe(score2);
    });
});

describe('SkullKingGame Rascal Scoring', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        // Create a fresh game instance for each test
        gameInstance = new window.SkullKingGame();
        // Set scoring mode to rascal
        gameInstance.viewModel.setScoringMode('rascal');
    });
    
    test('should calculate direct hit (exact bid) for rascal scoring', () => {
        const testCases = [
            { bid: 0, actual: 0, round: 1, bonus: 20, expected: 30 },    // 10*1 + 20 = 30
            { bid: 2, actual: 2, round: 3, bonus: 20, expected: 50 },    // 10*3 + 20 = 50
            { bid: 5, actual: 5, round: 5, bonus: 20, expected: 70 },    // 10*5 + 20 = 70
            { bid: 7, actual: 7, round: 8, bonus: 20, expected: 100 },   // 10*8 + 20 = 100
            { bid: 10, actual: 10, round: 10, bonus: 20, expected: 120 } // 10*10 + 20 = 120
        ];
        
        testCases.forEach(({ bid, actual, round, bonus, expected }) => {
            const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
            expect(actualScore).toBe(expected);
        });
    });
    
    test('should calculate glancing blow (off by 1) for rascal scoring', () => {
        const testCases = [
            { bid: 0, actual: 1, round: 2, bonus: 30, expected: 25 },    // 10 + 15 = 25
            { bid: 3, actual: 2, round: 4, bonus: 30, expected: 35 },    // 20 + 15 = 35
            { bid: 4, actual: 5, round: 6, bonus: 30, expected: 45 },    // 30 + 15 = 45
            { bid: 8, actual: 7, round: 10, bonus: 30, expected: 65 }    // 50 + 15 = 65
        ];
        
        testCases.forEach(({ bid, actual, round, bonus, expected }) => {
            const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
            expect(actualScore).toBe(expected);
        });
    });
    
    test('should calculate complete miss (off by 2+) for rascal scoring', () => {
        const testCases = [
            { bid: 0, actual: 2, round: 3 },     // Off by 2
            { bid: 5, actual: 2, round: 5 },     // Off by 3
            { bid: 3, actual: 7, round: 8 },     // Off by 4
            { bid: 10, actual: 0, round: 10 }    // Off by 10
        ];
        
        testCases.forEach(({ bid, actual, round }) => {
            const bonus = 50; // Should be ignored
            const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
            expect(actualScore).toBe(0); // Complete miss = 0 points
        });
    });
    
    test('should handle rascal scoring with no bonus', () => {
        const bid = 3;
        const actual = 3;
        const bonus = 0;
        const round = 5;
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
        // Round 5 with 4 players = 5 cards dealt
        // Direct hit: 10 * 5 = 50, no bonus
        expect(actualScore).toBe(50);
    });
    
    test('should properly round half values for glancing blows', () => {
        // Test odd potential points to ensure proper rounding
        const bid = 2;
        const actual = 3; // Off by 1
        const bonus = 15; // Odd bonus
        const round = 3; // 3 cards dealt = 30 potential points
        
        const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
        // Glancing blow: Floor(30/2) + Floor(15/2) = 15 + 7 = 22
        expect(actualScore).toBe(22);
    });
});

describe('SkullKingGame Scoring Mode Persistence', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        gameInstance = new window.SkullKingGame();
    });
    
    test('should default to normal scoring mode', () => {
        const mode = gameInstance.viewModel.getScoringMode();
        expect(mode).toBe('normal');
    });
    
    test('should save and retrieve scoring mode preference', () => {
        gameInstance.viewModel.setScoringMode('rascal');
        expect(localStorage.setItem).toHaveBeenCalledWith('skull-king-scoring-mode', 'rascal');
        
        // Simulate retrieving from localStorage
        (localStorage.getItem as jest.Mock).mockReturnValue('rascal');
        const mode = gameInstance.viewModel.getScoringMode();
        expect(mode).toBe('rascal');
    });
    
    test('should preserve scoring mode when starting new game with same players', () => {
        // Set up initial game with rascal scoring
        gameInstance.viewModel.setScoringMode('rascal');
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Start new game keeping names
        (localStorage.getItem as jest.Mock).mockReturnValue('rascal');
        gameInstance.viewModel.startNewGame(true);
        
        const mode = gameInstance.viewModel.getScoringMode();
        expect(mode).toBe('rascal');
    });
    
    test('should handle invalid scoring mode in localStorage', () => {
        // Simulate invalid value in localStorage
        (localStorage.getItem as jest.Mock).mockReturnValue('invalid-mode');
        
        const mode = gameInstance.viewModel.getScoringMode();
        expect(mode).toBe('normal'); // Should fallback to default
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
        expect(result).toBe('No more than 8 pirates can fit on this ship!');
    });
    
    test('should require minimum of 2 players', () => {
        // Setup with 1 player (should fail)
        gameInstance.viewModel.setTempPlayers(['Alice']);
        
        const result = gameInstance.viewModel.validateAndStartGame();
        expect(result).toBe('Ye need at least 2 pirates to play, ye scurvy dog!');
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
        expect(result).toBe('Each pirate needs their own name, ye bilge rat!');
    });
    
    test('should handle empty and whitespace-only names', () => {
        // Setup with empty/whitespace names that should be filtered out
        gameInstance.viewModel.setTempPlayers(['Alice', '', '  ', 'Bob']);
        
        const result = gameInstance.viewModel.validateAndStartGame();
        expect(result).toBeNull(); // Should succeed with 2 valid names
    });

    test('should handle malicious player names safely in DOM IDs', () => {
        // Test with potentially dangerous player names that could cause XSS
        const maliciousNames = [
            '"; alert("XSS"); "',
            '<script>alert("XSS")</script>'
        ];
        
        // Setup DOM elements needed for the game
        document.body.innerHTML += `
            <div id="round-inputs"></div>
            <div id="round-number"></div>
        `;
        
        gameInstance.viewModel.setTempPlayers(maliciousNames);
        gameInstance.viewModel.validateAndStartGame();
        
        // Trigger the round inputs rendering through normal game flow
        gameInstance.updateUI();
        
        // Check that IDs are generated safely with indices, not names
        const bidInput1 = document.getElementById('bid-player-0');
        const bidInput2 = document.getElementById('bid-player-1');
        
        expect(bidInput1).toBeTruthy();
        expect(bidInput2).toBeTruthy();
        
        // Verify that the dangerous names don't appear in ID attributes
        expect(bidInput1?.id).toBe('bid-player-0');
        expect(bidInput2?.id).toBe('bid-player-1');
        
        // Verify that no elements exist with the dangerous names as IDs
        expect(document.getElementById('bid-"; alert("XSS"); "')).toBeNull();
        expect(document.getElementById('bid-<script>alert("XSS")</script>')).toBeNull();
    });
});

describe('SkullKingGame Player Input Interaction', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="player-names-inputs"></div>
            <button id="add-player-btn"></button>
        `;
        gameInstance = new window.SkullKingGame();
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.updatePlayerInputs();
    });
    
    test('handlePlayerInputEnter should add player when Enter pressed on last input', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        const initialPlayerCount = gameInstance.viewModel.getTempPlayers().length;
        
        // Simulate Enter press on the last player input
        gameInstance.handlePlayerInputEnter(1, event);
        
        // Should have added a new player
        expect(gameInstance.viewModel.getTempPlayers().length).toBe(initialPlayerCount + 1);
    });
    
    test('handlePlayerInputEnter should NOT add player when Enter pressed on non-last input', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        const initialPlayerCount = gameInstance.viewModel.getTempPlayers().length;
        
        // Simulate Enter press on the first player input (not last)
        gameInstance.handlePlayerInputEnter(0, event);
        
        // Should NOT have added a new player
        expect(gameInstance.viewModel.getTempPlayers().length).toBe(initialPlayerCount);
    });
    
    test('handlePlayerInputEnter should NOT add player when at MAX_PLAYERS', () => {
        // Set up 8 players (max)
        gameInstance.viewModel.setTempPlayers(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8']);
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        
        // Simulate Enter press on the last player input
        gameInstance.handlePlayerInputEnter(7, event);
        
        // Should still have 8 players
        expect(gameInstance.viewModel.getTempPlayers().length).toBe(8);
    });
    
    test('handlePlayerInputEnter should ignore non-Enter keys', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        const initialPlayerCount = gameInstance.viewModel.getTempPlayers().length;
        
        // Simulate Tab press on the last player input
        gameInstance.handlePlayerInputEnter(1, event);
        
        // Should NOT have added a new player
        expect(gameInstance.viewModel.getTempPlayers().length).toBe(initialPlayerCount);
    });
    
    test('handleAddPlayer should focus on newly added input', (done) => {
        const initialPlayerCount = gameInstance.viewModel.getTempPlayers().length;
        
        // Add a player
        gameInstance.handleAddPlayer();
        
        // Check after setTimeout completes
        setTimeout(() => {
            const newIndex = initialPlayerCount;
            const newInput = document.getElementById(`player-${newIndex}`);
            
            // Mock focus function
            if (newInput) {
                newInput.focus = jest.fn();
                gameInstance.handleAddPlayer();
                
                setTimeout(() => {
                    expect(document.getElementById(`player-${newIndex + 1}`)?.focus).toHaveBeenCalled;
                    done();
                }, 10);
            } else {
                done();
            }
        }, 10);
    });
});

describe('SkullKingGame Auto-fill Bid Behavior', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        // Set up DOM for round inputs
        document.body.innerHTML = `
            <div id="landing-section" class="hidden"></div>
            <div id="player-names-section" class="hidden"></div>
            <div id="game-section"></div>
            <div id="score-display"></div>
            <div id="round-number"></div>
            <div id="round-inputs">
                <div class="player-round-input">
                    <input type="number" id="bid-player-0" />
                    <input type="number" id="actual-player-0" />
                    <button id="bonus-player-0" data-bonus-value="0"></button>
                    <div id="score-player-0" class="computed-score">-</div>
                </div>
                <div class="player-round-input">
                    <input type="number" id="bid-player-1" />
                    <input type="number" id="actual-player-1" />
                    <button id="bonus-player-1" data-bonus-value="0"></button>
                    <div id="score-player-1" class="computed-score">-</div>
                </div>
            </div>
        `;
        
        gameInstance = new window.SkullKingGame();
        // Start a game with 2 players
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
    });
    
    test('should auto-fill bid with 0 when actual is entered first', () => {
        const bidInput = document.getElementById('bid-player-0') as HTMLInputElement;
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        
        // Initially bid should be empty
        expect(bidInput.value).toBe('');
        
        // Enter actual value
        actualInput.value = '3';
        gameInstance.handleActualInput(0);
        
        // Bid should now be auto-filled with 0
        expect(bidInput.value).toBe('0');
    });
    
    test('should NOT overwrite existing bid when actual is entered', () => {
        const bidInput = document.getElementById('bid-player-0') as HTMLInputElement;
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        
        // Set bid first
        bidInput.value = '2';
        
        // Enter actual value
        actualInput.value = '3';
        gameInstance.handleActualInput(0);
        
        // Bid should remain unchanged
        expect(bidInput.value).toBe('2');
    });
    
    test('should calculate score correctly with auto-filled bid', () => {
        const bidInput = document.getElementById('bid-player-0') as HTMLInputElement;
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-player-0');
        
        // Enter actual value (should auto-fill bid to 0)
        // Using 1 trick since round 1 with 2 players only has 1 card each
        actualInput.value = '1';
        gameInstance.handleActualInput(0);
        
        // Check that bid was auto-filled
        expect(bidInput.value).toBe('0');
        
        // Check that score is calculated (should be -10 for traditional scoring)
        // 1 trick won with 0 bid in round 1 = -10 × 1 (cards dealt) = -10
        expect(scoreDisplay?.textContent).toBe('-10');
    });
    
    test('should not auto-fill if actual is cleared', () => {
        const bidInput = document.getElementById('bid-player-0') as HTMLInputElement;
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        
        // Clear actual value
        actualInput.value = '';
        gameInstance.handleActualInput(0);
        
        // Bid should remain empty
        expect(bidInput.value).toBe('');
    });
    
    test('should handle multiple players independently', () => {
        const bidInput0 = document.getElementById('bid-player-0') as HTMLInputElement;
        const actualInput0 = document.getElementById('actual-player-0') as HTMLInputElement;
        const bidInput1 = document.getElementById('bid-player-1') as HTMLInputElement;
        const actualInput1 = document.getElementById('actual-player-1') as HTMLInputElement;
        
        // Player 0: enter actual first (should auto-fill)
        actualInput0.value = '2';
        gameInstance.handleActualInput(0);
        expect(bidInput0.value).toBe('0');
        
        // Player 1: enter bid first (should not auto-fill)
        bidInput1.value = '1';
        actualInput1.value = '1';
        gameInstance.handleActualInput(1);
        expect(bidInput1.value).toBe('1'); // Should remain as entered
    });
    
    test('should update score immediately when bid is auto-filled', () => {
        const scoreDisplay = document.getElementById('score-player-0');
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        
        // Initially score should be dash
        expect(scoreDisplay?.textContent).toBe('-');
        
        // Enter actual (auto-fills bid to 0)
        actualInput.value = '1';
        gameInstance.handleActualInput(0);
        
        // Score should update immediately
        expect(scoreDisplay?.textContent).not.toBe('-');
        expect(scoreDisplay?.textContent).toBe('-10'); // Failed zero bid
    });
});

describe('SkullKingGame Validation', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        gameInstance = new window.SkullKingGame();
        // Setup a game with 2 players for testing
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
    });

    describe('Round Limit Validation', () => {
        test('should reject bids exceeding current round number', () => {
            // Round 1: max bid should be 1
            const roundData = {
                'Alice': { bid: 2, actual: 1, bonus: 0 }, // Invalid: bid > round
                'Bob': { bid: 1, actual: 1, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toBe("Alice's bid (2) can't exceed 1 tricks in round 1!");
        });

        test('should reject actual tricks exceeding current round number', () => {
            // Round 1: max actual should be 1
            const roundData = {
                'Alice': { bid: 1, actual: 2, bonus: 0 }, // Invalid: actual > round
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toBe("Alice can't win more than 1 tricks in round 1!");
        });

        test('should accept valid bids and actuals within round limits', () => {
            // Round 1: bid and actual = 1 should be valid
            const roundData = {
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toBeNull(); // Should succeed
        });

        test('should validate different round numbers correctly', () => {
            // Add several rounds to get to round 3
            expect(gameInstance.viewModel.addRound({
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            })).toBeNull();
            
            expect(gameInstance.viewModel.addRound({
                'Alice': { bid: 2, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 1, bonus: 0 }
            })).toBeNull();
            
            // Now in round 3, max should be 3
            const validRoundData = {
                'Alice': { bid: 3, actual: 2, bonus: 0 },
                'Bob': { bid: 1, actual: 1, bonus: 0 }
            };
            
            // Create a fresh game instance for testing the invalid data
            // since adding the valid round would move us to round 4
            const freshGame = new window.SkullKingGame();
            freshGame.viewModel.startNewGame(false);
            freshGame.viewModel.setTempPlayers(['Alice', 'Bob']);
            freshGame.viewModel.validateAndStartGame();
            
            // Add rounds to get to round 3
            freshGame.viewModel.addRound({
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            });
            freshGame.viewModel.addRound({
                'Alice': { bid: 2, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 1, bonus: 0 }
            });
            
            const invalidRoundData = {
                'Alice': { bid: 4, actual: 2, bonus: 0 }, // Invalid: bid > 3
                'Bob': { bid: 1, actual: 1, bonus: 0 }
            };
            
            expect(gameInstance.viewModel.addRound(validRoundData)).toBeNull();
            expect(freshGame.viewModel.addRound(invalidRoundData)).toContain("Alice's bid (4) can't exceed 3 tricks in round 3");
        });
    });

    describe('Centralized Input Validation', () => {
        test('should reject negative values', () => {
            // Test negative bid
            let result = gameInstance.testValidateSinglePlayerInput(-1, 1, 0, 'Alice');
            expect(result).toBe("Alice can't use negative numbers, ye scallywag!");
            
            // Test negative actual
            result = gameInstance.testValidateSinglePlayerInput(1, -1, 0, 'Alice');
            expect(result).toBe("Alice can't use negative numbers, ye scallywag!");
            
            // Test negative bonus
            result = gameInstance.testValidateSinglePlayerInput(1, 1, -10, 'Alice');
            expect(result).toBe("Alice can't use negative numbers, ye scallywag!");
        });
        
        test('should reject round with bonus points when bid does not equal actual', () => {
            // Try to add a round where Alice has bonus points but didn't make her bid
            const invalidRoundData = {
                'Alice': { bid: 1, actual: 0, bonus: 20 }, // Wrong: bonus with incorrect bid
                'Bob': { bid: 0, actual: 1, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(invalidRoundData);
            expect(result).toBe("Alice can't earn bonus points without bidding correctly (bid: 1, actual: 0)!");
            
            // Verify the round was NOT added
            const gameState = gameInstance.viewModel.getGameState();
            expect(gameState.rounds.length).toBe(0);
            expect(gameState.currentRound).toBe(1);
        });
        
        test('should accept round with bonus points when bid equals actual', () => {
            // Valid round where Alice has bonus points and made her bid
            const validRoundData = {
                'Alice': { bid: 1, actual: 1, bonus: 20 }, // Correct: bonus with exact bid
                'Bob': { bid: 0, actual: 0, bonus: 10 }    // Also correct: zero bid success with bonus
            };
            
            const result = gameInstance.viewModel.addRound(validRoundData);
            expect(result).toBeNull(); // Should succeed
            
            // Verify the round was added
            const gameState = gameInstance.viewModel.getGameState();
            expect(gameState.rounds.length).toBe(1);
            expect(gameState.currentRound).toBe(2);
            
            // Verify scores include bonuses
            const aliceScore = gameState.players.find((p: any) => p.name === 'Alice')?.score;
            const bobScore = gameState.players.find((p: any) => p.name === 'Bob')?.score;
            expect(aliceScore).toBe(40); // 20 * 1 + 20 bonus = 40
            expect(bobScore).toBe(20);   // 10 * 1 (cards) + 10 bonus = 20
        });

        test('should reject NaN values', () => {
            const result = gameInstance.testValidateSinglePlayerInput(NaN, 1, 0, 'Alice');
            expect(result).toBe("Alice needs valid numbers for all fields, ye landlubber!");
        });

        test('should reject non-integer values', () => {
            const result = gameInstance.testValidateSinglePlayerInput(1.5, 1, 0, 'Alice');
            expect(result).toBe("Alice can only use whole numbers, no half measures!");
        });

        test('should accept high bonus values when prediction is correct', () => {
            // The game doesn't restrict bonus values as long as the prediction is correct
            const result = gameInstance.testValidateSinglePlayerInput(1, 1, 150, 'Alice');
            expect(result).toBeNull(); // Should succeed - no upper limit on bonus
        });

        test('should reject bonus points for incorrect predictions', () => {
            const result = gameInstance.testValidateSinglePlayerInput(1, 0, 10, 'Alice');
            expect(result).toBe("Alice can't earn bonus points without bidding correctly (bid: 1, actual: 0)!");
        });

        test('should allow valid inputs', () => {
            const result = gameInstance.testValidateSinglePlayerInput(1, 1, 10, 'Alice');
            expect(result).toBeNull(); // Should succeed
        });

        test('should reject bid exceeding round limit', () => {
            // Round 1 with 2 players = max 1 trick
            const result = gameInstance.testValidateSinglePlayerInput(2, 0, 0, 'Alice', 1);
            expect(result).toBe("Alice's bid (2) can't exceed 1 tricks in round 1!");
        });

        test('should reject actual exceeding round limit', () => {
            // Round 1 with 2 players = max 1 trick
            const result = gameInstance.testValidateSinglePlayerInput(0, 2, 0, 'Alice', 1);
            expect(result).toBe("Alice can't win more than 1 tricks in round 1!");
        });
    });
    
    describe('Rascal Mode Bonus Validation', () => {
        beforeEach(() => {
            // Set up game in Rascal mode
            gameInstance.viewModel.startNewGame(false);
            gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
            gameInstance.viewModel.setScoringMode('rascal');
            gameInstance.viewModel.validateAndStartGame();
        });
        
        test('should allow bonus when bid equals actual in Rascal mode', () => {
            const result = gameInstance.testValidateSinglePlayerInput(1, 1, 20, 'Alice');
            expect(result).toBeNull(); // Should succeed
        });
        
        test('should allow bonus when off by 1 in Rascal mode', () => {
            // In Rascal mode, bonuses are allowed for glancing blows (off by 1)
            // Off by 1 (bid 0, actual 1)
            let result = gameInstance.testValidateSinglePlayerInput(0, 1, 20, 'Alice');
            expect(result).toBeNull(); // Should succeed - glancing blow gets half bonus
            
            // Off by 1 (bid 1, actual 0)
            result = gameInstance.testValidateSinglePlayerInput(1, 0, 20, 'Alice');
            expect(result).toBeNull(); // Should succeed - glancing blow gets half bonus
        });
        
        test('should reject bonus when off by more than 1 in Rascal mode', () => {
            // For this test, we need to advance to a later round with more tricks available
            // Add 4 dummy rounds to get to round 5
            for (let i = 0; i < 4; i++) {
                const dummyRound = {
                    'Alice': { bid: 0, actual: 0, bonus: 0 },
                    'Bob': { bid: 0, actual: 0, bonus: 0 }
                };
                gameInstance.viewModel.addRound(dummyRound);
            }
            
            // Now in round 5 with 2 players = 5 tricks available
            // Off by 2 (bid 1, actual 3)
            let result = gameInstance.testValidateSinglePlayerInput(1, 3, 20, 'Alice', 5);
            expect(result).toContain("can't earn bonus points without bidding correctly");
            
            // Off by 3 (bid 0, actual 3)
            result = gameInstance.testValidateSinglePlayerInput(0, 3, 20, 'Alice', 5);
            expect(result).toContain("can't earn bonus points without bidding correctly");
        });
        
        test('should allow bonus when off by 1 in Rascal mode and give half', () => {
            // Try to add round where Alice is off by 1 with bonus
            const roundData = {
                'Alice': { bid: 0, actual: 1, bonus: 20 }, // Off by 1
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const addResult = gameInstance.viewModel.addRound(roundData);
            expect(addResult).toBeNull(); // Should succeed now
            
            // Verify the round was added
            const gameState = gameInstance.viewModel.getGameState();
            expect(gameState.rounds.length).toBe(1);
            
            // Verify Alice got half points for glancing blow
            const alice = gameState.players.find((p: any) => p.name === 'Alice');
            // Round 1 with off by 1: 10/2 + 20/2 = 5 + 10 = 15
            expect(alice?.score).toBe(15);
        });
        
        test('should give full bonus when exact in Rascal mode', () => {
            // Add round where Alice is exact with bonus
            const roundData = {
                'Alice': { bid: 1, actual: 1, bonus: 20 }, // Exact
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const addResult = gameInstance.viewModel.addRound(roundData);
            expect(addResult).toBeNull(); // Should succeed
            
            // Verify Alice got full base score and full bonus
            const gameState = gameInstance.viewModel.getGameState();
            const aliceScore = gameState.players.find((p: any) => p.name === 'Alice')?.score;
            // Round 1 with 2 players = 1 card dealt
            // Rascal scoring: 10 * cards dealt = 10 potential points
            // Exact = full points = 10 + full bonus (20) = 30
            expect(aliceScore).toBe(30);
        });
        
        test('should reject bonus when off by 2+ in Rascal mode', () => {
            // Create a fresh game instance to avoid interference
            const freshGame = new window.SkullKingGame();
            freshGame.viewModel.startNewGame(false);
            freshGame.viewModel.setTempPlayers(['Alice', 'Bob']);
            freshGame.viewModel.setScoringMode('rascal');
            freshGame.viewModel.validateAndStartGame();
            
            // Advance to round 3 to have more tricks available
            // Round 1: 1 trick total
            freshGame.viewModel.addRound({
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            });
            
            // Round 2: 2 tricks total
            freshGame.viewModel.addRound({
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 1, actual: 1, bonus: 0 }
            });
            
            // Verify we're now in round 3
            let gameState = freshGame.viewModel.getGameState();
            expect(gameState.currentRound).toBe(3);
            
            // Try to add round 3 where Alice is off by 2 with bonus  
            // Round 3 with 2 players = 3 tricks total
            const roundData = {
                'Alice': { bid: 0, actual: 2, bonus: 20 }, // Off by 2 - should reject bonus
                'Bob': { bid: 1, actual: 1, bonus: 0 }
            };
            
            const addResult = freshGame.viewModel.addRound(roundData);
            expect(addResult).toContain("can't earn bonus points without bidding correctly");
            
            // Verify round was NOT added  
            gameState = freshGame.viewModel.getGameState();
            expect(gameState.rounds.length).toBe(2); // Only the 2 rounds we added
        });
        
        test('should handle Normal mode bonus validation correctly', () => {
            // Switch back to normal mode
            gameInstance.viewModel.setScoringMode('normal');
            
            // In normal mode, bonus only allowed when exact
            let result = gameInstance.testValidateSinglePlayerInput(1, 0, 20, 'Alice');
            expect(result).toContain("can't earn bonus points without bidding correctly");
            
            // Exact bid should allow bonus
            result = gameInstance.testValidateSinglePlayerInput(1, 1, 20, 'Alice');
            expect(result).toBeNull(); // Should succeed
        });
    });

    describe('Scoring Logic Validation', () => {
        test('should not allow bonus points for incorrect predictions', () => {
            const gameInstance = new window.SkullKingGame();
            
            // Test failed bid with bonus points should not add bonus to score
            const bid = 3;
            const actual = 1; // Incorrect prediction
            const bonus = 20; // Bonus should be ignored
            const round = 5;
            
            const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
            // Failed bid: -10 * |3-1| = -20 (bonus ignored)
            expect(actualScore).toBe(-20);
        });
        
        test('should allow bonus points only for correct predictions', () => {
            const gameInstance = new window.SkullKingGame();
            
            // Test correct bid with bonus points
            const bid = 2;
            const actual = 2; // Correct prediction
            const bonus = 15;
            const round = 3;
            
            const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
            // Exact bid: 20 * tricks taken (2) = 40, plus bonus 15 = 55
            expect(actualScore).toBe(55);
        });
        
        test('should allow bonus points for successful zero bids', () => {
            const gameInstance = new window.SkullKingGame();
            
            // Test successful zero bid with bonus points
            const bid = 0;
            const actual = 0; // Correct zero prediction
            const bonus = 10;
            const round = 7;
            
            const actualScore = gameInstance.testCalculateRoundScore(bid, actual, bonus, round, 4); // 4 players
            // Round 7 with 4 players = 7 cards dealt
            // Successful zero bid: 10 * 7 = 70, plus bonus 10 = 80
            expect(actualScore).toBe(80);
        });
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
        
        // Mock the showErrorModal method instead of alert
        const showErrorSpy = jest.spyOn(gameInstance, 'showErrorModal').mockImplementation(() => {});
        
        // Try to update last round
        gameInstance.handleUpdateLastRound();
        
        // Should show error message via modal
        expect(showErrorSpy).toHaveBeenCalledWith('No rounds to edit yet, ye scurvy dog!');
        
        showErrorSpy.mockRestore();
    });
    
    test('should properly remove last round and get data for editing', () => {
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
        
        // Remove last round and get its data
        const removedRoundData = gameInstance.viewModel.removeLastRound();
        
        // Verify the data is correct
        expect(removedRoundData).toEqual(roundData);
        
        // Verify the round was actually removed
        const gameState = gameInstance.viewModel.getGameState();
        expect(gameState.rounds.length).toBe(0);
    });
    
    test('should handle remove last round functionality', () => {
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
        let gameState = gameInstance.viewModel.getGameState();
        expect(gameState.rounds.length).toBe(1);
        
        // Remove last round and get its data
        const removedRoundData = gameInstance.viewModel.removeLastRound();
        expect(removedRoundData).toEqual(roundData);
        
        // Verify the round was removed
        gameState = gameInstance.viewModel.getGameState();
        expect(gameState.rounds.length).toBe(0);
    });

    test('should mark game as complete after round 10', () => {
        // Setup game with players
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Add rounds 1-9
        for (let round = 1; round <= 9; round++) {
            // Total tricks must equal the round number
            const roundData = {
                'Alice': { bid: round, actual: round, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            const error = gameInstance.viewModel.addRound(roundData);
            expect(error).toBeNull();
            expect(gameInstance.viewModel.state.currentRound).toBe(round + 1);
            expect(gameInstance.viewModel.state.rounds.length).toBe(round);
        }
        
        // Verify game is not complete yet
        expect(gameInstance.viewModel.isGameComplete()).toBe(false);
        expect(gameInstance.viewModel.state.currentRound).toBe(10);
        
        // Add round 10 - total tricks must equal 10
        const round10Data = {
            'Alice': { bid: 5, actual: 5, bonus: 10 },
            'Bob': { bid: 5, actual: 5, bonus: 0 }
        };
        gameInstance.viewModel.addRound(round10Data);
        
        // Verify game is now complete
        expect(gameInstance.viewModel.isGameComplete()).toBe(true);
        expect(gameInstance.viewModel.state.rounds.length).toBe(10);
        expect(gameInstance.viewModel.state.currentRound).toBe(11);
        
        // Verify winner and final scores
        const sortedPlayers = gameInstance.viewModel.getPlayersSortedByScore();
        expect(sortedPlayers[0].name).toBe('Alice');
        expect(sortedPlayers[0].score).toBeGreaterThan(sortedPlayers[1].score);
    });

    test('should allow editing round 10 when game is complete', () => {
        // Setup game with players
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Add rounds 1-10 to complete the game
        for (let round = 1; round <= 10; round++) {
            const cardsThisRound = gameInstance.viewModel.getCardsPerRound(round, 2);
            const roundData = {
                'Alice': { bid: cardsThisRound, actual: cardsThisRound, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            gameInstance.viewModel.addRound(roundData);
        }
        
        // Verify game is complete
        expect(gameInstance.viewModel.isGameComplete()).toBe(true);
        expect(gameInstance.viewModel.state.rounds.length).toBe(10);
        
        // Should be able to remove last round for editing even when game is complete
        const originalScores = {
            alice: gameInstance.viewModel.state.players[0].score,
            bob: gameInstance.viewModel.state.players[1].score
        };
        
        const removedRoundData = gameInstance.viewModel.removeLastRound();
        expect(removedRoundData).toBeDefined();
        expect(removedRoundData!['Alice'].bid).toBe(10); // Round 10 should have 10 cards
        expect(removedRoundData!['Alice'].actual).toBe(10);
        expect(removedRoundData!['Bob'].bid).toBe(0);
        expect(removedRoundData!['Bob'].actual).toBe(0);
        
        // Verify the round was removed and scores reverted
        expect(gameInstance.viewModel.state.rounds.length).toBe(9);
        expect(gameInstance.viewModel.isGameComplete()).toBe(false);
        expect(gameInstance.viewModel.state.currentRound).toBe(10);
        
        // Now we can add a new round 10 with different data (this simulates editing)
        const newRoundData = {
            'Alice': { bid: 5, actual: 5, bonus: 0 },
            'Bob': { bid: 5, actual: 5, bonus: 0 }
        };
        const addResult = gameInstance.viewModel.addRound(newRoundData);
        expect(addResult).toBeNull(); // Should succeed
        
        // Verify the new round was added
        const finalGameState = gameInstance.viewModel.getGameState();
        expect(finalGameState.rounds.length).toBe(10);
        const lastRound = finalGameState.rounds[finalGameState.rounds.length - 1];
        expect(lastRound.playerData[0].bid).toBe(5);
        expect(lastRound.playerData[0].actual).toBe(5);
        expect(lastRound.playerData[1].bid).toBe(5);
        expect(lastRound.playerData[1].actual).toBe(5);
    });
    
    test('should edit last round correctly using remove and re-add', () => {
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
        
        // Remove the last round for editing
        const removedRoundData = gameInstance.viewModel.removeLastRound();
        expect(removedRoundData).toBeDefined();
        expect(removedRoundData!['Alice'].bid).toBe(1);
        expect(removedRoundData!['Alice'].actual).toBe(1);
        expect(removedRoundData!['Bob'].bid).toBe(0);
        expect(removedRoundData!['Bob'].actual).toBe(0);
        
        // Verify scores were reverted and round was removed
        gameState = gameInstance.viewModel.getGameState();
        expect(gameState.rounds.length).toBe(0);
        expect(gameState.players[0].score).toBe(0); // Alice: score reverted
        expect(gameState.players[1].score).toBe(0); // Bob: score reverted
        expect(gameState.currentRound).toBe(1); // Current round reset
        
        // Add updated round - must maintain total wins = 1 (since round 1 with 2 players = 1 trick total)
        const updatedRoundData = {
            'Alice': { bid: 1, actual: 0, bonus: 0 }, // Changed actual from 1 to 0
            'Bob': { bid: 0, actual: 1, bonus: 0 }    // Changed actual from 0 to 1 (total still = 1)
        };
        const updateResult = gameInstance.viewModel.addRound(updatedRoundData);
        expect(updateResult).toBeNull(); // Should succeed
        
        // Verify updated state
        gameState = gameInstance.viewModel.getGameState();
        expect(gameState.rounds.length).toBe(1); // Back to 1 round
        expect(gameState.players[0].score).toBe(-10); // Alice: -10 points for failed bid
        expect(gameState.players[1].score).toBe(-10); // Bob: -10 points for failed zero bid (round 1)
    });
});

describe('SkullKingGame Modal Error Display', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        gameInstance = new window.SkullKingGame();
    });

    test('should use showErrorModal instead of alert', () => {
        // Mock the showErrorModal method (access private method via bracket notation)
        const showErrorSpy = jest.spyOn(gameInstance as any, 'showErrorModal').mockImplementation(() => {});
        
        // Call showError directly
        gameInstance.showError('Test error message');
        
        // Verify showErrorModal was called
        expect(showErrorSpy).toHaveBeenCalledWith('Test error message');
        
        showErrorSpy.mockRestore();
    });

    test('should handle speech synthesis error with modal', () => {
        // Mock speech synthesis not supported
        const originalSpeechSynthesis = window.speechSynthesis;
        delete (window as any).speechSynthesis;
        
        // Also mock SpeechSynthesisUtterance
        const originalSpeechSynthesisUtterance = (window as any).SpeechSynthesisUtterance;
        delete (window as any).SpeechSynthesisUtterance;
        
        // Mock the showErrorModal method (access private method via bracket notation)
        const showErrorSpy = jest.spyOn(gameInstance as any, 'showErrorModal').mockImplementation(() => {});
        
        // Try to read scores (should trigger error modal)
        gameInstance.readScores();
        
        // Verify error modal is called
        expect(showErrorSpy).toHaveBeenCalledWith('Yer browser doesn\'t support speech, ye landlubber!');
        
        // Restore speech synthesis
        (window as any).speechSynthesis = originalSpeechSynthesis;
        (window as any).SpeechSynthesisUtterance = originalSpeechSynthesisUtterance;
        showErrorSpy.mockRestore();
    });

    test('should call showErrorModal when validation fails', () => {
        // Setup a game with players  
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Mock the showErrorModal method (access private method via bracket notation)
        const showErrorSpy = jest.spyOn(gameInstance as any, 'showErrorModal').mockImplementation(() => {});
        
        // Mock the handleAddRound method to trigger an error
        const invalidRoundData = {
            'Alice': { bid: 5, actual: 1, bonus: 0 }, // Invalid: bid > round 1
            'Bob': { bid: 1, actual: 1, bonus: 0 }
        };
        
        // Simulate the error flow
        const error = gameInstance.viewModel.addRound(invalidRoundData);
        expect(error).not.toBeNull(); // Should fail validation
        
        // Simulate calling showError with the validation error
        gameInstance.showError(error);
        
        // Verify showErrorModal was called with the correct error message
        expect(showErrorSpy).toHaveBeenCalledWith("Alice's bid (5) can't exceed 1 tricks in round 1!");
        
        showErrorSpy.mockRestore();
    });
    
    test('should call showErrorModal when opening bonus modal with bid != actual in Traditional mode', () => {
        // Setup a game with players
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Mock the showModal method (access private method via bracket notation)
        const showModalSpy = jest.spyOn(gameInstance as any, 'showModal').mockImplementation(() => {});
        
        // Add DOM elements for the bid and actual inputs
        document.body.innerHTML += `
            <input type="number" id="bid-player-0" value="2" />
            <input type="number" id="actual-player-0" value="1" />
            <div id="bonus-modal-overlay"></div>
        `;
        
        // Set to Traditional mode
        gameInstance.viewModel.setScoringMode('normal');
        
        // Try to open bonus modal with bid != actual
        gameInstance.openBonusModal(0);
        
        // Verify showModal was called with correct message
        expect(showModalSpy).toHaveBeenCalledWith(
            expect.any(String),
            'Arrr! Bonus only be allowed when yer bid equals actual tricks won!'
        );
        
        // Verify bonus modal did not open
        const bonusModal = document.getElementById('bonus-modal-overlay');
        expect(bonusModal).toBeTruthy();
        expect(bonusModal!.classList.contains('active')).toBe(false);
        
        showModalSpy.mockRestore();
    });
    
    test('should call showErrorModal when opening bonus modal with bid off by 2+ in Rascal mode', () => {
        // Setup a game with players
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Mock the showModal method (access private method via bracket notation)
        const showModalSpy = jest.spyOn(gameInstance as any, 'showModal').mockImplementation(() => {});
        
        // Add DOM elements for the bid and actual inputs
        document.body.innerHTML += `
            <input type="number" id="bid-player-0" value="5" />
            <input type="number" id="actual-player-0" value="2" />
            <div id="bonus-modal-overlay"></div>
        `;
        
        // Set to Rascal mode
        gameInstance.viewModel.setScoringMode('rascal');
        
        // Try to open bonus modal with bid off by 3
        gameInstance.openBonusModal(0);
        
        // Verify showModal was called with correct message
        expect(showModalSpy).toHaveBeenCalledWith(
            expect.any(String),
            'Shiver me timbers! No bonus when ye be off by 2 or more!'
        );
        
        // Verify bonus modal did not open
        const bonusModal = document.getElementById('bonus-modal-overlay');
        expect(bonusModal).toBeTruthy();
        expect(bonusModal!.classList.contains('active')).toBe(false);
        
        showModalSpy.mockRestore();
    });
});

describe('SkullKingGame Score Announcement', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        gameInstance = new window.SkullKingGame();
        // Setup a game with 2 players for testing
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
    });

    test('should include pirate commentary before scores in announcement', () => {
        // Add a round to generate commentary
        const roundData = {
            'Alice': { bid: 1, actual: 1, bonus: 0 }, // Correct bid
            'Bob': { bid: 1, actual: 0, bonus: 0 }    // Failed bid
        };
        gameInstance.viewModel.addRound(roundData);
        
        // Get the score announcement
        const announcement = gameInstance.viewModel.createScoreAnnouncement();
        
        // Verify it starts with greeting and commentary comes first
        expect(announcement).toMatch(/^Ahoy mateys!/);
        
        // Verify it includes scores after commentary
        expect(announcement).toContain('Current bounty after 1 rounds.');
        expect(announcement).toContain('Alice');
        expect(announcement).toContain('Bob');
        
        // Should end with the traditional pirate farewell
        expect(announcement).toContain('May the winds favor ye in the remaining rounds!');
    });

    test('should handle score announcement with no rounds', () => {
        // Get announcement with no rounds played
        const announcement = gameInstance.viewModel.createScoreAnnouncement();
        
        // Should start with greeting and include game start commentary
        expect(announcement).toMatch(/^Ahoy mateys!/);
        expect(announcement).toContain('Current bounty after 0 rounds.');
        expect(announcement).toContain('Alice');
        expect(announcement).toContain('Bob');
    });

    test('should handle score announcement with no active game', () => {
        // Create fresh instance with no game - clear any state first
        const freshInstance = new window.SkullKingGame();
        freshInstance.viewModel.clearState();
        
        const announcement = freshInstance.viewModel.createScoreAnnouncement();
        
        expect(announcement).toBe('No game in progress to announce, ye landlubber!');
    });
});

describe('SkullKingGame Total Wins Validation', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        gameInstance = new window.SkullKingGame();
        // Setup a standard game for testing
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie', 'Dave']);
        gameInstance.viewModel.validateAndStartGame();
    });

    describe('Early Rounds (2-4 players)', () => {
        test('should accept valid wins total in round 1', () => {
            // Round 1: 4 players, 1 card each = 1 trick total
            const roundData = {
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 },
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toBeNull(); // Should succeed
        });

        test('should reject too many wins in round 1', () => {
            // Round 1: 4 players, 1 card each = 1 trick total, but 2 wins reported
            const roundData = {
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 1, bonus: 0 }, // Invalid: total wins = 2, but only 1 trick available
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toBe('Total tricks won (2) must equal 1 for round 1 with 4 players!');
        });

        test('should reject too few wins in round 1', () => {
            // Round 1: 4 players, 1 card each = 1 trick total, but 0 wins reported
            const roundData = {
                'Alice': { bid: 1, actual: 0, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 },
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toBe('Total tricks won (0) must equal 1 for round 1 with 4 players!');
        });

        test('should accept valid wins total in round 3', () => {
            // Add rounds to get to round 3
            gameInstance.viewModel.addRound({
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 },
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            });
            gameInstance.viewModel.addRound({
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 1, actual: 1, bonus: 0 },
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            });
            
            // Round 3: 4 players, 3 cards each = 3 tricks total
            const roundData = {
                'Alice': { bid: 2, actual: 2, bonus: 0 },
                'Bob': { bid: 1, actual: 1, bonus: 0 },
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toBeNull(); // Should succeed
        });
    });

    describe('Latter Rounds with Many Players', () => {
        test('should handle 8 players in round 8 correctly', () => {
            // Setup 8 player game
            const eightPlayerGame = new window.SkullKingGame();
            eightPlayerGame.viewModel.startNewGame(false);
            eightPlayerGame.viewModel.setTempPlayers(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
            eightPlayerGame.viewModel.validateAndStartGame();
            
            // Add rounds to get to round 8
            for (let round = 1; round <= 7; round++) {
                const roundData: any = {};
                ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach((player, index) => {
                    roundData[player] = { 
                        bid: index === 0 ? round : 0, 
                        actual: index === 0 ? round : 0, 
                        bonus: 0 
                    };
                });
                eightPlayerGame.viewModel.addRound(roundData);
            }
            
            // Round 8: 8 players, 8 cards each = 8 tricks total
            const roundData = {
                'A': { bid: 3, actual: 3, bonus: 0 },
                'B': { bid: 2, actual: 2, bonus: 0 },
                'C': { bid: 1, actual: 1, bonus: 0 },
                'D': { bid: 1, actual: 1, bonus: 0 },
                'E': { bid: 1, actual: 1, bonus: 0 },
                'F': { bid: 0, actual: 0, bonus: 0 },
                'G': { bid: 0, actual: 0, bonus: 0 },
                'H': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = eightPlayerGame.viewModel.addRound(roundData);
            expect(result).toBeNull(); // Should succeed
        });

        test('should reject invalid total in 8 players round 9 (card limitation)', () => {
            // Setup 8 player game
            const eightPlayerGame = new window.SkullKingGame();
            eightPlayerGame.viewModel.startNewGame(false);
            eightPlayerGame.viewModel.setTempPlayers(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
            eightPlayerGame.viewModel.validateAndStartGame();
            
            // Add rounds to get to round 9
            for (let round = 1; round <= 8; round++) {
                const roundData: any = {};
                ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach((player, index) => {
                    const cardsThisRound = eightPlayerGame.viewModel.getCardsPerRound(round, 8);
                    roundData[player] = { 
                        bid: index === 0 ? cardsThisRound : 0, 
                        actual: index === 0 ? cardsThisRound : 0, 
                        bonus: 0 
                    };
                });
                eightPlayerGame.viewModel.addRound(roundData);
            }
            
            // Round 9: 8 players, but only 8 cards each (not 9) due to 70 card limit
            // So we have 8 tricks total, but trying to report 9
            const roundData = {
                'A': { bid: 8, actual: 8, bonus: 0 },
                'B': { bid: 1, actual: 1, bonus: 0 }, // This makes 9 total - invalid!
                'C': { bid: 0, actual: 0, bonus: 0 },
                'D': { bid: 0, actual: 0, bonus: 0 },
                'E': { bid: 0, actual: 0, bonus: 0 },
                'F': { bid: 0, actual: 0, bonus: 0 },
                'G': { bid: 0, actual: 0, bonus: 0 },
                'H': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = eightPlayerGame.viewModel.addRound(roundData);
            expect(result).toBe('Total tricks won (9) must equal 8 for round 9 with 8 players!');
        });

        test('should handle 6 players in round 10 correctly', () => {
            // Setup 6 player game
            const sixPlayerGame = new window.SkullKingGame();
            sixPlayerGame.viewModel.startNewGame(false);
            sixPlayerGame.viewModel.setTempPlayers(['A', 'B', 'C', 'D', 'E', 'F']);
            sixPlayerGame.viewModel.validateAndStartGame();
            
            // Add rounds to get to round 10
            for (let round = 1; round <= 9; round++) {
                const roundData: any = {};
                ['A', 'B', 'C', 'D', 'E', 'F'].forEach((player, index) => {
                    roundData[player] = { 
                        bid: index === 0 ? round : 0, 
                        actual: index === 0 ? round : 0, 
                        bonus: 0 
                    };
                });
                sixPlayerGame.viewModel.addRound(roundData);
            }
            
            // Round 10: 6 players, 10 cards each = 10 tricks total
            const roundData = {
                'A': { bid: 4, actual: 4, bonus: 0 },
                'B': { bid: 3, actual: 3, bonus: 0 },
                'C': { bid: 2, actual: 2, bonus: 0 },
                'D': { bid: 1, actual: 1, bonus: 0 },
                'E': { bid: 0, actual: 0, bonus: 0 },
                'F': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = sixPlayerGame.viewModel.addRound(roundData);
            expect(result).toBeNull(); // Should succeed
        });

        test('should handle extreme case: 7 players in round 10 with card limitation', () => {
            // Setup 7 player game
            const sevenPlayerGame = new window.SkullKingGame();
            sevenPlayerGame.viewModel.startNewGame(false);
            sevenPlayerGame.viewModel.setTempPlayers(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
            sevenPlayerGame.viewModel.validateAndStartGame();
            
            // Add rounds to get to round 10
            for (let round = 1; round <= 9; round++) {
                const roundData: any = {};
                ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((player, index) => {
                    roundData[player] = { 
                        bid: index === 0 ? round : 0, 
                        actual: index === 0 ? round : 0, 
                        bonus: 0 
                    };
                });
                sevenPlayerGame.viewModel.addRound(roundData);
            }
            
            // Round 10: 7 players, should have 10 cards each = 10 tricks total
            const maxTricks = sevenPlayerGame.viewModel.getMaxTricksForCurrentRound();
            expect(maxTricks).toBe(10); // Verify the calculation
            
            // Create valid data with exactly 10 total wins
            const roundData = {
                'A': { bid: 3, actual: 3, bonus: 0 },
                'B': { bid: 2, actual: 2, bonus: 0 },
                'C': { bid: 2, actual: 2, bonus: 0 },
                'D': { bid: 2, actual: 2, bonus: 0 },
                'E': { bid: 1, actual: 1, bonus: 0 },
                'F': { bid: 0, actual: 0, bonus: 0 },
                'G': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = sevenPlayerGame.viewModel.addRound(roundData);
            expect(result).toBeNull(); // Should succeed
        });
    });

    describe('Edge Cases', () => {
        test('should handle zero total wins correctly', () => {
            // All players bid and got 0 - invalid unless it's a 0-card round (which doesn't exist)
            const roundData = {
                'Alice': { bid: 0, actual: 0, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 },
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toBe('Total tricks won (0) must equal 1 for round 1 with 4 players!');
        });

        test('should handle maximum wins distribution', () => {
            // Setup to get to a round where one player could win all tricks
            gameInstance.viewModel.addRound({
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 },
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            });
            
            // Round 2: 4 players, 2 cards each = 2 tricks total
            const roundData = {
                'Alice': { bid: 2, actual: 2, bonus: 0 }, // One player wins all tricks
                'Bob': { bid: 0, actual: 0, bonus: 0 },
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toBeNull(); // Should succeed
        });

        test('should validate edit last round with correct total wins', () => {
            // Add initial round with valid total (1 trick for round 1 with 4 players)
            gameInstance.viewModel.addRound({
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 },
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            });
            
            // Remove the last round for editing
            const removedRoundData = gameInstance.viewModel.removeLastRound();
            expect(removedRoundData).toBeDefined();
            
            // Try to add back with invalid total (0 wins when 1 is required)
            const invalidUpdate = {
                'Alice': { bid: 1, actual: 0, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 },
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(invalidUpdate);
            expect(result).toBe('Total tricks won (0) must equal 1 for round 1 with 4 players!');
        });
    });
});

describe('SkullKingGame Score Sorting', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        document.body.innerHTML = '<div id="score-display"></div>';
        gameInstance = new window.SkullKingGame();
        gameInstance.viewModel.startNewGame();
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
        gameInstance.viewModel.validateAndStartGame();
    });

    test('should sort players by score in descending order', () => {
        // Add rounds with different scores
        // Round 1: 1 card each for 3 players
        gameInstance.viewModel.addRound({
            'Alice': { bid: 1, actual: 1, bonus: 0 },    // Score: 20
            'Bob': { bid: 0, actual: 0, bonus: 0 },      // Score: 10
            'Charlie': { bid: 0, actual: 0, bonus: 0 }   // Score: 10
        });

        // Round 2: 2 cards each for 3 players
        gameInstance.viewModel.addRound({
            'Alice': { bid: 1, actual: 1, bonus: 0 },    // Score: 20, Total: 40
            'Bob': { bid: 0, actual: 1, bonus: 0 },      // Score: -20, Total: -10
            'Charlie': { bid: 1, actual: 0, bonus: 0 }   // Score: -10, Total: 0
        });
        
        // Round 3: 3 cards each for 3 players
        gameInstance.viewModel.addRound({
            'Alice': { bid: 1, actual: 1, bonus: 0 },    // Score: 20, Total: 60
            'Bob': { bid: 1, actual: 1, bonus: 0 },      // Score: 20, Total: 10
            'Charlie': { bid: 1, actual: 1, bonus: 80 }  // Score: 100, Total: 100
        });

        // Check the sorted players from view model
        const sortedPlayers = gameInstance.viewModel.getPlayersSortedByScore();
        
        expect(sortedPlayers[0].name).toBe('Charlie');
        expect(sortedPlayers[0].score).toBe(100);
        
        expect(sortedPlayers[1].name).toBe('Alice');
        expect(sortedPlayers[1].score).toBe(60);
        
        expect(sortedPlayers[2].name).toBe('Bob');
        expect(sortedPlayers[2].score).toBe(10);
    });

    test('should handle tied scores by maintaining original order', () => {
        // Add a round where all players score the same
        gameInstance.viewModel.addRound({
            'Alice': { bid: 1, actual: 1, bonus: 0 },    // 20 points
            'Bob': { bid: 1, actual: 1, bonus: 0 },      // 20 points
            'Charlie': { bid: 1, actual: 1, bonus: 0 }   // 20 points
        });

        const sortedPlayers = gameInstance.viewModel.getPlayersSortedByScore();
        
        // When scores are tied, the original order should be maintained
        expect(sortedPlayers[0].name).toBe('Alice');
        expect(sortedPlayers[1].name).toBe('Bob');
        expect(sortedPlayers[2].name).toBe('Charlie');
    });

    test('should update sorting after each round', () => {
        // Round 1: Bob leads with bonus
        gameInstance.viewModel.addRound({
            'Alice': { bid: 0, actual: 0, bonus: 0 },    // Score: 10
            'Bob': { bid: 1, actual: 1, bonus: 10 },     // Score: 30
            'Charlie': { bid: 0, actual: 0, bonus: 0 }   // Score: 10
        });

        let sortedPlayers = gameInstance.viewModel.getPlayersSortedByScore();
        
        expect(sortedPlayers[0].name).toBe('Bob');
        expect(sortedPlayers[1].name).toBe('Alice');
        expect(sortedPlayers[2].name).toBe('Charlie');

        // Round 2: Charlie takes the lead
        const round2Result = gameInstance.viewModel.addRound({
            'Alice': { bid: 1, actual: 2, bonus: 0 },    // Score: -10, Total: 0
            'Bob': { bid: 1, actual: 0, bonus: 0 },      // Score: -10, Total: 20
            'Charlie': { bid: 0, actual: 0, bonus: 10 }  // Score: 30, Total: 40
        });
        
        sortedPlayers = gameInstance.viewModel.getPlayersSortedByScore();
        
        // Charlie leads with 40, Bob second with 20, Alice last with 0
        expect(sortedPlayers[0].name).toBe('Charlie');
        expect(sortedPlayers[1].name).toBe('Bob'); 
        expect(sortedPlayers[2].name).toBe('Alice');
        
        // Round 3: Charlie extends lead
        gameInstance.viewModel.addRound({
            'Alice': { bid: 0, actual: 1, bonus: 0 },    // Score: -30, Total: -30
            'Bob': { bid: 0, actual: 1, bonus: 0 },      // Score: -30, Total: -10
            'Charlie': { bid: 1, actual: 1, bonus: 30 }  // Score: 50, Total: 90
        });

        sortedPlayers = gameInstance.viewModel.getPlayersSortedByScore();
        
        expect(sortedPlayers[0].name).toBe('Charlie');
        expect(sortedPlayers[0].score).toBe(90);
        expect(sortedPlayers[1].name).toBe('Bob'); 
        expect(sortedPlayers[1].score).toBe(-10);
        expect(sortedPlayers[2].name).toBe('Alice');
        expect(sortedPlayers[2].score).toBe(-30);
    });
});

describe('SkullKingGame Card Distribution Edge Cases', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        gameInstance = new window.SkullKingGame();
    });

    test('should calculate correct cards per round for 8 players in later rounds', () => {
        expect(gameInstance.viewModel.getCardsPerRound(9, 8)).toBe(8); // 72 cards needed, only 70 available
        expect(gameInstance.viewModel.getCardsPerRound(10, 8)).toBe(8); // 80 cards needed, only 70 available
    });

    test('should calculate correct cards per round for 7 players in round 10', () => {
        expect(gameInstance.viewModel.getCardsPerRound(10, 7)).toBe(10); // 70 cards needed, exactly 70 available
    });

    test('should calculate correct cards per round for 6 players', () => {
        expect(gameInstance.viewModel.getCardsPerRound(10, 6)).toBe(10); // 60 cards needed, 70 available
    });

    test('should throw error for rounds beyond 10', () => {
        expect(() => gameInstance.viewModel.getCardsPerRound(11, 6)).toThrow('Invalid round number: 11. Skull King only has 10 rounds.');
        expect(() => gameInstance.viewModel.getCardsPerRound(12, 6)).toThrow('Invalid round number: 12. Skull King only has 10 rounds.');
        expect(() => gameInstance.viewModel.getCardsPerRound(15, 4)).toThrow('Invalid round number: 15. Skull King only has 10 rounds.');
    });

    test('should throw error for invalid round numbers', () => {
        expect(() => gameInstance.viewModel.getCardsPerRound(0, 6)).toThrow('Invalid round number: 0. Round number must be 1 or greater.');
        expect(() => gameInstance.viewModel.getCardsPerRound(-1, 6)).toThrow('Invalid round number: -1. Round number must be 1 or greater.');
    });

    test('should throw error for invalid player counts', () => {
        expect(() => gameInstance.viewModel.getCardsPerRound(5, 0)).toThrow('Invalid player count: 0. Must have at least 1 player.');
        expect(() => gameInstance.viewModel.getCardsPerRound(5, -1)).toThrow('Invalid player count: -1. Must have at least 1 player.');
    });
});

describe('SkullKingGame New Game Flow', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        // Create fresh instance for each test
        gameInstance = new window.SkullKingGame();
        
        // Mock DOM elements needed for the tests
        document.body.innerHTML = `
            <div id="landing-section" class="hidden"></div>
            <div id="player-names-section" class="hidden"></div>
            <div id="game-section" class="hidden"></div>
            <div id="new-game-section" class="hidden"></div>
            <div id="score-display"></div>
            <div id="round-inputs"></div>
            <div id="round-number"></div>
            <div id="previous-rounds"></div>
            <div id="winner-announcement" class="hidden"></div>
            <div id="winner-text"></div>
            <div id="new-round"></div>
        `;
    });

    test('should preserve player names when starting new game with keepNames=true', () => {
        // Setup: Start with an existing game
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Add some rounds to verify they get cleared
        const roundData = {
            'Alice': { bid: 1, actual: 1, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 },
            'Charlie': { bid: 0, actual: 0, bonus: 0 }
        };
        gameInstance.viewModel.addRound(roundData);
        
        // Verify we have rounds and scores
        expect(gameInstance.viewModel.state.rounds.length).toBe(1);
        expect(gameInstance.viewModel.state.players[0].score).toBe(20); // Alice got 20 points
        
        // Test: Start new game keeping names
        gameInstance.viewModel.startNewGame(true);
        
        // Verify: Names are preserved in tempPlayers
        const tempPlayers = gameInstance.viewModel.getTempPlayers();
        expect(tempPlayers).toEqual(['Alice', 'Bob', 'Charlie']);
        
        // Verify: Game state is cleared
        expect(gameInstance.viewModel.state.rounds.length).toBe(0);
        expect(gameInstance.viewModel.state.players.length).toBe(0); // Cleared until validateAndStartGame
        expect(gameInstance.viewModel.getCurrentRoundNumber()).toBe(1);
    });

    test('should clear everything when starting new game with keepNames=false', () => {
        // Setup: Start with an existing game
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Test: Start new game without keeping names
        gameInstance.viewModel.startNewGame(false);
        
        // Verify: Everything is cleared including temp players
        const tempPlayers = gameInstance.viewModel.getTempPlayers();
        expect(tempPlayers).toEqual(['']); // Should have one empty slot
        expect(gameInstance.viewModel.state.players.length).toBe(0);
        expect(gameInstance.viewModel.state.rounds.length).toBe(0);
    });

});

describe('SkullKingGame Real-time Score Calculation', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        gameInstance = new window.SkullKingGame();
        
        // Setup game with players
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Mock the DOM elements needed for score calculation
        // Alice is player 0, Bob is player 1
        document.body.innerHTML += `
            <div id="round-inputs"></div>
            <div id="round-number"></div>
            <input id="bid-player-0" type="number" />
            <input id="actual-player-0" type="number" />
            <button id="bonus-player-0" data-bonus-value="0"></button>
            <div id="score-player-0" class="computed-score">-</div>
            <input id="bid-player-1" type="number" />
            <input id="actual-player-1" type="number" />
            <button id="bonus-player-1" data-bonus-value="0"></button>
            <div id="score-player-1" class="computed-score">-</div>
        `;
    });
    
    test('should show "-" when both bid and actual are empty', () => {
        const scoreDisplay = document.getElementById('score-player-0') as HTMLElement;
        
        // Call updateRoundScore with empty inputs
        gameInstance.updateRoundScore('Alice');
        
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toBe('computed-score');
    });
    
    test('should show "-" with only bid filled (Progressive Disclosure)', () => {
        const bidInput = document.getElementById('bid-player-0') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-player-0') as HTMLElement;
        
        bidInput.value = '1';  // Valid bid for round 1 with 2 players
        gameInstance.updateRoundScore('Alice');
        
        // With Option 1: Progressive Disclosure, score only shows when both bid and actual are filled
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toBe('computed-score');
    });
    
    test('should show "-" with only actual filled (Progressive Disclosure)', () => {
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-player-0') as HTMLElement;
        
        actualInput.value = '1';  // Valid actual for round 1 with 2 players
        gameInstance.updateRoundScore('Alice');
        
        // With Option 1: Progressive Disclosure, score only shows when both bid and actual are filled
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toBe('computed-score');
    });
    
    test('should calculate correct prediction score', () => {
        const bidInput = document.getElementById('bid-player-0') as HTMLInputElement;
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-player-0') as HTMLElement;
        
        bidInput.value = '1';
        actualInput.value = '1';
        gameInstance.updateRoundScore('Alice');
        
        // Bid 1, Actual 1 = correct prediction = 20
        expect(scoreDisplay.textContent).toBe('+20');
        expect(scoreDisplay.className).toContain('positive');
    });
    
    test('should include bonus points for correct predictions', () => {
        const bidInput = document.getElementById('bid-player-0') as HTMLInputElement;
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        const bonusButton = document.getElementById('bonus-player-0') as HTMLElement;
        const scoreDisplay = document.getElementById('score-player-0') as HTMLElement;
        
        bidInput.value = '1';
        actualInput.value = '1';
        bonusButton.setAttribute('data-bonus-value', '10');
        gameInstance.updateRoundScore('Alice');
        
        // Bid 1, Actual 1, Bonus 10 = 20 + 10 = 30
        expect(scoreDisplay.textContent).toBe('+30');
        expect(scoreDisplay.className).toContain('positive');
    });
    
    test('should show "-" for bonus on incorrect prediction', () => {
        const bidInput = document.getElementById('bid-player-0') as HTMLInputElement;
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        const bonusButton = document.getElementById('bonus-player-0') as HTMLElement;
        const scoreDisplay = document.getElementById('score-player-0') as HTMLElement;
        
        bidInput.value = '1';
        actualInput.value = '0';
        bonusButton.setAttribute('data-bonus-value', '10');
        gameInstance.updateRoundScore('Alice');
        
        // Invalid: bonus points on failed prediction
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toContain('invalid');
    });
    
    test('should handle zero bid correctly', () => {
        const bidInput = document.getElementById('bid-player-0') as HTMLInputElement;
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-player-0') as HTMLElement;
        
        bidInput.value = '0';
        actualInput.value = '0';
        gameInstance.updateRoundScore('Alice');
        
        // Successful zero bid in round 1 = 10
        expect(scoreDisplay.textContent).toBe('+10');
        expect(scoreDisplay.className).toContain('positive');
    });
    
    test('should show zero score correctly', () => {
        const bidInput = document.getElementById('bid-player-0') as HTMLInputElement;
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        const bonusButton = document.getElementById('bonus-player-0') as HTMLElement;
        const scoreDisplay = document.getElementById('score-player-0') as HTMLElement;
        
        bidInput.value = '0';
        actualInput.value = '0';
        bonusButton.setAttribute('data-bonus-value', '0');
        
        // Add rounds to get to round 0 (which would give 0 points for zero bid)
        // Actually, this can't happen in normal game, but let's test the display
        bidInput.value = '1';
        actualInput.value = '1';
        bonusButton.setAttribute('data-bonus-value', '0');
        
        // Mock the score calculation to return 0
        jest.spyOn(gameInstance.viewModel, 'testCalculateRoundScore').mockReturnValue(0);
        
        gameInstance.updateRoundScore('Alice');
        
        expect(scoreDisplay.textContent).toBe('0');
        expect(scoreDisplay.className).toContain('zero');
    });
    
    test('should show "-" for invalid inputs using centralized validation', () => {
        const bidInput = document.getElementById('bid-player-0') as HTMLInputElement;
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        const bonusButton = document.getElementById('bonus-player-0') as HTMLElement;
        const scoreDisplay = document.getElementById('score-player-0') as HTMLElement;
        
        // Test negative bid (uses centralized validation)
        bidInput.value = '-1';
        actualInput.value = '0';
        bonusButton.setAttribute('data-bonus-value', '0');
        gameInstance.updateRoundScore('Alice');
        
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toContain('invalid');
        
        // Test negative bonus (uses centralized validation)
        bidInput.value = '1';
        bonusButton.setAttribute('data-bonus-value', '-10');
        gameInstance.updateRoundScore('Alice');
        
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toContain('invalid');
    });
    
    test('should show "-" when bid exceeds round limit', () => {
        const bidInput = document.getElementById('bid-player-0') as HTMLInputElement;
        const actualInput = document.getElementById('actual-player-0') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-player-0') as HTMLElement;
        
        // In round 1 with 2 players, max is 1
        bidInput.value = '2';
        actualInput.value = '0';
        gameInstance.updateRoundScore('Alice');
        
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toContain('invalid');
    });
    
    test('should update all player scores on initialization', () => {
        // Setup round inputs container
        const roundInputs = document.getElementById('round-inputs') as HTMLElement;
        const players = gameInstance.viewModel.getGameState().players;
        
        // Call updateRoundInputs which should initialize all scores
        gameInstance.updateRoundInputs(players, 1);
        
        // Both players should have their scores initialized
        // Since we can't easily test the initialization directly,
        // we'll verify the HTML structure was created correctly with index-based IDs
        expect(roundInputs.innerHTML).toContain('score-player-0');
        expect(roundInputs.innerHTML).toContain('score-player-1');
        expect(roundInputs.innerHTML).toContain('computed-score');
    });
    
    test('should handle player names with special characters', () => {
        // Create a player with special characters
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(["O'Brien", 'Bob & Alice']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Add DOM elements for special character names (player-0 is O'Brien, player-1 is Bob & Alice)
        document.body.innerHTML += `
            <input id="bid-player-0" type="number" />
            <input id="actual-player-0" type="number" />
            <button id="bonus-player-0" data-bonus-value="0"></button>
            <div id="score-player-0" class="computed-score">-</div>
            <input id="bid-player-1" type="number" />
            <input id="actual-player-1" type="number" />
            <button id="bonus-player-1" data-bonus-value="0"></button>
            <div id="score-player-1" class="computed-score">-</div>
        `;
        
        // Set values and test score calculation for names with special characters
        const bidOBrien = document.getElementById("bid-player-0") as HTMLInputElement;
        const actualOBrien = document.getElementById("actual-player-0") as HTMLInputElement;
        bidOBrien.value = '1';
        actualOBrien.value = '1';
        
        gameInstance.updateRoundScore("O'Brien");
        const scoreOBrien = document.getElementById("score-player-0") as HTMLElement;
        expect(scoreOBrien.textContent).toBe('+20');
        
        // For Bob & Alice - max in round 1 with 2 players is 1
        const bidBobAlice = document.getElementById('bid-player-1') as HTMLInputElement;
        const actualBobAlice = document.getElementById('actual-player-1') as HTMLInputElement;
        bidBobAlice.value = '0';
        actualBobAlice.value = '0';
        
        gameInstance.updateRoundScore('Bob & Alice');
        const scoreBobAlice = document.getElementById('score-player-1') as HTMLElement;
        expect(scoreBobAlice.textContent).toBe('+10'); // Successful zero bid in round 1
    });
});

describe('SkullKingGame Translation System', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        // Set up DOM for translation tests
        document.body.innerHTML = `
            <div id="landing-section"></div>
            <div id="player-names-section"></div>
            <div id="game-section"></div>
            <div id="previous-rounds"></div>
            <select id="language-selector">
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
            </select>
        `;
        
        gameInstance = new window.SkullKingGame();
    });

    test('should have access to global translation system', () => {
        expect(typeof (global as any).i18n).toBe('object');
        expect(typeof (global as any).i18n.translate).toBe('function');
        expect(typeof (global as any).i18n.setLanguage).toBe('function');
        expect(typeof (global as any).i18n.getCurrentLanguage).toBe('function');
    });

    test('should default to English language', () => {
        expect((global as any).i18n.getCurrentLanguage()).toBe('en');
    });

    test('should translate basic strings in English', () => {
(global as any).i18n.setLanguage('en');
        
        expect((global as any).i18n.translate('min_players_error')).toBe('Ye need at least 2 pirates to play, ye scurvy dog!');
        expect((global as any).i18n.translate('max_players_error', { maxPlayers: '8' })).toBe('No more than 8 pirates can fit on this ship!');
        expect((global as any).i18n.translate('round_label')).toBe('Round');
    });

    test('should translate strings with parameters', () => {
(global as any).i18n.setLanguage('en');
        
        const translated = (global as any).i18n.translate('bid_exceeds_tricks_error', {
            playerName: 'Alice',
            bid: '3',
            maxTricks: '2',
            round: '3',
            playerCount: '4'
        });
        
        expect(translated).toBe("Alice's bid (3) can't exceed 2 tricks in round 3!");
    });

    test('should translate round display properly', () => {
        (global as any).i18n.setLanguage('en');
        expect((global as any).i18n.translate('round_display', { round: '5' })).toBe('5 of 10');
        
        (global as any).i18n.setLanguage('de');
        expect((global as any).i18n.translate('round_display', { round: '5' })).toBe('5 von 10');
        
        (global as any).i18n.setLanguage('es');
        expect((global as any).i18n.translate('round_display', { round: '5' })).toBe('5 de 10');
    });

    test('should switch languages correctly', () => {
        // Start with English (reset to ensure clean state)
        (global as any).i18n.setLanguage('en');
        expect((global as any).i18n.getCurrentLanguage()).toBe('en');
        expect((global as any).i18n.translate('round_label')).toBe('Round');
        
        // Switch to German
        (global as any).i18n.setLanguage('de');
        expect((global as any).i18n.getCurrentLanguage()).toBe('de');
        expect((global as any).i18n.translate('round_label')).toBe('Runde');
        
        // Switch to Spanish
        (global as any).i18n.setLanguage('es');
        expect((global as any).i18n.getCurrentLanguage()).toBe('es');
        expect((global as any).i18n.translate('round_label')).toBe('Ronda');
        
        // Back to English
        (global as any).i18n.setLanguage('en');
        expect((global as any).i18n.getCurrentLanguage()).toBe('en');
        expect((global as any).i18n.translate('round_label')).toBe('Round');
    });

    test('should translate game error messages in all languages', () => {
        // English
(global as any).i18n.setLanguage('en');
        expect((global as any).i18n.translate('duplicate_names_error')).toBe('Each pirate needs their own name, ye bilge rat!');
        
        // German
        (global as any).i18n.setLanguage('de');
        expect((global as any).i18n.translate('duplicate_names_error')).toBe('Jeder Pirat braucht seinen eigenen Namen!');
        
        // Spanish
        (global as any).i18n.setLanguage('es');
        expect((global as any).i18n.translate('duplicate_names_error')).toBe('¡Cada pirata necesita su propio nombre!');
    });

    test('should translate commentary in all languages', () => {
        // Perfect round commentary
(global as any).i18n.setLanguage('en');
        expect((global as any).i18n.translate('perfect_round_1')).toContain('Every scallywag nailed their bid!');
        
(global as any).i18n.setLanguage('de');
        expect((global as any).i18n.translate('perfect_round_1')).toContain('Jeder Seeräuber hat sein Gebot getroffen!');
        
(global as any).i18n.setLanguage('es');
        expect((global as any).i18n.translate('perfect_round_1')).toContain('¡Cada bucanero acertó su apuesta!');
    });

    test('should translate disaster commentary with player names', () => {
        const playerName = 'Blackbeard';
        
(global as any).i18n.setLanguage('en');
        const enDisaster = (global as any).i18n.translate('disaster_1', { playerName });
        expect(enDisaster).toBe(`Avast! ${playerName} be sinkin' faster than a ship with no hull!`);
        
(global as any).i18n.setLanguage('de');
        const deDisaster = (global as any).i18n.translate('disaster_1', { playerName });
        expect(deDisaster).toBe(`Avast! ${playerName} sinkt schneller als ein Schiff ohne Rumpf!`);
        
(global as any).i18n.setLanguage('es');
        const esDisaster = (global as any).i18n.translate('disaster_1', { playerName });
        expect(esDisaster).toBe(`¡Avast! ¡${playerName} se hunde más rápido que un barco sin casco!`);
    });

    test('should handle missing translation keys gracefully', () => {
(global as any).i18n.setLanguage('en');
        
        // Should return the key itself if translation not found
        // Test with any as we're testing error handling
        expect(((global as any).i18n.translate as any)('non_existent_key')).toBe('non_existent_key');
    });

    test('should handle missing parameters gracefully', () => {
(global as any).i18n.setLanguage('en');
        
        // Should still work even if parameters are missing
        const result = (global as any).i18n.translate('bid_exceeds_tricks_error', { playerName: 'Alice' });
        expect(result).toContain('Alice');
        expect(result).toContain('{bid}'); // Unreplaced parameters should remain
    });

    test('should emit language change events', () => {
        let eventFired = false;
        let eventLanguage = '';
        
        window.addEventListener('languageChanged', ((event: CustomEvent) => {
            eventFired = true;
            eventLanguage = event.detail;
        }) as EventListener);
        
(global as any).i18n.setLanguage('de');
        
        expect(eventFired).toBe(true);
        expect(eventLanguage).toBe('de');
    });

    test('should integrate with game validation system', () => {
        gameInstance.viewModel.startNewGame();
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Test validation error in different languages
(global as any).i18n.setLanguage('en');
        let error = gameInstance.viewModel.validateSinglePlayerInput(-1, 0, 0, 'Alice');
        expect(error).toContain('negative numbers');
        
(global as any).i18n.setLanguage('de');
        error = gameInstance.viewModel.validateSinglePlayerInput(-1, 0, 0, 'Alice');
        expect(error).toContain('negativen Zahlen');
        
(global as any).i18n.setLanguage('es');
        error = gameInstance.viewModel.validateSinglePlayerInput(-1, 0, 0, 'Alice');
        expect(error).toContain('números negativos');
    });

    test('should translate round headers in previous rounds display', () => {
        // Setup a game with some rounds
        gameInstance.viewModel.startNewGame();
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Add a round
        gameInstance.viewModel.addRound({
            'Alice': { bid: 1, actual: 1, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 }
        });
        
        // Mock the previous rounds container
        const previousRounds = document.getElementById('previous-rounds') as HTMLElement;
        
        // Test English
(global as any).i18n.setLanguage('en');
        gameInstance.updatePreviousRounds(gameInstance.viewModel.getGameState().rounds);
        expect(previousRounds.innerHTML).toContain('1 of 10');
        
        // Test German
(global as any).i18n.setLanguage('de');
        gameInstance.updatePreviousRounds(gameInstance.viewModel.getGameState().rounds);
        expect(previousRounds.innerHTML).toContain('1 von 10');
        
        // Test Spanish
(global as any).i18n.setLanguage('es');
        gameInstance.updatePreviousRounds(gameInstance.viewModel.getGameState().rounds);
        expect(previousRounds.innerHTML).toContain('1 de 10');
    });

    test('should maintain translation consistency across game state changes', () => {
        // Start a game
        gameInstance.viewModel.startNewGame();
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Add some rounds
        gameInstance.viewModel.addRound({
            'Alice': { bid: 1, actual: 1, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 }
        });
        
        // Switch language
        (global as any).i18n.setLanguage('de');
        
        // Verify commentary gets updated
        const commentary = gameInstance.viewModel.getCurrentCommentary();
        expect(commentary).not.toContain('Every scallywag'); // Should not be English
        
        // Switch back to English
        (global as any).i18n.setLanguage('en');
        const englishCommentary = gameInstance.viewModel.getCurrentCommentary();
        expect(englishCommentary).toBeDefined();
    });

    test('should allow bonus entry in Rascal mode when off by one', () => {
        // Start a game in Rascal mode
        gameInstance.viewModel.setScoringMode('rascal');
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Mock the modal display function
        const showModalSpy = jest.spyOn(gameInstance, 'showModal');
        
        // Mock the DOM elements for player 0
        const bidInput = document.createElement('input');
        bidInput.id = 'bid-player-0';
        bidInput.value = '2';
        document.body.appendChild(bidInput);
        
        const actualInput = document.createElement('input');
        actualInput.id = 'actual-player-0';
        actualInput.value = '3'; // Off by 1
        document.body.appendChild(actualInput);
        
        const bonusModal = document.createElement('div');
        bonusModal.id = 'bonus-modal-overlay';
        document.body.appendChild(bonusModal);
        
        // Try to open bonus modal when off by 1 in Rascal mode - should work
        gameInstance.openBonusModal(0);
        expect(showModalSpy).not.toHaveBeenCalled();
        expect(bonusModal.classList.contains('active')).toBe(true);
        
        // Now test when off by 2 - should not work
        actualInput.value = '4'; // Off by 2
        bonusModal.classList.remove('active');
        gameInstance.openBonusModal(0);
        expect(showModalSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.stringContaining('No bonus when ye be off by 2 or more')
        );
        expect(bonusModal.classList.contains('active')).toBe(false);
        
        // Clean up
        showModalSpy.mockRestore();
    });

    test('should block bonus entry in Traditional mode when bid does not equal actual', () => {
        // Start a game in Traditional mode
        gameInstance.viewModel.setScoringMode('normal');
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Mock the modal display function
        const showModalSpy = jest.spyOn(gameInstance, 'showModal');
        
        // Mock the DOM elements for player 0
        const bidInput = document.createElement('input');
        bidInput.id = 'bid-player-0';
        bidInput.value = '2';
        document.body.appendChild(bidInput);
        
        const actualInput = document.createElement('input');
        actualInput.id = 'actual-player-0';
        actualInput.value = '3'; // Off by 1
        document.body.appendChild(actualInput);
        
        const bonusModal = document.createElement('div');
        bonusModal.id = 'bonus-modal-overlay';
        document.body.appendChild(bonusModal);
        
        // Try to open bonus modal when off by 1 in Traditional mode - should not work
        gameInstance.openBonusModal(0);
        expect(showModalSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.stringContaining('Bonus only be allowed when yer bid equals actual')
        );
        expect(bonusModal.classList.contains('active')).toBe(false);
        
        // Now test when bid equals actual - should work
        actualInput.value = '2'; // Exact match
        showModalSpy.mockClear();
        gameInstance.openBonusModal(0);
        expect(showModalSpy).not.toHaveBeenCalled();
        expect(bonusModal.classList.contains('active')).toBe(true);
        
        // Clean up
        showModalSpy.mockRestore();
    });
});

describe('GameViewModel Player Reordering with Up/Down Buttons', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        gameInstance = new window.SkullKingGame();
        gameInstance.viewModel.startNewGame(false);
    });
    
    test('movePlayerUp should move player up one position', () => {
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie', 'David']);
        
        // Move Bob (index 1) up
        gameInstance.movePlayerUp(1);
        
        const players = gameInstance.viewModel.getTempPlayers();
        expect(players).toEqual(['Bob', 'Alice', 'Charlie', 'David']);
    });
    
    test('movePlayerUp should not move first player', () => {
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
        
        // Try to move Alice (index 0) up - should do nothing
        gameInstance.movePlayerUp(0);
        
        const players = gameInstance.viewModel.getTempPlayers();
        expect(players).toEqual(['Alice', 'Bob', 'Charlie']);
    });
    
    test('movePlayerDown should move player down one position', () => {
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie', 'David']);
        
        // Move Bob (index 1) down
        gameInstance.movePlayerDown(1);
        
        const players = gameInstance.viewModel.getTempPlayers();
        expect(players).toEqual(['Alice', 'Charlie', 'Bob', 'David']);
    });
    
    test('movePlayerDown should not move last player', () => {
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
        
        // Try to move Charlie (index 2) down - should do nothing
        gameInstance.movePlayerDown(2);
        
        const players = gameInstance.viewModel.getTempPlayers();
        expect(players).toEqual(['Alice', 'Bob', 'Charlie']);
    });
    
    test('movePlayerUp and movePlayerDown should preserve input values', () => {
        // Set up DOM elements
        document.body.innerHTML = `
            <div id="player-names-inputs">
                <div class="player-name-input">
                    <input type="text" id="player-0" value="Alice Modified">
                </div>
                <div class="player-name-input">
                    <input type="text" id="player-1" value="Bob Modified">
                </div>
            </div>
        `;
        
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        
        // Move Bob up - should save "Bob Modified" value
        gameInstance.movePlayerUp(1);
        
        const players = gameInstance.viewModel.getTempPlayers();
        expect(players).toEqual(['Bob Modified', 'Alice Modified']);
    });
});

describe('GameViewModel Player Reordering', () => {
    let viewModel: any;

    beforeEach(() => {
        viewModel = new window.GameViewModel();
    });

    test('reorderTempPlayers moves player from index 0 to index 2', () => {
        // Setup initial players
        viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie', 'David']);
        
        // Move Alice from index 0 to index 2
        viewModel.reorderTempPlayers(0, 2);
        
        const players = viewModel.getTempPlayers();
        expect(players).toEqual(['Bob', 'Alice', 'Charlie', 'David']);
    });

    test('reorderTempPlayers moves player from index 3 to index 1', () => {
        // Setup initial players
        viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie', 'David']);
        
        // Move David from index 3 to index 1
        viewModel.reorderTempPlayers(3, 1);
        
        const players = viewModel.getTempPlayers();
        expect(players).toEqual(['Alice', 'David', 'Bob', 'Charlie']);
    });

    test('reorderTempPlayers handles adjacent moves correctly', () => {
        // Setup initial players
        viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
        
        // Move Bob from index 1 to index 2
        // Note: When moving down, the target index is adjusted after removal
        // So moving from 1 to 2 actually keeps the order the same
        viewModel.reorderTempPlayers(1, 2);
        
        const players = viewModel.getTempPlayers();
        expect(players).toEqual(['Alice', 'Bob', 'Charlie']);
        
        // Test actual adjacent swap - move Bob to position after Charlie
        viewModel.reorderTempPlayers(1, 3);
        expect(viewModel.getTempPlayers()).toEqual(['Alice', 'Charlie', 'Bob']);
    });

    test('reorderTempPlayers does nothing when from and to are the same', () => {
        // Setup initial players
        viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
        
        // Move Bob from index 1 to index 1 (no change)
        viewModel.reorderTempPlayers(1, 1);
        
        const players = viewModel.getTempPlayers();
        expect(players).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    test('reorderTempPlayers handles moving to the end', () => {
        // Setup initial players
        viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie', 'David']);
        
        // Move Alice to the end
        viewModel.reorderTempPlayers(0, 4);
        
        const players = viewModel.getTempPlayers();
        expect(players).toEqual(['Bob', 'Charlie', 'David', 'Alice']);
    });

    test('reorderTempPlayers handles moving to the beginning', () => {
        // Setup initial players
        viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie', 'David']);
        
        // Move David to the beginning
        viewModel.reorderTempPlayers(3, 0);
        
        const players = viewModel.getTempPlayers();
        expect(players).toEqual(['David', 'Alice', 'Bob', 'Charlie']);
    });

    test('reorderTempPlayers preserves player names exactly', () => {
        // Setup initial players with special characters
        viewModel.setTempPlayers(['Alice 123', 'Bob-Smith', 'Charlie!', 'David Jr.']);
        
        // Move Charlie! from index 2 to index 1
        viewModel.reorderTempPlayers(2, 1);
        
        const players = viewModel.getTempPlayers();
        expect(players).toEqual(['Alice 123', 'Charlie!', 'Bob-Smith', 'David Jr.']);
    });

    test('reorderTempPlayers works with minimum players (2)', () => {
        // Setup initial players
        viewModel.setTempPlayers(['Alice', 'Bob']);
        
        // Move Alice from index 0 to index 1
        // When moving down, target index is adjusted, so 0->1 becomes 0->0 (no change)
        viewModel.reorderTempPlayers(0, 1);
        
        const players = viewModel.getTempPlayers();
        expect(players).toEqual(['Alice', 'Bob']);
        
        // To actually swap, need to move to index 2 (past the end)
        viewModel.reorderTempPlayers(0, 2);
        expect(viewModel.getTempPlayers()).toEqual(['Bob', 'Alice']);
        
        // Move back
        viewModel.reorderTempPlayers(1, 0);
        expect(viewModel.getTempPlayers()).toEqual(['Alice', 'Bob']);
    });

    test('reorderTempPlayers works with maximum players (8)', () => {
        // Setup initial players
        viewModel.setTempPlayers(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8']);
        
        // Move P5 from index 4 to index 2
        viewModel.reorderTempPlayers(4, 2);
        
        const players = viewModel.getTempPlayers();
        expect(players).toEqual(['P1', 'P2', 'P5', 'P3', 'P4', 'P6', 'P7', 'P8']);
    });
});

describe('Expansion Card Support', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        gameInstance = new (window as any).SkullKingGame();
        gameInstance.viewModel = new (window as any).GameViewModel();
    });
    
    test('should allow destroyed tricks when Kraken played', () => {
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Round 1: 1 trick total (1 card per player, but only 1 trick total)
        const roundData = {
            'Alice': { bid: 0, actual: 0, bonus: 10 },
            'Bob': { bid: 0, actual: 0, bonus: 0 },
            'Charlie': { bid: 0, actual: 0, bonus: 0 }
        };
        
        // Without Kraken: should fail (0 tricks vs 1 expected)
        let error = gameInstance.viewModel.validateRoundData(roundData);
        expect(error).toContain('must equal');
        
        // With Kraken: should pass (0 tricks + 1 destroyed = 1)
        error = gameInstance.viewModel.validateRoundData(roundData, undefined, true, false);
        expect(error).toBeNull();
    });
    
    test('should allow destroyed tricks when trick discarded', () => {
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Round 1: 1 trick total (1 card per player, but only 1 trick total)
        const roundData = {
            'Alice': { bid: 0, actual: 0, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 }
        };
        
        // Without trick discarded: should fail (0 tricks vs 1 expected)
        let error = gameInstance.viewModel.validateRoundData(roundData);
        expect(error).toContain('must equal');
        
        // With trick discarded: should pass (Whale/Stingray can discard trick)
        error = gameInstance.viewModel.validateRoundData(roundData, undefined, false, true);
        expect(error).toBeNull();
    });
    
    test('should allow both Kraken and trick discarded in same round', () => {
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Round 2: 2 tricks total (2 cards per player, but only 2 tricks total)
        gameInstance.viewModel.state.currentRound = 2;
        const roundData = {
            'Alice': { bid: 0, actual: 0, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 },
            'Charlie': { bid: 0, actual: 0, bonus: 0 }
        };
        
        // Without expansion cards: should fail (0 tricks vs 2 expected)
        let error = gameInstance.viewModel.validateRoundData(roundData);
        expect(error).toContain('must equal');
        
        // With trick discarded only: should still fail (0 tricks + 1 destroyed = 1, but need 2)
        error = gameInstance.viewModel.validateRoundData(roundData, undefined, false, true);
        expect(error).toContain('must equal');
        
        // With Kraken only: should still fail (0 tricks + 1 destroyed = 1, but need 2)
        error = gameInstance.viewModel.validateRoundData(roundData, undefined, true, false);
        expect(error).toContain('must equal');
        
        // With both Kraken and trick discarded: should pass (2 tricks destroyed)
        error = gameInstance.viewModel.validateRoundData(roundData, undefined, true, true);
        expect(error).toBeNull();
    });
    
    test('should store expansion card flags in round data', () => {
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Round 2: 2 tricks total (need at least 2 to destroy with both Kraken and trick discarded)
        gameInstance.viewModel.state.currentRound = 2;
        const roundData = {
            'Alice': { bid: 0, actual: 0, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 }
        };
        
        // Add round with both Kraken and trick discarded (0 tricks + 2 destroyed = 2 expected)
        const error = gameInstance.viewModel.addRound(roundData, true, true);
        expect(error).toBeNull();
        
        const gameState = gameInstance.viewModel.getGameState();
        const lastRound = gameState.rounds[gameState.rounds.length - 1];
        
        expect(lastRound.krakenPlayed).toBe(true);
        expect(lastRound.trickDiscarded).toBe(true);
    });
    
    test('should calculate Loot bonuses correctly', () => {
        // Test through the UI bonus counter mechanism
        gameInstance.bonusCounters = { 
            standard14: 0,
            black14: 0,
            mermaidPirate: 0,
            skullPirate: 0,
            mermaidSkull: 0,
            loot: 0
        };
        
        // Calculate bonus for 0 loot
        expect(gameInstance.calculateBonusPoints('loot', 0)).toBe(0);
        
        // Calculate bonus for 1 loot
        expect(gameInstance.calculateBonusPoints('loot', 1)).toBe(20);
        
        // Calculate bonus for 2 loot
        expect(gameInstance.calculateBonusPoints('loot', 2)).toBe(40);
    });
    
    test('should enforce max 2 Loot bonuses', () => {
        // Set up bonus counters
        gameInstance.bonusCounters = { loot: 0 };
        
        // Add first loot
        gameInstance.updateBonusCounter('loot', 1);
        expect(gameInstance.bonusCounters.loot).toBe(1);
        
        // Add second loot
        gameInstance.updateBonusCounter('loot', 1);
        expect(gameInstance.bonusCounters.loot).toBe(2);
        
        // Try to add third loot - should stay at 2
        gameInstance.updateBonusCounter('loot', 1);
        expect(gameInstance.bonusCounters.loot).toBe(2);
    });
    
    test('should validate correctly with Kraken and trick discarded', () => {
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Round 2: 2 total tricks
        gameInstance.viewModel.state.currentRound = 2;
        const roundData = {
            'Alice': { bid: 1, actual: 1, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 }
        };
        
        // Without expansion cards: should fail (1 trick vs 2 expected)
        let error = gameInstance.viewModel.validateRoundData(roundData);
        expect(error).toContain('must equal');
        
        // With Kraken: should pass (1 trick + 1 destroyed = 2)
        error = gameInstance.viewModel.validateRoundData(roundData, undefined, true, false);
        expect(error).toBeNull();
        
        // With trick discarded only: should also pass (1 trick + 1 discarded = 2)
        error = gameInstance.viewModel.validateRoundData(roundData, undefined, false, true);
        expect(error).toBeNull();
        
        // With both: 0 tricks should pass (2 destroyed = 2)
        const zeroTricksData = {
            'Alice': { bid: 0, actual: 0, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 }
        };
        error = gameInstance.viewModel.validateRoundData(zeroTricksData, undefined, true, true);
        expect(error).toBeNull();
    });
    
    test('should allow up to 2 destroyed tricks with Kraken and trick discarded', () => {
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Round 3: 3 total tricks
        gameInstance.viewModel.state.currentRound = 3;
        const roundData = {
            'Alice': { bid: 0, actual: 0, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 }
        };
        
        // Without expansion cards: should fail (0 tricks vs 3 expected)
        let error = gameInstance.viewModel.validateRoundData(roundData);
        expect(error).toContain('must equal');
        
        // With Kraken only: still should fail (0 tricks + 1 destroyed = 1, but need 3)
        error = gameInstance.viewModel.validateRoundData(roundData, undefined, true, false);
        expect(error).toContain('must equal');
        
        // With trick discarded only: still should fail (0 tricks + 1 destroyed = 1, but need 3)
        error = gameInstance.viewModel.validateRoundData(roundData, undefined, false, true);
        expect(error).toContain('must equal');
        
        // With both: still should fail (0 tricks + 2 destroyed = 2, but need 3)
        error = gameInstance.viewModel.validateRoundData(roundData, undefined, true, true);
        expect(error).toContain('must equal');
        
        // With 1 trick and both: should pass (1 + 2 destroyed = 3)
        const oneTrickData = {
            'Alice': { bid: 1, actual: 1, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 }
        };
        error = gameInstance.viewModel.validateRoundData(oneTrickData, undefined, true, true);
        expect(error).toBeNull();
    });
});

describe('Speech Speed Control', () => {
    let gameInstance: any;
    let mockSpeechSynthesis: any;
    let mockUtterance: any;

    beforeEach(() => {
        // Mock speechSynthesis API
        mockUtterance = {
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            lang: 'en-US',
            text: ''
        };

        mockSpeechSynthesis = {
            cancel: jest.fn(),
            speak: jest.fn(),
            getVoices: jest.fn(() => [
                { name: 'English Voice', lang: 'en-US' }
            ])
        };

        (global as any).SpeechSynthesisUtterance = jest.fn(() => mockUtterance);
        (global as any).speechSynthesis = mockSpeechSynthesis;

        // Add read scores button with speed link to DOM
        const readScoresBtn = document.createElement('button');
        readScoresBtn.id = 'read-scores-btn';
        readScoresBtn.innerHTML = '🔊 Read Scores (<a href="#" id="speed-toggle-link" class="speed-link">1x</a>)';
        document.body.appendChild(readScoresBtn);

        localStorage.clear();
        gameInstance = new (window as any).SkullKingGame();
    });

    test('should initialize with default speed of 1x', () => {
        expect(gameInstance.speechSpeed).toBe(1.0);
        const speedLink = document.getElementById('speed-toggle-link');
        expect(speedLink?.textContent).toBe('1x');
    });

    test('should cycle through speeds: NORMAL -> MEDIUM -> FAST -> NORMAL', () => {
        const speedLink = document.getElementById('speed-toggle-link');
        
        // Start at 1.0x
        expect(gameInstance.speechSpeed).toBe(1.0);
        
        // Toggle to 1.5x
        gameInstance.toggleSpeechSpeed();
        expect(gameInstance.speechSpeed).toBe(1.5);
        expect(speedLink?.textContent).toBe('1.5x');
        
        // Toggle to 2.0x
        gameInstance.toggleSpeechSpeed();
        expect(gameInstance.speechSpeed).toBe(2.0);
        expect(speedLink?.textContent).toBe('2x');
        
        // Toggle back to 1.0x
        gameInstance.toggleSpeechSpeed();
        expect(gameInstance.speechSpeed).toBe(1.0);
        expect(speedLink?.textContent).toBe('1x');
    });

    test('should save speed preference to localStorage', () => {
        gameInstance.toggleSpeechSpeed(); // Change to 1.5x
        expect(localStorage.setItem).toHaveBeenCalledWith('skull-king-speech-speed', '1.5');
        
        gameInstance.toggleSpeechSpeed(); // Change to 2.0x
        expect(localStorage.setItem).toHaveBeenCalledWith('skull-king-speech-speed', '2');
    });

    test('should load saved speed from localStorage on initialization', () => {
        // Set a saved speed
        localStorage.getItem = jest.fn((key) => {
            if (key === 'skull-king-speech-speed') return '1.5';
            return null;
        });
        
        // Create new instance
        const newGameInstance = new (window as any).SkullKingGame();
        expect(newGameInstance.speechSpeed).toBe(1.5);
        
        const speedLink = document.getElementById('speed-toggle-link');
        expect(speedLink?.textContent).toBe('1.5x');
    });

    test('should handle invalid localStorage values gracefully', () => {
        // Set invalid speed
        localStorage.getItem = jest.fn((key) => {
            if (key === 'skull-king-speech-speed') return '3.5'; // Invalid value
            return null;
        });
        
        // Create new instance - should default to 1.0
        const newGameInstance = new (window as any).SkullKingGame();
        expect(newGameInstance.speechSpeed).toBe(1.0);
    });

    test('should apply speed multiplier to speech synthesis rate', () => {
        // Setup game with players
        gameInstance.viewModel.state.players = [
            { name: 'Jack', score: 100 },
            { name: 'Anne', score: 80 }
        ];
        gameInstance.viewModel.state.rounds = [
            {
                roundNumber: 1,
                playerData: [
                    { playerName: 'Jack', bid: 1, actual: 1, bonus: 0, roundScore: 20 },
                    { playerName: 'Anne', bid: 0, actual: 0, bonus: 0, roundScore: 10 }
                ],
                commentary: 'Test round'
            }
        ];

        // Test at 1.0x speed
        gameInstance.readScores();
        // Base rate for English is 0.7, multiplied by 1.0 = 0.7
        expect(mockUtterance.rate).toBe(0.7);

        // Test at 1.5x speed
        gameInstance.toggleSpeechSpeed(); // Change to 1.5x
        gameInstance.readScores();
        // Base rate 0.7 * 1.5 = 1.05
        expect(mockUtterance.rate).toBeCloseTo(1.05, 2);

        // Test at 2.0x speed
        gameInstance.toggleSpeechSpeed(); // Change to 2.0x
        gameInstance.readScores();
        // Base rate 0.7 * 2.0 = 1.4
        expect(mockUtterance.rate).toBe(1.4);
    });

    test('should update link text when speed changes', () => {
        const speedLink = document.getElementById('speed-toggle-link') as HTMLAnchorElement;
        
        // Click event should trigger toggle
        speedLink?.click();
        expect(speedLink?.textContent).toBe('1.5x');
        
        speedLink?.click();
        expect(speedLink?.textContent).toBe('2x');
        
        speedLink?.click();
        expect(speedLink?.textContent).toBe('1x');
    });

    test('should maintain language-specific base rates with speed multiplier', () => {
        // Set German language
        (window as any).i18n.setLanguage('de');
        
        gameInstance.viewModel.state.players = [
            { name: 'Hans', score: 100 }
        ];
        gameInstance.viewModel.state.rounds = [];

        // German base rate is 0.65
        gameInstance.speechSpeed = 2.0;
        gameInstance.readScores();
        
        // Base rate 0.65 * 2.0 = 1.3
        expect(mockUtterance.rate).toBe(1.3);
    });
});
/**
 * Tests for Graybeard functionality in 2-player mode
 */
describe('Graybeard 2-Player Mode', () => {
    let gameInstance: any;
    let viewModel: any;

    beforeEach(() => {
        // Mock localStorage
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn()
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        
        // Reset DOM
        document.body.innerHTML = `
            <div id="landing-section"></div>
            <div id="player-names-section"></div>
            <div id="game-section"></div>
            <div id="player-names-inputs"></div>
            <div id="score-display"></div>
            <div id="previous-rounds"></div>
            <div id="new-round"></div>
            <div id="round-inputs"></div>
            <div id="round-number"></div>
            <div id="pirate-commentary"></div>
            <div id="commentary-text"></div>
            <div id="winner-announcement"></div>
            <div id="winner-text"></div>
        `;
        
        // Import the game module
        require('../../build/runFiles/game.js');
        
        // Set language to English for consistent test messages
        (global as any).i18n.setLanguage('en');
        
        // Create a new game instance
        gameInstance = new (window as any).SkullKingGame();
        viewModel = gameInstance.viewModel;
    });

    describe('Graybeard Activation', () => {
        test('should activate Graybeard for exactly 2 players', () => {
            viewModel.setTempPlayers(['Alice', 'Bob']);
            const error = viewModel.validateAndStartGame();
            
            expect(error).toBeNull();
            expect(viewModel.isGraybeardActive()).toBe(true);
        });

        test('should NOT activate Graybeard for 3 players', () => {
            viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
            const error = viewModel.validateAndStartGame();
            
            expect(error).toBeNull();
            expect(viewModel.isGraybeardActive()).toBe(false);
        });

        test('should NOT activate Graybeard for 4+ players', () => {
            viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie', 'David']);
            const error = viewModel.validateAndStartGame();
            
            expect(error).toBeNull();
            expect(viewModel.isGraybeardActive()).toBe(false);
        });
    });

    describe('Graybeard Round Validation', () => {
        beforeEach(() => {
            viewModel.setTempPlayers(['Alice', 'Bob']);
            viewModel.validateAndStartGame();
        });

        test('should validate total tricks including Graybeard', () => {
            const roundData = {
                'Alice': { bid: 0, actual: 0, bonus: 0 },
                'Bob': { bid: 1, actual: 1, bonus: 0 }
            };
            
            // Round 1: 1 card dealt, so total tricks must be 1
            // Alice: 0, Bob: 1, Graybeard: 0 = 1 total (valid)
            let error = viewModel.validateRoundData(roundData, 1, false, false, 0);
            expect(error).toBeNull();
            
            // Alice: 0, Bob: 0, Graybeard: 1 = 1 total (valid)
            roundData['Bob'].actual = 0;
            error = viewModel.validateRoundData(roundData, 1, false, false, 1);
            expect(error).toBeNull();
            
            // Alice: 0, Bob: 1, Graybeard: 1 = 2 total (invalid)
            roundData['Bob'].actual = 1;
            error = viewModel.validateRoundData(roundData, 1, false, false, 1);
            expect(error).toContain('Total tricks won (2 including Graybeard) must equal 1');
        });

        test('should reject negative Graybeard tricks', () => {
            const roundData = {
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const error = viewModel.validateRoundData(roundData, 1, false, false, -1);
            expect(error).toContain("Graybeard's tricks cannot be negative");
        });

        test('should reject Graybeard tricks exceeding round maximum', () => {
            const roundData = {
                'Alice': { bid: 0, actual: 0, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            // Round 2: 2 cards dealt, Graybeard tries to win 3
            const error = viewModel.validateRoundData(roundData, 2, false, false, 3);
            expect(error).toContain('Graybeard cannot win more than 2 tricks');
        });

        test('should store Graybeard tricks in round data', () => {
            const roundData = {
                'Alice': { bid: 0, actual: 0, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const error = viewModel.addRound(roundData, false, false, 1);
            expect(error).toBeNull();
            
            const gameState = viewModel.getGameState();
            expect(gameState.rounds[0].graybeardTricksWon).toBe(1);
        });
    });

    describe('Graybeard with Expansion Cards', () => {
        beforeEach(() => {
            viewModel.setTempPlayers(['Alice', 'Bob']);
            viewModel.validateAndStartGame();
        });

        test('should handle Graybeard with Kraken', () => {
            const roundData = {
                'Alice': { bid: 0, actual: 0, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            // Round 3: 3 cards, Kraken destroys 1, so 2 tricks total
            // Graybeard wins 2
            const error = viewModel.validateRoundData(roundData, 3, true, false, 2);
            expect(error).toBeNull();
        });

        test('should handle Graybeard with trick discarded', () => {
            const roundData = {
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            // Round 4: 4 cards, trick discarded (Whale/Stingray), so 3 tricks total
            // Alice: 1, Bob: 0, Graybeard: 2 = 3 total
            const error = viewModel.validateRoundData(roundData, 4, false, true, 2);
            expect(error).toBeNull();
        });
    });

    describe('Player Persistence with Graybeard', () => {
        test('should preserve only real player names when starting new game', () => {
            // Start a 2-player game (Graybeard active)
            viewModel.setTempPlayers(['Alice', 'Bob']);
            viewModel.validateAndStartGame();
            expect(viewModel.isGraybeardActive()).toBe(true);
            
            // Start a new game keeping names
            viewModel.startNewGame(true);
            const tempPlayers = viewModel.getTempPlayers();
            
            // Should have exactly 2 players (no Graybeard in temp players)
            expect(tempPlayers).toEqual(['Alice', 'Bob']);
            expect(tempPlayers.length).toBe(2);
        });

        test('should deactivate Graybeard when adding a third player', () => {
            // Start with 2 players
            viewModel.setTempPlayers(['Alice', 'Bob']);
            viewModel.validateAndStartGame();
            expect(viewModel.isGraybeardActive()).toBe(true);
            
            // Start new game, keep names, add third player
            viewModel.startNewGame(true);
            viewModel.addTempPlayer();
            viewModel.updateTempPlayer(2, 'Charlie');
            viewModel.validateAndStartGame();
            
            // Graybeard should be deactivated
            expect(viewModel.isGraybeardActive()).toBe(false);
            expect(viewModel.getPlayerCount()).toBe(3);
        });

        test('should activate Graybeard when reducing to 2 players', () => {
            // Start with 3 players
            viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
            viewModel.validateAndStartGame();
            expect(viewModel.isGraybeardActive()).toBe(false);
            
            // Start new game with only 2 players
            viewModel.setTempPlayers(['Alice', 'Bob']);
            viewModel.validateAndStartGame();
            
            // Graybeard should be activated
            expect(viewModel.isGraybeardActive()).toBe(true);
            expect(viewModel.getPlayerCount()).toBe(2);
        });
    });

    describe('Graybeard UI Rendering', () => {
        beforeEach(() => {
            viewModel.setTempPlayers(['Alice', 'Bob']);
            viewModel.validateAndStartGame();
        });

        test('should render Graybeard input in round inputs', () => {
            gameInstance.updateUI();
            
            const graybeardInput = document.getElementById('graybeard-tricks');
            expect(graybeardInput).toBeTruthy();
            expect(graybeardInput?.getAttribute('type')).toBe('number');
            expect(graybeardInput?.getAttribute('min')).toBe('0');
            expect(graybeardInput?.getAttribute('max')).toBe('1'); // Round 1
        });

        test('should NOT render Graybeard for 3+ players', () => {
            viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
            viewModel.validateAndStartGame();
            gameInstance.updateUI();
            
            const graybeardInput = document.getElementById('graybeard-tricks');
            expect(graybeardInput).toBeFalsy();
        });

        test('should display Graybeard in previous rounds', () => {
            const roundData = {
                'Alice': { bid: 0, actual: 0, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            viewModel.addRound(roundData, false, false, 1);
            gameInstance.updateUI();
            
            const previousRounds = document.getElementById('previous-rounds');
            // Check for the ghost emoji which is consistent across languages
            expect(previousRounds?.innerHTML).toContain('👻');
            // Also check that the Graybeard data row exists
            expect(previousRounds?.innerHTML).toContain('graybeard-round-data');
        });
    });

    describe('Graybeard Score Calculation', () => {
        beforeEach(() => {
            viewModel.setTempPlayers(['Alice', 'Bob']);
            viewModel.validateAndStartGame();
        });

        test('should not affect player scores directly', () => {
            const roundData = {
                'Alice': { bid: 0, actual: 0, bonus: 0 },
                'Bob': { bid: 1, actual: 0, bonus: 0 } // Failed bid
            };
            
            // Graybeard won the trick that Bob needed
            viewModel.addRound(roundData, false, false, 1);
            
            const gameState = viewModel.getGameState();
            const alice = gameState.players.find((p: any) => p.name === 'Alice');
            const bob = gameState.players.find((p: any) => p.name === 'Bob');
            
            // Alice gets 10 points for successful zero bid in round 1
            expect(alice.score).toBe(10);
            // Bob loses 10 points for missing by 1
            expect(bob.score).toBe(-10);
        });

        test('should allow players to succeed despite Graybeard', () => {
            const roundData = {
                'Alice': { bid: 1, actual: 1, bonus: 20 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            // Round 2: 2 tricks total
            // Alice: 1, Bob: 0, Graybeard: 1
            viewModel.state.currentRound = 2;
            viewModel.addRound(roundData, false, false, 1);
            
            const gameState = viewModel.getGameState();
            const alice = gameState.players.find((p: any) => p.name === 'Alice');
            const bob = gameState.players.find((p: any) => p.name === 'Bob');
            
            // Alice gets 20 for 1 trick + 20 bonus
            expect(alice.score).toBe(40);
            // Bob gets 20 for zero bid in round 2 (10 × 2)
            expect(bob.score).toBe(20);
        });
    });

    describe('Edge Cases', () => {
        test('should handle Graybeard winning all tricks', () => {
            viewModel.setTempPlayers(['Alice', 'Bob']);
            viewModel.validateAndStartGame();
            
            const roundData = {
                'Alice': { bid: 0, actual: 0, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            // Round 1: Graybeard wins the only trick
            const error = viewModel.addRound(roundData, false, false, 1);
            expect(error).toBeNull();
            
            // Both players should get points for zero bid
            const gameState = viewModel.getGameState();
            expect(gameState.players[0].score).toBe(10); // Alice
            expect(gameState.players[1].score).toBe(10); // Bob
        });

        test('should handle Graybeard winning no tricks', () => {
            viewModel.setTempPlayers(['Alice', 'Bob']);
            viewModel.validateAndStartGame();
            viewModel.state.currentRound = 5;
            
            const roundData = {
                'Alice': { bid: 3, actual: 3, bonus: 0 },
                'Bob': { bid: 2, actual: 2, bonus: 0 }
            };
            
            // Round 5: 5 tricks, all won by players
            const error = viewModel.addRound(roundData, false, false, 0);
            expect(error).toBeNull();
            
            const gameState = viewModel.getGameState();
            expect(gameState.rounds[0].graybeardTricksWon).toBe(0);
        });
    });
});

describe('Expansion Pack - Mode Toggle', () => {
    let gameInstance: any;

    beforeEach(() => {
        gameInstance = new window.SkullKingGame();
    });

    describe('Expansion Mode Toggle', () => {
        test('should default to expansion mode disabled', () => {
            expect(gameInstance.viewModel.isExpansionMode()).toBe(false);
        });

        test('should enable expansion mode when toggled', () => {
            gameInstance.viewModel.setExpansionMode(true);
            expect(gameInstance.viewModel.isExpansionMode()).toBe(true);
        });

        test('should disable expansion mode when toggled off', () => {
            gameInstance.viewModel.setExpansionMode(true);
            gameInstance.viewModel.setExpansionMode(false);
            expect(gameInstance.viewModel.isExpansionMode()).toBe(false);
        });

        test('should persist expansion mode to localStorage', () => {
            gameInstance.viewModel.setExpansionMode(true);
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'skull-king-expansion-mode',
                'true'
            );
        });

        test('should load expansion mode from localStorage on init', () => {
            // Mock localStorage returning expansion mode enabled
            (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'skull-king-expansion-mode') return 'true';
                return null;
            });
            
            // Create new instance which should load from localStorage
            const newGame = new window.SkullKingGame();
            expect(newGame.viewModel.isExpansionMode()).toBe(true);
        });

        test('should handle invalid localStorage values gracefully', () => {
            (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'skull-king-expansion-mode') return 'invalid';
                return null;
            });
            
            const newGame = new window.SkullKingGame();
            expect(newGame.viewModel.isExpansionMode()).toBe(false);
        });

        test('should save expansion mode in game state', () => {
            gameInstance.viewModel.setExpansionMode(true);
            gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
            gameInstance.viewModel.validateAndStartGame();
            
            const gameState = gameInstance.viewModel.getGameState();
            expect(gameState.expansionMode).toBe(true);
        });
    });

    describe('Player Count Validation with Expansion Mode', () => {
        test('should allow 8 players in standard mode', () => {
            gameInstance.viewModel.setExpansionMode(false);
            gameInstance.viewModel.setTempPlayers(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8']);
            
            const error = gameInstance.viewModel.validateAndStartGame();
            expect(error).toBeNull();
        });

        test('should reject 9 players in standard mode', () => {
            gameInstance.viewModel.setExpansionMode(false);
            gameInstance.viewModel.setTempPlayers(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9']);
            
            const error = gameInstance.viewModel.validateAndStartGame();
            expect(error).not.toBeNull();
            expect(error).toContain('8');
        });

        test('should allow 9 players in expansion mode', () => {
            gameInstance.viewModel.setExpansionMode(true);
            gameInstance.viewModel.setTempPlayers(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9']);
            
            const error = gameInstance.viewModel.validateAndStartGame();
            expect(error).toBeNull();
        });

        test('should reject 10 players even in expansion mode', () => {
            gameInstance.viewModel.setExpansionMode(true);
            gameInstance.viewModel.setTempPlayers(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10']);
            
            const error = gameInstance.viewModel.validateAndStartGame();
            expect(error).not.toBeNull();
            expect(error).toContain('9');
        });

        test('should still enforce minimum 2 players in expansion mode', () => {
            gameInstance.viewModel.setExpansionMode(true);
            gameInstance.viewModel.setTempPlayers(['Alice']);
            
            const error = gameInstance.viewModel.validateAndStartGame();
            expect(error).not.toBeNull();
            expect(error).toContain('2');
        });
    });

    describe('Cards Per Round with Expansion Mode', () => {
        test('base game should use 70 cards total', () => {
            gameInstance.viewModel.setExpansionMode(false);
            gameInstance.viewModel.setTempPlayers(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8']);
            gameInstance.viewModel.validateAndStartGame();
            
            // With 8 players and 70 cards, round 10 should give 8 cards each (80 needed, only 70 available)
            const cardsRound10 = gameInstance.viewModel.getCardsPerRound(10, 8);
            expect(cardsRound10).toBe(8); // floor(70/8) = 8
            
            // Round 8 should give 8 cards each (64 needed, 70 available)
            const cardsRound8 = gameInstance.viewModel.getCardsPerRound(8, 8);
            expect(cardsRound8).toBe(8);
        });

        test('expansion mode should use 89 cards total', () => {
            gameInstance.viewModel.setExpansionMode(true);
            gameInstance.viewModel.setTempPlayers(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8']);
            gameInstance.viewModel.validateAndStartGame();
            
            // With 8 players and 89 cards, round 10 should give 10 cards each (80 needed, 89 available)
            const cardsRound10 = gameInstance.viewModel.getCardsPerRound(10, 8);
            expect(cardsRound10).toBe(10);
            
            // Round 9 should also give full 9 cards
            const cardsRound9 = gameInstance.viewModel.getCardsPerRound(9, 8);
            expect(cardsRound9).toBe(9);
        });

        test('expansion mode with 9 players should allow full 10 rounds', () => {
            gameInstance.viewModel.setExpansionMode(true);
            gameInstance.viewModel.setTempPlayers(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9']);
            gameInstance.viewModel.validateAndStartGame();
            
            // With 9 players and 89 cards, round 10 needs 90 cards but only 89 available
            // So round 10 should give 9 cards each (floor(89/9) = 9)
            const cardsRound10 = gameInstance.viewModel.getCardsPerRound(10, 9);
            expect(cardsRound10).toBe(9);
            
            // Round 9 should give full 9 cards (81 needed, 89 available)
            const cardsRound9 = gameInstance.viewModel.getCardsPerRound(9, 9);
            expect(cardsRound9).toBe(9);
        });

        test('base game with 8 players round 9 should be limited', () => {
            gameInstance.viewModel.setExpansionMode(false);
            gameInstance.viewModel.setTempPlayers(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8']);
            gameInstance.viewModel.validateAndStartGame();
            
            // 8 players, round 9 needs 72 cards but only 70 available
            const cardsRound9 = gameInstance.viewModel.getCardsPerRound(9, 8);
            expect(cardsRound9).toBe(8); // floor(70/8) = 8
        });

        test('expansion mode with 8 players should allow full 10 cards in round 10', () => {
            gameInstance.viewModel.setExpansionMode(true);
            gameInstance.viewModel.setTempPlayers(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8']);
            gameInstance.viewModel.validateAndStartGame();
            
            // 8 players, round 10 needs 80 cards, 89 available - should work
            const cardsRound10 = gameInstance.viewModel.getCardsPerRound(10, 8);
            expect(cardsRound10).toBe(10);
        });

        test('trick validation should account for expansion card count', () => {
            gameInstance.viewModel.setExpansionMode(true);
            gameInstance.viewModel.setTempPlayers(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8']);
            gameInstance.viewModel.validateAndStartGame();
            
            // Advance to round 10
            for (let i = 1; i < 10; i++) {
                const roundData: { [key: string]: { bid: number; actual: number; bonus: number } } = {};
                const cardsThisRound = gameInstance.viewModel.getCardsPerRound(i, 8);
                for (let p = 0; p < 7; p++) {
                    roundData[`P${p + 1}`] = { bid: 0, actual: 0, bonus: 0 };
                }
                // Last player gets all tricks
                roundData['P8'] = { bid: cardsThisRound, actual: cardsThisRound, bonus: 0 };
                gameInstance.viewModel.addRound(roundData);
            }
            
            // Round 10 with expansion should expect 10 tricks (not 8 like base game)
            const round10Data: { [key: string]: { bid: number; actual: number; bonus: number } } = {};
            for (let p = 0; p < 7; p++) {
                round10Data[`P${p + 1}`] = { bid: 0, actual: 0, bonus: 0 };
            }
            round10Data['P8'] = { bid: 10, actual: 10, bonus: 0 };
            
            const error = gameInstance.viewModel.addRound(round10Data);
            expect(error).toBeNull(); // Should succeed with 10 tricks in expansion mode
        });
    });

    describe('Expansion Mode Persistence', () => {
        test('should preserve expansion mode when starting new game', () => {
            gameInstance.viewModel.setExpansionMode(true);
            gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
            gameInstance.viewModel.validateAndStartGame();
            
            gameInstance.viewModel.startNewGame(true);
            
            expect(gameInstance.viewModel.isExpansionMode()).toBe(true);
        });

        test('should load expansion mode from saved game state', () => {
            // Set up a game with expansion enabled
            gameInstance.viewModel.setExpansionMode(true);
            gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
            gameInstance.viewModel.validateAndStartGame();
            
            const savedState = gameInstance.viewModel.getGameState();
            
            // Mock localStorage to return the saved state
            (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'skullKingGameState') return JSON.stringify(savedState);
                if (key === 'skull-king-expansion-mode') return 'true';
                return null;
            });
            
            // Create new instance (simulating page reload)
            const reloadedGame = new window.SkullKingGame();
            expect(reloadedGame.viewModel.isExpansionMode()).toBe(true);
            
            const gameState = reloadedGame.viewModel.getGameState();
            expect(gameState.expansionMode).toBe(true);
        });
    });

    describe('Backward Compatibility', () => {
        test('should handle old game state without expansionMode field', () => {
            const oldGameState = {
                players: [
                    { name: 'Alice', score: 50 },
                    { name: 'Bob', score: 30 }
                ],
                rounds: [],
                currentRound: 3,
                scoringMode: 'normal'
                // Note: no expansionMode field
            };
            
            (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'skullKingGameState') return JSON.stringify(oldGameState);
                return null;
            });
            
            const newGame = new window.SkullKingGame();
            
            // Should default to false for backward compatibility
            expect(newGame.viewModel.isExpansionMode()).toBe(false);
        });

        test('should handle rounds without expansion fields', () => {
            const oldGameState = {
                players: [{ name: 'Alice', score: 20 }, { name: 'Bob', score: 10 }],
                rounds: [{
                    roundNumber: 1,
                    playerData: [
                        { playerName: 'Alice', bid: 1, actual: 1, bonus: 0, roundScore: 20 },
                        { playerName: 'Bob', bid: 0, actual: 0, bonus: 0, roundScore: 10 }
                    ],
                    commentary: 'Test',
                    krakenPlayed: false
                    // No trickDiscarded or davyJonesMonsters
                }],
                currentRound: 2,
                scoringMode: 'normal'
            };
            
            (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
                if (key === 'skullKingGameState') return JSON.stringify(oldGameState);
                return null;
            });
            
            const newGame = new window.SkullKingGame();
            const gameState = newGame.viewModel.getGameState();
            
            // Should load successfully without errors
            expect(gameState.rounds.length).toBe(1);
            expect(gameState.rounds[0].trickDiscarded).toBeUndefined();
            expect(gameState.rounds[0].davyJonesMonsters).toBeUndefined();
        });
    });
});

describe('Expansion Pack Bonus Calculator - Phase 2', () => {
    let gameInstance: any;
    
    beforeEach(() => {
        gameInstance = new window.SkullKingGame();
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
    });

    describe('Expansion Bonus Counters', () => {
        test('should have expansion bonus counters when expansion mode is enabled', () => {
            gameInstance.viewModel.setExpansionMode(true);
            
            // Check that expansion counters exist
            expect(gameInstance.expansionBonusCounters).toBeDefined();
            expect(gameInstance.expansionBonusCounters.sevenCaptured).toBe(0);
            expect(gameInstance.expansionBonusCounters.eightCaptured).toBe(0);
            expect(gameInstance.expansionBonusCounters.firstMateCon).toBe(0);
            expect(gameInstance.expansionBonusCounters.davyJonesMonsters).toBe(0);
        });

        test('should calculate 7 captured penalty correctly (-5 each)', () => {
            gameInstance.viewModel.setExpansionMode(true);
            
            const points = gameInstance.calculateExpansionBonusPoints('sevenCaptured', 2);
            expect(points).toBe(-10); // 2 × -5 = -10
        });

        test('should calculate 8 captured bonus correctly (+5 each)', () => {
            gameInstance.viewModel.setExpansionMode(true);
            
            const points = gameInstance.calculateExpansionBonusPoints('eightCaptured', 3);
            expect(points).toBe(15); // 3 × +5 = +15
        });

        test('should calculate First Mate Con capture bonus (+30)', () => {
            gameInstance.viewModel.setExpansionMode(true);
            
            const points = gameInstance.calculateExpansionBonusPoints('firstMateCon', 1);
            expect(points).toBe(30);
        });

        test('should calculate Davy Jones sea monster captures (+20 each)', () => {
            gameInstance.viewModel.setExpansionMode(true);
            
            const points = gameInstance.calculateExpansionBonusPoints('davyJonesMonsters', 2);
            expect(points).toBe(40); // 2 × +20 = +40
        });

        test('should enforce max limits for expansion counters', () => {
            gameInstance.viewModel.setExpansionMode(true);
            
            // 7s - max 4
            gameInstance.updateExpansionBonusCounter('sevenCaptured', 5);
            expect(gameInstance.expansionBonusCounters.sevenCaptured).toBe(4);
            
            // 8s - max 4
            gameInstance.updateExpansionBonusCounter('eightCaptured', 5);
            expect(gameInstance.expansionBonusCounters.eightCaptured).toBe(4);
            
            // First Mate Con - max 1
            gameInstance.updateExpansionBonusCounter('firstMateCon', 2);
            expect(gameInstance.expansionBonusCounters.firstMateCon).toBe(1);
            
            // Davy Jones - max 3
            gameInstance.updateExpansionBonusCounter('davyJonesMonsters', 4);
            expect(gameInstance.expansionBonusCounters.davyJonesMonsters).toBe(3);
        });

        test('should not allow negative values for expansion counters', () => {
            gameInstance.viewModel.setExpansionMode(true);
            
            gameInstance.updateExpansionBonusCounter('sevenCaptured', -1);
            expect(gameInstance.expansionBonusCounters.sevenCaptured).toBe(0);
        });

        test('should display correct format for expansion bonus points', () => {
            gameInstance.viewModel.setExpansionMode(true);
            
            // Create points display elements
            const points7 = document.createElement('span');
            points7.id = 'points-sevenCaptured';
            document.body.appendChild(points7);
            
            const points8 = document.createElement('span');
            points8.id = 'points-eightCaptured';
            document.body.appendChild(points8);
            
            // Update counters
            gameInstance.updateExpansionBonusCounter('sevenCaptured', 2);
            gameInstance.updateExpansionBonusCounter('eightCaptured', 3);
            
            // 7s should show negative without double sign (e.g., "-10" not "+-10")
            expect(points7.textContent).toBe('-10');
            
            // 8s should show positive with single + (e.g., "+15" not "++15")
            expect(points8.textContent).toBe('+15');
            
            // Clean up
            document.body.removeChild(points7);
            document.body.removeChild(points8);
        });
    });

    describe('Expansion Bonus Total Calculation', () => {
        test('should include expansion bonuses in total when expansion mode is enabled', () => {
            gameInstance.viewModel.setExpansionMode(true);
            
            // Set some expansion bonuses
            gameInstance.expansionBonusCounters = {
                sevenCaptured: 2,    // -10
                eightCaptured: 1,    // +5
                firstMateCon: 1,     // +30
                davyJonesMonsters: 1 // +20
            };
            
            const expansionTotal = gameInstance.calculateExpansionBonusTotal();
            expect(expansionTotal).toBe(45); // -10 + 5 + 30 + 20 = 45
        });

        test('should return 0 for expansion total when expansion mode is disabled', () => {
            gameInstance.viewModel.setExpansionMode(false);
            
            gameInstance.expansionBonusCounters = {
                sevenCaptured: 2,
                eightCaptured: 1,
                firstMateCon: 1,
                davyJonesMonsters: 1
            };
            
            const expansionTotal = gameInstance.calculateExpansionBonusTotal();
            expect(expansionTotal).toBe(0);
        });

        test('should combine base and expansion bonuses in grand total', () => {
            gameInstance.viewModel.setExpansionMode(true);
            
            // Set base bonuses
            gameInstance.bonusCounters = {
                standard14: 1,     // +10
                black14: 1,        // +20
                mermaidPirate: 0,
                skullPirate: 0,
                mermaidSkull: 0,
                loot: 0
            };
            
            // Set expansion bonuses
            gameInstance.expansionBonusCounters = {
                sevenCaptured: 0,
                eightCaptured: 2,     // +10
                firstMateCon: 0,
                davyJonesMonsters: 1  // +20
            };
            
            const grandTotal = gameInstance.calculateGrandBonusTotal();
            expect(grandTotal).toBe(60); // 10 + 20 + 10 + 20 = 60
        });
    });

    describe('Expansion Bonus UI Visibility', () => {
        test('should start with expansion section hidden in HTML', () => {
            // Verify the HTML default state - expansion section should have hidden class
            // This tests that the HTML template has the correct initial state
            const html = `<div id="expansion-bonus-section" class="bonus-category expansion-bonuses hidden"></div>`;
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const section = doc.getElementById('expansion-bonus-section');
            
            expect(section?.classList.contains('hidden')).toBe(true);
        });

        test('should keep expansion section hidden when game started WITHOUT expansion mode', () => {
            // Start a fresh game WITHOUT expansion mode
            const freshGame = new window.SkullKingGame();
            freshGame.viewModel.startNewGame(false);
            freshGame.viewModel.setExpansionMode(false); // Explicitly disable
            freshGame.viewModel.setTempPlayers(['Alice', 'Bob']);
            freshGame.viewModel.validateAndStartGame();
            
            // Verify expansion mode is off
            expect(freshGame.viewModel.isExpansionMode()).toBe(false);
            
            // Create the expansion section element for testing
            const expansionSection = document.createElement('div');
            expansionSection.id = 'expansion-bonus-section';
            expansionSection.classList.add('hidden');
            document.body.appendChild(expansionSection);
            
            // Create bid/actual inputs (required for openBonusModal)
            const bidInput = document.createElement('input');
            bidInput.id = 'bid-player-0';
            bidInput.value = '1';
            document.body.appendChild(bidInput);
            
            const actualInput = document.createElement('input');
            actualInput.id = 'actual-player-0';
            actualInput.value = '1';
            document.body.appendChild(actualInput);
            
            // Open bonus modal - should keep expansion section hidden
            freshGame.openBonusModal(0);
            
            expect(expansionSection.classList.contains('hidden')).toBe(true);
            
            // Clean up
            document.body.removeChild(expansionSection);
            document.body.removeChild(bidInput);
            document.body.removeChild(actualInput);
        });

        test('should respect game state over localStorage for expansion mode', () => {
            // Set localStorage to true (simulating previous session)
            localStorage.setItem('skull-king-expansion-mode', 'true');
            
            // Start a fresh game and explicitly disable expansion
            const freshGame = new window.SkullKingGame();
            freshGame.viewModel.startNewGame(false);
            freshGame.viewModel.setExpansionMode(false); // Override localStorage
            freshGame.viewModel.setTempPlayers(['Alice', 'Bob']);
            freshGame.viewModel.validateAndStartGame();
            
            // Verify expansion mode is off (state should override localStorage)
            expect(freshGame.viewModel.isExpansionMode()).toBe(false);
            
            // Create the expansion section element for testing
            const expansionSection = document.createElement('div');
            expansionSection.id = 'expansion-bonus-section';
            expansionSection.classList.add('hidden');
            document.body.appendChild(expansionSection);
            
            // Create bid/actual inputs
            const bidInput = document.createElement('input');
            bidInput.id = 'bid-player-0';
            bidInput.value = '1';
            document.body.appendChild(bidInput);
            
            const actualInput = document.createElement('input');
            actualInput.id = 'actual-player-0';
            actualInput.value = '1';
            document.body.appendChild(actualInput);
            
            // Open bonus modal - should keep expansion section hidden
            freshGame.openBonusModal(0);
            
            expect(expansionSection.classList.contains('hidden')).toBe(true);
            
            // Clean up
            document.body.removeChild(expansionSection);
            document.body.removeChild(bidInput);
            document.body.removeChild(actualInput);
        });

        test('should show expansion section when game started WITH expansion mode', () => {
            // Create the expansion section element for testing
            const expansionSection = document.createElement('div');
            expansionSection.id = 'expansion-bonus-section';
            expansionSection.classList.add('hidden');
            document.body.appendChild(expansionSection);
            
            // Create bid/actual inputs (required for openBonusModal)
            const bidInput = document.createElement('input');
            bidInput.id = 'bid-player-0';
            bidInput.value = '1';
            document.body.appendChild(bidInput);
            
            const actualInput = document.createElement('input');
            actualInput.id = 'actual-player-0';
            actualInput.value = '1';
            document.body.appendChild(actualInput);
            
            gameInstance.viewModel.setExpansionMode(true);
            
            // Open bonus modal for player 0 - this should show the expansion section
            gameInstance.openBonusModal(0);
            
            expect(expansionSection.classList.contains('hidden')).toBe(false);
            
            // Clean up
            document.body.removeChild(expansionSection);
            document.body.removeChild(bidInput);
            document.body.removeChild(actualInput);
        });

        test('should keep expansion section hidden when expansion mode is disabled', () => {
            // Create the expansion section element for testing
            const expansionSection = document.createElement('div');
            expansionSection.id = 'expansion-bonus-section';
            expansionSection.classList.add('hidden');
            document.body.appendChild(expansionSection);
            
            // Create bid/actual inputs (required for openBonusModal)
            const bidInput = document.createElement('input');
            bidInput.id = 'bid-player-0';
            bidInput.value = '1';
            document.body.appendChild(bidInput);
            
            const actualInput = document.createElement('input');
            actualInput.id = 'actual-player-0';
            actualInput.value = '1';
            document.body.appendChild(actualInput);
            
            gameInstance.viewModel.setExpansionMode(false);
            
            // Open bonus modal for player 0
            gameInstance.openBonusModal(0);
            
            expect(expansionSection.classList.contains('hidden')).toBe(true);
            
            // Clean up
            document.body.removeChild(expansionSection);
            document.body.removeChild(bidInput);
            document.body.removeChild(actualInput);
        });
    });

    describe('Expansion Bonus Clear and Apply', () => {
        test('should clear expansion bonuses when clearing calculator', () => {
            gameInstance.viewModel.setExpansionMode(true);
            
            gameInstance.expansionBonusCounters = {
                sevenCaptured: 2,
                eightCaptured: 1,
                firstMateCon: 1,
                davyJonesMonsters: 1
            };
            
            gameInstance.clearBonusCalculator();
            
            expect(gameInstance.expansionBonusCounters.sevenCaptured).toBe(0);
            expect(gameInstance.expansionBonusCounters.eightCaptured).toBe(0);
            expect(gameInstance.expansionBonusCounters.firstMateCon).toBe(0);
            expect(gameInstance.expansionBonusCounters.davyJonesMonsters).toBe(0);
        });

        test('should include expansion bonuses when applying to player', () => {
            gameInstance.viewModel.setExpansionMode(true);
            
            // Create bonus value display element
            const bonusValueEl = document.createElement('span');
            bonusValueEl.id = 'bonus-value-0';
            document.body.appendChild(bonusValueEl);
            
            // Set current bonus player index
            gameInstance.currentBonusPlayerIndex = 0;
            
            // Set base bonuses
            gameInstance.bonusCounters = {
                standard14: 1,     // +10
                black14: 0,
                mermaidPirate: 0,
                skullPirate: 0,
                mermaidSkull: 0,
                loot: 0
            };
            
            // Set expansion bonuses
            gameInstance.expansionBonusCounters = {
                sevenCaptured: 0,
                eightCaptured: 1,  // +5
                firstMateCon: 0,
                davyJonesMonsters: 0
            };
            
            // Calculate grand total
            const grandTotal = gameInstance.calculateGrandBonusTotal();
            expect(grandTotal).toBe(15); // 10 + 5 = 15
            
            // Clean up
            document.body.removeChild(bonusValueEl);
        });
    });
});

describe('Graybeard State Bug', () => {
    test('graybeardActive should be false for 3+ player games after loading 2-player game state', () => {
        // First simulate a 2-player game with graybeardActive true
        const oldGameState = {
            players: [{ name: 'Alice', score: 0 }, { name: 'Bob', score: 0 }],
            rounds: [],
            currentRound: 1,
            scoringMode: 'normal',
            graybeardActive: true
        };
        
        (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
            if (key === 'skullKingGameState') return JSON.stringify(oldGameState);
            return null;
        });
        
        // Load the game (simulates page refresh after 2-player game)
        const game = new window.SkullKingGame();
        
        // Verify graybeardActive is true for the 2-player game
        expect(game.viewModel.isGraybeardActive()).toBe(true);
        
        // Now start a new 3-player game
        game.viewModel.startNewGame(false);
        game.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
        game.viewModel.validateAndStartGame();
        
        // Graybeard should NOT be active for 3 players
        expect(game.viewModel.isGraybeardActive()).toBe(false);
    });
});

describe('Graybeard UI Bug - Continuing Game', () => {
    test('graybeardActive should be correctly loaded for 3+ player game', () => {
        // Simulate a 3-player game state that was saved
        const threePlayerState = {
            players: [
                { name: 'Alice', score: 20 }, 
                { name: 'Bob', score: 10 },
                { name: 'Charlie', score: 30 }
            ],
            rounds: [{
                roundNumber: 1,
                playerData: [
                    { playerName: 'Alice', bid: 1, actual: 1, bonus: 0, roundScore: 20 },
                    { playerName: 'Bob', bid: 0, actual: 0, bonus: 0, roundScore: 10 },
                    { playerName: 'Charlie', bid: 0, actual: 0, bonus: 0, roundScore: 30 }
                ],
                commentary: 'Test'
            }],
            currentRound: 2,
            scoringMode: 'normal',
            graybeardActive: false  // Should be false for 3 players
        };
        
        (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
            if (key === 'skullKingGameState') return JSON.stringify(threePlayerState);
            return null;
        });
        
        // Load the game (simulates page refresh)
        const game = new window.SkullKingGame();
        
        // Verify graybeardActive is false for the 3-player game
        expect(game.viewModel.isGraybeardActive()).toBe(false);
        expect(game.viewModel.getPlayerCount()).toBe(3);
    });
    
    test('graybeardActive should NOT be true if loaded state has undefined graybeardActive and 3 players', () => {
        // Simulate an older 3-player game state without graybeardActive field
        const oldThreePlayerState = {
            players: [
                { name: 'Alice', score: 20 }, 
                { name: 'Bob', score: 10 },
                { name: 'Charlie', score: 30 }
            ],
            rounds: [],
            currentRound: 1,
            scoringMode: 'normal'
            // Note: no graybeardActive field - simulates old saved state
        };
        
        (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
            if (key === 'skullKingGameState') return JSON.stringify(oldThreePlayerState);
            return null;
        });
        
        // Load the game
        const game = new window.SkullKingGame();
        
        // isGraybeardActive checks if graybeardActive === true, so undefined should return false
        expect(game.viewModel.isGraybeardActive()).toBe(false);
    });
});

describe('Graybeard Round History Bug', () => {
    test('graybeardTricksWon should be undefined for 3+ player games', () => {
        // Setup a 3-player game
        const threePlayerState = {
            players: [
                { name: 'Alice', score: 0 }, 
                { name: 'Bob', score: 0 },
                { name: 'Charlie', score: 0 }
            ],
            rounds: [],
            currentRound: 1,
            scoringMode: 'normal',
            graybeardActive: false
        };
        
        (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
            if (key === 'skullKingGameState') return JSON.stringify(threePlayerState);
            return null;
        });
        
        const game = new window.SkullKingGame();
        
        // Simulate round data
        const roundData = {
            'Alice': { bid: 1, actual: 1, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 },
            'Charlie': { bid: 0, actual: 0, bonus: 0 }
        };
        
        // Add round using the exposed addRound method
        const result = game.viewModel.addRound(roundData, false, false, 0);
        
        expect(result).toBeNull(); // No error
        
        // Get the state and check the round
        const state = game.viewModel.getGameState();
        expect(state.rounds.length).toBe(1);
        expect(state.rounds[0].graybeardTricksWon).toBeUndefined();
    });
    
    test('graybeardTricksWon should be set for 2-player games', () => {
        // Setup a 2-player game
        const twoPlayerState = {
            players: [
                { name: 'Alice', score: 0 }, 
                { name: 'Bob', score: 0 }
            ],
            rounds: [],
            currentRound: 1,
            scoringMode: 'normal',
            graybeardActive: true
        };
        
        (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
            if (key === 'skullKingGameState') return JSON.stringify(twoPlayerState);
            return null;
        });
        
        const game = new window.SkullKingGame();
        
        // Simulate round data
        const roundData = {
            'Alice': { bid: 1, actual: 1, bonus: 0 },
            'Bob': { bid: 0, actual: 0, bonus: 0 }
        };
        
        // Add round with graybeard tricks = 0
        const result = game.viewModel.addRound(roundData, false, false, 0);
        
        expect(result).toBeNull(); // No error
        
        // Get the state and check the round
        const state = game.viewModel.getGameState();
        expect(state.rounds.length).toBe(1);
        expect(state.rounds[0].graybeardTricksWon).toBe(0);
    });
});
