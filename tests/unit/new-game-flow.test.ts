/**
 * Test file for new game flow improvements
 */

// Mock DOM elements
const createMockElement = (id: string): HTMLElement => {
    const elem = document.createElement('div');
    elem.id = id;
    return elem;
};

// Mock localStorage
const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Import after mocking
import '../../build/runFiles/game.js';

describe('New Game Flow', () => {
    let game: any;
    let viewModel: any;

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
        
        // Clear localStorage
        localStorageMock.clear();
        
        // Set up DOM elements
        document.body.innerHTML = `
            <div id="modal" class="hidden">
                <h3 id="modal-title"></h3>
                <p id="modal-message"></p>
                <div id="modal-buttons">
                    <button id="modal-confirm"></button>
                    <button id="modal-cancel"></button>
                </div>
            </div>
            <div id="player-names-inputs"></div>
            <button id="add-player-btn"></button>
            <input type="radio" name="scoring-mode" value="normal" id="scoring-normal" checked>
            <input type="radio" name="scoring-mode" value="rascal" id="scoring-rascal">
        `;

        // Initialize game
        game = new (window as any).SkullKingGame();
        viewModel = game.getViewModel();
    });
    
    afterEach(() => {
        // Restore all mocks after each test
        jest.restoreAllMocks();
    });

    describe('Simplified New Game Modal', () => {
        it('should show simple Yes/No modal', () => {
            // Start a game first
            viewModel.setTempPlayers(['Jack', 'Anne']);
            viewModel.validateAndStartGame();
            
            // Confirm new game
            game.confirmNewGame();
            
            // Check modal is shown
            const modal = document.getElementById('modal');
            expect(modal?.classList.contains('hidden')).toBe(false);
        });

        it('should always keep names when confirming new game', () => {
            // Start a game
            viewModel.setTempPlayers(['Jack', 'Anne']);
            viewModel.validateAndStartGame();
            
            // Save the original names
            const originalNames = ['Jack', 'Anne'];
            
            // Set up for new game
            game.confirmNewGame();
            
            // Mock to check if names were preserved
            let preservedNames: string[] = [];
            const originalStartNewGame = viewModel.startNewGame;
            viewModel.startNewGame = function(keepNames: boolean) {
                expect(keepNames).toBe(true); // Should always be true now
                originalStartNewGame.call(this, keepNames);
                preservedNames = this.tempPlayers;
            };
            
            // Confirm modal
            game.handleModalConfirm();
            
            // Check that names were preserved
            expect(preservedNames).toEqual(originalNames);
        });
    });

    describe('Scoring Mode Visibility', () => {
        it('should maintain scoring mode selection when removing players', () => {
            // Select rascal mode
            const rascalRadio = document.getElementById('scoring-rascal') as HTMLInputElement;
            rascalRadio.checked = true;
            viewModel.setScoringMode('rascal');
            
            // Add players then remove them one by one
            viewModel.setTempPlayers(['Jack', 'Anne']);
            viewModel.removeTempPlayer(1); // Remove Anne
            viewModel.removeTempPlayer(0); // Remove Jack
            
            // Scoring mode should remain
            expect(viewModel.getScoringMode()).toBe('rascal');
        });

        it('should preserve scoring mode through new game flow', () => {
            // Start with rascal mode
            viewModel.setScoringMode('rascal');
            viewModel.setTempPlayers(['Jack', 'Anne']);
            viewModel.validateAndStartGame();
            
            // Start new game keeping names
            viewModel.startNewGame(true);
            
            // Mode should be preserved
            expect(viewModel.getScoringMode()).toBe('rascal');
        });
    });

    describe('Player Button Styling', () => {
        it('should have Add Pirate button visible', () => {
            const addBtn = document.getElementById('add-player-btn');
            expect(addBtn).toBeTruthy();
        });
    });
});