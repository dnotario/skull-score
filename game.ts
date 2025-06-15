interface Player {
    name: string;
    score: number;
}

interface RoundData {
    roundNumber: number;
    playerData: PlayerRoundData[];
}

interface PlayerRoundData {
    playerName: string;
    bid: number;
    actual: number;
    bonus: number;
    roundScore: number;
}

interface GameState {
    players: Player[];
    rounds: RoundData[];
    currentRound: number;
}

class SkullKingGame {
    private state: GameState;
    private storageKey = 'skullKingGameState';

    constructor() {
        this.state = this.loadState() || {
            players: [],
            rounds: [],
            currentRound: 1
        };
        this.init();
    }

    private init(): void {
        this.setupEventListeners();
        this.updateUI();
    }

    private setupEventListeners(): void {
        // Landing page
        const newGameBtn = document.getElementById('new-game-btn');
        newGameBtn?.addEventListener('click', () => this.handleNewGame());

        // Player names setup
        const addPlayerBtn = document.getElementById('add-player-btn');
        addPlayerBtn?.addEventListener('click', () => this.addPlayer());

        const startGameBtn = document.getElementById('start-game-btn');
        startGameBtn?.addEventListener('click', () => this.handleStartGame());

        const cancelSetupBtn = document.getElementById('cancel-setup-btn');
        cancelSetupBtn?.addEventListener('click', () => this.showLanding());

        // In-game
        const newGameIngameBtn = document.getElementById('new-game-ingame-btn');
        newGameIngameBtn?.addEventListener('click', () => this.confirmNewGame());

        const addRoundBtn = document.getElementById('add-round-btn');
        addRoundBtn?.addEventListener('click', () => this.handleAddRound());

        // Modal
        const modalConfirm = document.getElementById('modal-confirm');
        modalConfirm?.addEventListener('click', () => this.handleModalConfirm());

        const modalCancel = document.getElementById('modal-cancel');
        modalCancel?.addEventListener('click', () => this.hideModal());
    }

    private loadState(): GameState | null {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : null;
    }

    private saveState(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    private updateUI(): void {
        if (this.state.players.length === 0) {
            this.showLanding();
        } else {
            this.showGame();
        }
    }

    private showLanding(): void {
        document.getElementById('landing-section')?.classList.remove('hidden');
        document.getElementById('player-names-section')?.classList.add('hidden');
        document.getElementById('game-section')?.classList.add('hidden');
    }

    private tempPlayers: string[] = [];

    private showPlayerSetup(): void {
        document.getElementById('landing-section')?.classList.add('hidden');
        document.getElementById('player-names-section')?.classList.remove('hidden');
        document.getElementById('game-section')?.classList.add('hidden');

        // Initialize with existing players or start fresh
        this.tempPlayers = this.state.players.map(p => p.name);
        if (this.tempPlayers.length === 0) {
            this.tempPlayers = [''];
        }
        this.updatePlayerInputs();
    }

    private updatePlayerInputs(): void {
        const container = document.getElementById('player-names-inputs');
        if (!container) return;

        container.innerHTML = this.tempPlayers.map((name, index) => `
            <div class="player-name-input">
                <input type="text" id="player-${index}" placeholder="Enter pirate name..." value="${name}" onchange="game.updateTempPlayer(${index}, this.value)">
                <button class="btn-remove" onclick="game.removePlayer(${index})" title="Remove player">✕</button>
            </div>
        `).join('');
    }

    public updateTempPlayer(index: number, value: string): void {
        this.tempPlayers[index] = value;
    }

    private addPlayer(): void {
        this.tempPlayers.push('');
        this.updatePlayerInputs();
    }

    public removePlayer(index: number): void {
        if (this.tempPlayers.length > 1) {
            this.tempPlayers.splice(index, 1);
            this.updatePlayerInputs();
        }
    }

    private showGame(): void {
        document.getElementById('landing-section')?.classList.add('hidden');
        document.getElementById('player-names-section')?.classList.add('hidden');
        document.getElementById('game-section')?.classList.remove('hidden');

        this.updateScoreDisplay();
        this.updateRoundInputs();
        this.updatePreviousRounds();
        this.updateRoundNumber();
    }

    private updateScoreDisplay(): void {
        const scoreDisplay = document.getElementById('score-display');
        if (!scoreDisplay) return;

        scoreDisplay.innerHTML = this.state.players.map(player => `
            <div class="player-score">
                <h4>${player.name}</h4>
                <div class="score-value">${player.score}</div>
            </div>
        `).join('');
    }

    private updateRoundInputs(): void {
        const container = document.getElementById('round-inputs');
        if (!container) return;

        container.innerHTML = this.state.players.map(player => `
            <div class="player-round-input">
                <h4>${player.name}</h4>
                <div class="round-input-row">
                    <div class="input-group">
                        <label for="bid-${player.name}" class="input-label">Bid</label>
                        <input type="number" id="bid-${player.name}" placeholder="0" min="0" max="${this.state.currentRound}">
                    </div>
                    <div class="input-group">
                        <label for="actual-${player.name}" class="input-label">Won</label>
                        <input type="number" id="actual-${player.name}" placeholder="0" min="0" max="${this.state.currentRound}">
                    </div>
                    <div class="input-group">
                        <label for="bonus-${player.name}" class="input-label">Bonus</label>
                        <input type="number" id="bonus-${player.name}" placeholder="0" min="0">
                    </div>
                </div>
            </div>
        `).join('');
    }

    private updateRoundNumber(): void {
        const roundNumber = document.getElementById('round-number');
        if (roundNumber) {
            roundNumber.textContent = this.state.currentRound.toString();
        }
    }

    private updatePreviousRounds(): void {
        const container = document.getElementById('previous-rounds');
        if (!container) return;

        container.innerHTML = this.state.rounds
            .slice()
            .reverse()
            .map((round, index) => `
                <div class="round-display parchment">
                    <div class="round-header">
                        <h3>Round ${round.roundNumber}</h3>
                        ${index === 0 ? '<button class="btn btn-danger" onclick="game.confirmDeleteRound()">Delete Round</button>' : ''}
                    </div>
                    <div class="round-data">
                        ${round.playerData.map(data => `
                            <div class="player-round-data">
                                <strong>${data.playerName}</strong>
                                <span>Bid: ${data.bid}</span>
                                <span>Won: ${data.actual}</span>
                                <span>Bonus: ${data.bonus}</span>
                                <span>Score: ${data.roundScore > 0 ? '+' : ''}${data.roundScore}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
    }

    private calculateRoundScore(bid: number, actual: number, bonus: number): number {
        if (bid === actual) {
            if (bid === 0) {
                return 10 * this.state.currentRound + bonus;
            } else {
                return 20 * bid + bonus;
            }
        } else {
            return -10 * Math.abs(bid - actual);
        }
    }

    private handleNewGame(): void {
        if (this.state.players.length > 0) {
            this.confirmNewGame();
        } else {
            this.showPlayerSetup();
        }
    }

    private handleStartGame(): void {
        const players: Player[] = [];

        // Filter out empty names and create players
        this.tempPlayers.forEach((name, index) => {
            const trimmedName = name.trim();
            if (trimmedName) {
                players.push({ name: trimmedName, score: 0 });
            }
        });

        if (players.length < 2) {
            alert('Ye need at least 2 pirates to play!');
            return;
        }

        this.state = {
            players,
            rounds: [],
            currentRound: 1
        };

        this.saveState();
        this.showGame();
    }

    private handleAddRound(): void {
        const roundData: RoundData = {
            roundNumber: this.state.currentRound,
            playerData: []
        };

        let totalWins = 0;
        const tempPlayerData: PlayerRoundData[] = [];

        // First pass: collect data and validate
        for (const player of this.state.players) {
            const bidInput = document.getElementById(`bid-${player.name}`) as HTMLInputElement;
            const actualInput = document.getElementById(`actual-${player.name}`) as HTMLInputElement;
            const bonusInput = document.getElementById(`bonus-${player.name}`) as HTMLInputElement;

            const bid = parseInt(bidInput?.value || '0');
            const actual = parseInt(actualInput?.value || '0');
            const bonus = parseInt(bonusInput?.value || '0');

            totalWins += actual;

            const roundScore = this.calculateRoundScore(bid, actual, bonus);

            tempPlayerData.push({
                playerName: player.name,
                bid,
                actual,
                bonus,
                roundScore
            });
        }

        // Validation - total wins must match round number
        if (totalWins !== this.state.currentRound) {
            alert(`Total wins (${totalWins}) must equal the round number (${this.state.currentRound})!`);
            return;
        }

        this.finishAddRound(roundData, tempPlayerData);
    }

    private finishAddRound(roundData: RoundData, tempPlayerData: PlayerRoundData[]): void {
        // Update player scores and round data
        tempPlayerData.forEach(data => {
            const player = this.state.players.find(p => p.name === data.playerName);
            if (player) {
                player.score += data.roundScore;
            }
            roundData.playerData.push(data);
        });

        // Clear inputs
        this.state.players.forEach(player => {
            const bidInput = document.getElementById(`bid-${player.name}`) as HTMLInputElement;
            const actualInput = document.getElementById(`actual-${player.name}`) as HTMLInputElement;
            const bonusInput = document.getElementById(`bonus-${player.name}`) as HTMLInputElement;
            
            if (bidInput) bidInput.value = '';
            if (actualInput) actualInput.value = '';
            if (bonusInput) bonusInput.value = '';
        });

        this.state.rounds.push(roundData);
        this.state.currentRound++;
        this.saveState();
        this.updateUI();
    }

    private confirmNewGame(): void {
        const playerNames = this.state.players.map(p => p.name).join(', ');
        this.showNewGameModal(playerNames);
    }

    public confirmDeleteRound(): void {
        this.showModal(
            'Delete Last Round?',
            'This will remove the last round and recalculate scores. Are you sure?',
            false,
            () => {
                if (this.state.rounds.length > 0) {
                    const lastRound = this.state.rounds.pop();
                    if (lastRound) {
                        // Recalculate scores
                        this.state.players.forEach(player => {
                            player.score = 0;
                        });

                        this.state.rounds.forEach(round => {
                            round.playerData.forEach(data => {
                                const player = this.state.players.find(p => p.name === data.playerName);
                                if (player) {
                                    player.score += data.roundScore;
                                }
                            });
                        });

                        this.state.currentRound--;
                        this.saveState();
                        this.updateUI();
                    }
                }
            }
        );
    }

    private showModal(title: string, message: string, showCheckbox: boolean, onConfirm: () => void): void {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const checkboxContainer = document.getElementById('modal-checkbox-container');

        if (modal && modalTitle && modalMessage && checkboxContainer) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            
            if (showCheckbox) {
                checkboxContainer.classList.remove('hidden');
            } else {
                checkboxContainer.classList.add('hidden');
            }

            modal.classList.remove('hidden');
            this.modalConfirmCallback = onConfirm;
        }
    }

    public hideModal(): void {
        const modal = document.getElementById('modal');
        const modalOptions = document.getElementById('modal-options');
        const modalButtons = document.getElementById('modal-buttons');
        
        modal?.classList.add('hidden');
        modalOptions?.classList.add('hidden');
        modalButtons?.classList.remove('hidden');
        this.modalConfirmCallback = null;
    }

    private modalConfirmCallback: (() => void) | null = null;

    private handleModalConfirm(): void {
        if (this.modalConfirmCallback) {
            this.modalConfirmCallback();
        }
        this.hideModal();
    }

    private showNewGameModal(playerNames: string): void {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const modalOptions = document.getElementById('modal-options');
        const modalButtons = document.getElementById('modal-buttons');
        const checkboxContainer = document.getElementById('modal-checkbox-container');

        if (modal && modalTitle && modalMessage && modalOptions && modalButtons && checkboxContainer) {
            modalTitle.textContent = 'Start New Game?';
            modalMessage.textContent = 'Choose how to start your new game:';
            
            checkboxContainer.classList.add('hidden');
            modalButtons.classList.add('hidden');
            modalOptions.classList.remove('hidden');
            
            modalOptions.innerHTML = `
                <button class="btn btn-primary" onclick="game.startNewGameSamePlayers()">
                    Same players (${playerNames})
                </button>
                <button class="btn btn-secondary" onclick="game.startNewGameNewPlayers()">
                    New set of players
                </button>
                <button class="btn btn-secondary" onclick="game.hideModal()">
                    Cancel
                </button>
            `;
            
            modal.classList.remove('hidden');
        }
    }

    public startNewGameSamePlayers(): void {
        this.state.players.forEach(player => player.score = 0);
        this.state.rounds = [];
        this.state.currentRound = 1;
        this.saveState();
        this.hideModal();
        this.showGame();
    }

    public startNewGameNewPlayers(): void {
        this.state = {
            players: [],
            rounds: [],
            currentRound: 1
        };
        this.saveState();
        this.hideModal();
        this.showLanding();
    }
}

// Initialize game
const game = new SkullKingGame();