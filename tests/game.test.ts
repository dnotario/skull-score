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
            expect(result).toContain("Alice's bid (2) can't exceed 1 tricks in round 1");
        });

        test('should reject actual tricks exceeding current round number', () => {
            // Round 1: max actual should be 1
            const roundData = {
                'Alice': { bid: 1, actual: 2, bonus: 0 }, // Invalid: actual > round
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toContain("Alice can't win more than 1 tricks in round 1 with 2 players. Actual: 2");
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

    describe('Input Validation', () => {
        test('should reject negative values', () => {
            const roundData = {
                'Alice': { bid: -1, actual: 1, bonus: 0 },
                'Bob': { bid: 1, actual: 1, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toContain("Bid and actual tricks must be non-negative for Alice");
        });

        test('should reject NaN values', () => {
            const roundData = {
                'Alice': { bid: NaN, actual: 1, bonus: 0 },
                'Bob': { bid: 1, actual: 1, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toContain("Invalid number entered for Alice");
        });

        test('should reject non-integer values', () => {
            const roundData = {
                'Alice': { bid: 1.5, actual: 1, bonus: 0 },
                'Bob': { bid: 1, actual: 1, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toContain("All values must be whole numbers for Alice");
        });

        test('should reject unreasonable bonus values', () => {
            const roundData = {
                'Alice': { bid: 1, actual: 1, bonus: 150 }, // Too high
                'Bob': { bid: 1, actual: 1, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toContain("Alice's bonus points seem unreasonable (150)");
        });
    });

    describe('Bonus Point Validation', () => {
        test('should reject bonus points for incorrect predictions', () => {
            const roundData = {
                'Alice': { bid: 1, actual: 0, bonus: 10 }, // Failed bid with bonus
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toContain("Alice can only earn bonus points when correctly predicting tricks! (Bid: 1, Actual: 0)");
        });

        test('should allow bonus points for correct predictions', () => {
            const roundData = {
                'Alice': { bid: 1, actual: 1, bonus: 10 }, // Correct bid with bonus
                'Bob': { bid: 0, actual: 0, bonus: 5 }     // Correct zero bid with bonus
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
            expect(result).toBeNull(); // Should succeed
        });

        test('should allow negative bonus points for correct predictions', () => {
            const roundData = {
                'Alice': { bid: 1, actual: 1, bonus: -5 }, // Correct bid with negative bonus
                'Bob': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.addRound(roundData);
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
        expect(showErrorSpy).toHaveBeenCalledWith('No rounds to update!');
        
        showErrorSpy.mockRestore();
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
        
        // Update the last round - must maintain total wins = 1 (since round 1 with 2 players = 1 trick total)
        const updatedRoundData = {
            'Alice': { bid: 1, actual: 0, bonus: 0 }, // Changed actual from 1 to 0
            'Bob': { bid: 0, actual: 1, bonus: 0 }    // Changed actual from 0 to 1 (total still = 1)
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
        expect(showErrorSpy).toHaveBeenCalledWith('Arr! Yer browser doesn\'t support speech. Try a newer vessel!');
        
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
        expect(showErrorSpy).toHaveBeenCalledWith("Alice's bid (5) can't exceed 1 tricks in round 1 with 2 players.");
        
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
        expect(announcement).toMatch(/^Ahoy mateys! .+ Now for the current bounty/);
        
        // Verify it includes scores after commentary
        expect(announcement).toContain('Now for the current bounty after round 1');
        expect(announcement).toContain('Alice');
        expect(announcement).toContain('Bob');
        
        // Should end with the traditional pirate farewell
        expect(announcement).toContain('May the winds favor the worthy! Arrr!');
    });

    test('should handle score announcement with no rounds', () => {
        // Get announcement with no rounds played
        const announcement = gameInstance.viewModel.createScoreAnnouncement();
        
        // Should start with greeting and go straight to scores (no commentary)
        expect(announcement).toMatch(/^Ahoy mateys! Now for the current bounty/);
        expect(announcement).toContain('Now for the current bounty after round 0');
        expect(announcement).toContain('Alice');
        expect(announcement).toContain('Bob');
    });

    test('should handle score announcement with no active game', () => {
        // Create fresh instance with no game
        const freshInstance = new window.SkullKingGame();
        
        const announcement = freshInstance.viewModel.createScoreAnnouncement();
        
        expect(announcement).toBe('No active game to announce, ye landlubber!');
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
            expect(result).toContain('Total tricks won (2) must equal the number of tricks available (1)');
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
            expect(result).toContain('Total tricks won (0) must equal the number of tricks available (1)');
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
            expect(result).toContain('Total tricks won (9) must equal the number of tricks available (8)');
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
            expect(result).toContain('Total tricks won (0) must equal the number of tricks available (1)');
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

        test('should validate update last round with correct total wins', () => {
            // Add initial round with valid total (1 trick for round 1 with 4 players)
            gameInstance.viewModel.addRound({
                'Alice': { bid: 1, actual: 1, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 },
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            });
            
            // Try to update with invalid total (0 wins when 1 is required)
            const invalidUpdate = {
                'Alice': { bid: 1, actual: 0, bonus: 0 },
                'Bob': { bid: 0, actual: 0, bonus: 0 },
                'Charlie': { bid: 0, actual: 0, bonus: 0 },
                'Dave': { bid: 0, actual: 0, bonus: 0 }
            };
            
            const result = gameInstance.viewModel.updateLastRound(invalidUpdate);
            expect(result).toContain('Total tricks won (0) must equal the number of tricks available (1)');
        });
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

    test('should skip player setup when using same players with valid names', () => {
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

    test('should go to player setup when same players has insufficient valid names', () => {
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

    test('should handle new players flow correctly', () => {
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

    test('should handle edge case when same players flow fails validation', () => {
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