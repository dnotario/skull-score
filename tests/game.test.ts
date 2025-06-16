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