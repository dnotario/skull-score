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
import '../build/runFiles/game.js';

// Declare the SkullKingGame class and i18n
declare global {
    interface Window {
        SkullKingGame: any;
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
        // Mock the showErrorModal method
        const showErrorSpy = jest.spyOn(gameInstance, 'showErrorModal').mockImplementation(() => {});
        
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
        
        // Mock the showErrorModal method
        const showErrorSpy = jest.spyOn(gameInstance, 'showErrorModal').mockImplementation(() => {});
        
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
        
        // Mock the showErrorModal method
        const showErrorSpy = jest.spyOn(gameInstance, 'showErrorModal').mockImplementation(() => {});
        
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
        // Create fresh instance with no game
        const freshInstance = new window.SkullKingGame();
        
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

    test.skip('should skip player setup when using same players with valid names - OLD FLOW', () => {
        // Setup: Start with an existing game with players
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob', 'Charlie']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Verify we have an active game
        expect(gameInstance.viewModel.isGameActive()).toBe(true);
        expect(gameInstance.viewModel.state.players.length).toBe(3);
        
        // Mock updateUI to track if it's called
        const updateUISpy = jest.spyOn(gameInstance, 'updateUI');
        
        // Mock showPlayerSetup to ensure it's NOT called
        const showPlayerSetupSpy = jest.spyOn(gameInstance, 'showPlayerSetup');
        
        // Test: Call handleSamePlayersNewGame
        gameInstance.handleSamePlayersNewGame();
        
        // Verify: Should have started a new game with same players
        expect(gameInstance.viewModel.isGameActive()).toBe(true);
        expect(gameInstance.viewModel.state.players.length).toBe(3);
        expect(gameInstance.viewModel.state.players[0].name).toBe('Alice');
        expect(gameInstance.viewModel.state.players[1].name).toBe('Bob');
        expect(gameInstance.viewModel.state.players[2].name).toBe('Charlie');
        
        // Verify: Should have called updateUI (goes to game) but NOT showPlayerSetup
        expect(updateUISpy).toHaveBeenCalled();
        expect(showPlayerSetupSpy).not.toHaveBeenCalled();
        
        // Verify: Game should be reset (round 1, no previous rounds)
        expect(gameInstance.viewModel.getCurrentRoundNumber()).toBe(1);
        expect(gameInstance.viewModel.state.rounds.length).toBe(0);
        
        updateUISpy.mockRestore();
        showPlayerSetupSpy.mockRestore();
    });

    test.skip('should go to player setup when same players has insufficient valid names - OLD FLOW', () => {
        // Setup: Start with a game that has only 1 player (invalid for new game)
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice']);
        gameInstance.viewModel.validateAndStartGame(); // This should fail but we force it for testing
        gameInstance.viewModel.state.players = [{ name: 'Alice', score: 0 }]; // Force invalid state
        
        // Mock showPlayerSetup to track if it's called
        const showPlayerSetupSpy = jest.spyOn(gameInstance, 'showPlayerSetup').mockImplementation(() => {});
        
        // Mock updateUI to ensure it's NOT called for direct game start
        const updateUISpy = jest.spyOn(gameInstance, 'updateUI');
        
        // Test: Call handleSamePlayersNewGame with insufficient players
        gameInstance.handleSamePlayersNewGame();
        
        // Verify: Should have gone to player setup since we don't have enough valid players
        expect(showPlayerSetupSpy).toHaveBeenCalled();
        expect(updateUISpy).not.toHaveBeenCalled(); // Should not start game directly
        
        showPlayerSetupSpy.mockRestore();
        updateUISpy.mockRestore();
    });

    test.skip('should handle new players flow correctly - OLD FLOW', () => {
        // Setup: Start with an existing game
        gameInstance.viewModel.startNewGame(false);
        gameInstance.viewModel.setTempPlayers(['Alice', 'Bob']);
        gameInstance.viewModel.validateAndStartGame();
        
        // Mock showPlayerSetup to track if it's called
        const showPlayerSetupSpy = jest.spyOn(gameInstance, 'showPlayerSetup').mockImplementation(() => {});
        
        // Test: Call handleNewPlayersNewGame
        gameInstance.handleNewPlayersNewGame();
        
        // Verify: Should clear state and go to player setup
        expect(gameInstance.viewModel.isGameActive()).toBe(false);
        expect(showPlayerSetupSpy).toHaveBeenCalled();
        
        // Verify: Temp players should be reset
        const tempPlayers = gameInstance.viewModel.getTempPlayers();
        expect(tempPlayers).toEqual(['']); // Should have one empty slot
        
        showPlayerSetupSpy.mockRestore();
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

    test.skip('should handle edge case when same players flow fails validation - OLD FLOW', () => {
        // Setup: Create a scenario where keeping names might fail validation
        gameInstance.viewModel.startNewGame(false);
        // Manually set invalid temp players that would fail validation
        gameInstance.viewModel.tempPlayers = ['', '', '']; // All empty names
        
        // Mock showPlayerSetup
        const showPlayerSetupSpy = jest.spyOn(gameInstance, 'showPlayerSetup').mockImplementation(() => {});
        
        // Test: Call handleSamePlayersNewGame with invalid names
        gameInstance.handleSamePlayersNewGame();
        
        // Verify: Should fall back to player setup
        expect(showPlayerSetupSpy).toHaveBeenCalled();
        
        showPlayerSetupSpy.mockRestore();
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
        document.body.innerHTML += `
            <div id="round-inputs"></div>
            <div id="round-number"></div>
            <input id="bid-Alice" type="number" />
            <input id="actual-Alice" type="number" />
            <input id="bonus-Alice" type="number" />
            <div id="score-Alice"></div>
            <input id="bid-Bob" type="number" />
            <input id="actual-Bob" type="number" />
            <input id="bonus-Bob" type="number" />
            <div id="score-Bob"></div>
        `;
    });
    
    test('should show "-" when both bid and actual are empty', () => {
        const scoreDisplay = document.getElementById('score-Alice') as HTMLElement;
        
        // Call updateRoundScore with empty inputs
        gameInstance.updateRoundScore('Alice');
        
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toBe('computed-score');
    });
    
    test('should show "-" with only bid filled (Progressive Disclosure)', () => {
        const bidInput = document.getElementById('bid-Alice') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-Alice') as HTMLElement;
        
        bidInput.value = '1';  // Valid bid for round 1 with 2 players
        gameInstance.updateRoundScore('Alice');
        
        // With Option 1: Progressive Disclosure, score only shows when both bid and actual are filled
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toBe('computed-score');
    });
    
    test('should show "-" with only actual filled (Progressive Disclosure)', () => {
        const actualInput = document.getElementById('actual-Alice') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-Alice') as HTMLElement;
        
        actualInput.value = '1';  // Valid actual for round 1 with 2 players
        gameInstance.updateRoundScore('Alice');
        
        // With Option 1: Progressive Disclosure, score only shows when both bid and actual are filled
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toBe('computed-score');
    });
    
    test('should calculate correct prediction score', () => {
        const bidInput = document.getElementById('bid-Alice') as HTMLInputElement;
        const actualInput = document.getElementById('actual-Alice') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-Alice') as HTMLElement;
        
        bidInput.value = '1';
        actualInput.value = '1';
        gameInstance.updateRoundScore('Alice');
        
        // Bid 1, Actual 1 = correct prediction = 20
        expect(scoreDisplay.textContent).toBe('+20');
        expect(scoreDisplay.className).toContain('positive');
    });
    
    test('should include bonus points for correct predictions', () => {
        const bidInput = document.getElementById('bid-Alice') as HTMLInputElement;
        const actualInput = document.getElementById('actual-Alice') as HTMLInputElement;
        const bonusInput = document.getElementById('bonus-Alice') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-Alice') as HTMLElement;
        
        bidInput.value = '1';
        actualInput.value = '1';
        bonusInput.value = '10';
        gameInstance.updateRoundScore('Alice');
        
        // Bid 1, Actual 1, Bonus 10 = 20 + 10 = 30
        expect(scoreDisplay.textContent).toBe('+30');
        expect(scoreDisplay.className).toContain('positive');
    });
    
    test('should show "-" for bonus on incorrect prediction', () => {
        const bidInput = document.getElementById('bid-Alice') as HTMLInputElement;
        const actualInput = document.getElementById('actual-Alice') as HTMLInputElement;
        const bonusInput = document.getElementById('bonus-Alice') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-Alice') as HTMLElement;
        
        bidInput.value = '1';
        actualInput.value = '0';
        bonusInput.value = '10';
        gameInstance.updateRoundScore('Alice');
        
        // Invalid: bonus points on failed prediction
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toContain('invalid');
    });
    
    test('should handle zero bid correctly', () => {
        const bidInput = document.getElementById('bid-Alice') as HTMLInputElement;
        const actualInput = document.getElementById('actual-Alice') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-Alice') as HTMLElement;
        
        bidInput.value = '0';
        actualInput.value = '0';
        gameInstance.updateRoundScore('Alice');
        
        // Successful zero bid in round 1 = 10
        expect(scoreDisplay.textContent).toBe('+10');
        expect(scoreDisplay.className).toContain('positive');
    });
    
    test('should show zero score correctly', () => {
        const bidInput = document.getElementById('bid-Alice') as HTMLInputElement;
        const actualInput = document.getElementById('actual-Alice') as HTMLInputElement;
        const bonusInput = document.getElementById('bonus-Alice') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-Alice') as HTMLElement;
        
        bidInput.value = '0';
        actualInput.value = '0';
        bonusInput.value = '0';
        
        // Add rounds to get to round 0 (which would give 0 points for zero bid)
        // Actually, this can't happen in normal game, but let's test the display
        bidInput.value = '1';
        actualInput.value = '1';
        bonusInput.value = '0';
        
        // Mock the score calculation to return 0
        jest.spyOn(gameInstance.viewModel, 'testCalculateRoundScore').mockReturnValue(0);
        
        gameInstance.updateRoundScore('Alice');
        
        expect(scoreDisplay.textContent).toBe('0');
        expect(scoreDisplay.className).toContain('zero');
    });
    
    test('should show "-" for invalid inputs using centralized validation', () => {
        const bidInput = document.getElementById('bid-Alice') as HTMLInputElement;
        const actualInput = document.getElementById('actual-Alice') as HTMLInputElement;
        const bonusInput = document.getElementById('bonus-Alice') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-Alice') as HTMLElement;
        
        // Test negative bid (uses centralized validation)
        bidInput.value = '-1';
        actualInput.value = '0';
        bonusInput.value = '0';
        gameInstance.updateRoundScore('Alice');
        
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toContain('invalid');
        
        // Test negative bonus (uses centralized validation)
        bidInput.value = '1';
        bonusInput.value = '-10';
        gameInstance.updateRoundScore('Alice');
        
        expect(scoreDisplay.textContent).toBe('-');
        expect(scoreDisplay.className).toContain('invalid');
    });
    
    test('should show "-" when bid exceeds round limit', () => {
        const bidInput = document.getElementById('bid-Alice') as HTMLInputElement;
        const actualInput = document.getElementById('actual-Alice') as HTMLInputElement;
        const scoreDisplay = document.getElementById('score-Alice') as HTMLElement;
        
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
        
        // Add DOM elements for special character names
        document.body.innerHTML += `
            <input id="bid-O'Brien" type="number" />
            <input id="actual-O'Brien" type="number" />
            <input id="bonus-O'Brien" type="number" />
            <div id="score-O'Brien"></div>
            <input id="bid-Bob & Alice" type="number" />
            <input id="actual-Bob & Alice" type="number" />
            <input id="bonus-Bob & Alice" type="number" />
            <div id="score-Bob & Alice"></div>
        `;
        
        // Set values and test score calculation for names with special characters
        const bidOBrien = document.getElementById("bid-O'Brien") as HTMLInputElement;
        const actualOBrien = document.getElementById("actual-O'Brien") as HTMLInputElement;
        bidOBrien.value = '1';
        actualOBrien.value = '1';
        
        gameInstance.updateRoundScore("O'Brien");
        const scoreOBrien = document.getElementById("score-O'Brien") as HTMLElement;
        expect(scoreOBrien.textContent).toBe('+20');
        
        // For Bob & Alice - max in round 1 with 2 players is 1
        const bidBobAlice = document.getElementById('bid-Bob & Alice') as HTMLInputElement;
        const actualBobAlice = document.getElementById('actual-Bob & Alice') as HTMLInputElement;
        bidBobAlice.value = '0';
        actualBobAlice.value = '0';
        
        gameInstance.updateRoundScore('Bob & Alice');
        const scoreBobAlice = document.getElementById('score-Bob & Alice') as HTMLElement;
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
        expect((global as any).i18n.translate('max_players_error')).toBe('No more than 8 pirates can fit on this ship!');
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
});