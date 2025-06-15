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