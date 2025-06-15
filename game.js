class SkullKingGame {
    constructor() {
        this.storageKey = 'skullKingGameState';
        this.tempPlayers = [];
        this.modalConfirmCallback = null;
        this.state = this.loadState() || {
            players: [],
            rounds: [],
            currentRound: 1
        };
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.updateUI();
    }
    setupEventListeners() {
        // Landing page
        const newGameBtn = document.getElementById('new-game-btn');
        newGameBtn === null || newGameBtn === void 0 ? void 0 : newGameBtn.addEventListener('click', () => this.handleNewGame());
        // Player names setup
        const addPlayerBtn = document.getElementById('add-player-btn');
        addPlayerBtn === null || addPlayerBtn === void 0 ? void 0 : addPlayerBtn.addEventListener('click', () => this.addPlayer());
        const startGameBtn = document.getElementById('start-game-btn');
        startGameBtn === null || startGameBtn === void 0 ? void 0 : startGameBtn.addEventListener('click', () => this.handleStartGame());
        const cancelSetupBtn = document.getElementById('cancel-setup-btn');
        cancelSetupBtn === null || cancelSetupBtn === void 0 ? void 0 : cancelSetupBtn.addEventListener('click', () => this.showLanding());
        // In-game
        const newGameIngameBtn = document.getElementById('new-game-ingame-btn');
        newGameIngameBtn === null || newGameIngameBtn === void 0 ? void 0 : newGameIngameBtn.addEventListener('click', () => this.confirmNewGame());
        const addRoundBtn = document.getElementById('add-round-btn');
        addRoundBtn === null || addRoundBtn === void 0 ? void 0 : addRoundBtn.addEventListener('click', () => this.handleAddRound());
        // Modal
        const modalConfirm = document.getElementById('modal-confirm');
        modalConfirm === null || modalConfirm === void 0 ? void 0 : modalConfirm.addEventListener('click', () => this.handleModalConfirm());
        const modalCancel = document.getElementById('modal-cancel');
        modalCancel === null || modalCancel === void 0 ? void 0 : modalCancel.addEventListener('click', () => this.hideModal());
    }
    loadState() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : null;
    }
    saveState() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }
    updateUI() {
        if (this.state.players.length === 0) {
            this.showLanding();
        }
        else {
            this.showGame();
        }
    }
    showLanding() {
        var _a, _b, _c;
        (_a = document.getElementById('landing-section')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
        (_b = document.getElementById('player-names-section')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
        (_c = document.getElementById('game-section')) === null || _c === void 0 ? void 0 : _c.classList.add('hidden');
    }
    showPlayerSetup() {
        var _a, _b, _c;
        (_a = document.getElementById('landing-section')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = document.getElementById('player-names-section')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        (_c = document.getElementById('game-section')) === null || _c === void 0 ? void 0 : _c.classList.add('hidden');
        // Initialize with existing players or start fresh
        this.tempPlayers = this.state.players.map(p => p.name);
        if (this.tempPlayers.length === 0) {
            this.tempPlayers = [''];
        }
        this.updatePlayerInputs();
    }
    updatePlayerInputs() {
        const container = document.getElementById('player-names-inputs');
        if (!container)
            return;
        container.innerHTML = this.tempPlayers.map((name, index) => `
            <div class="player-name-input">
                <input type="text" id="player-${index}" placeholder="Enter pirate name..." value="${name}" onchange="game.updateTempPlayer(${index}, this.value)">
                <button class="btn btn-danger btn-small" onclick="game.removePlayer(${index})">Remove</button>
            </div>
        `).join('');
    }
    updateTempPlayer(index, value) {
        this.tempPlayers[index] = value;
    }
    addPlayer() {
        this.tempPlayers.push('');
        this.updatePlayerInputs();
    }
    removePlayer(index) {
        if (this.tempPlayers.length > 1) {
            this.tempPlayers.splice(index, 1);
            this.updatePlayerInputs();
        }
    }
    showGame() {
        var _a, _b, _c;
        (_a = document.getElementById('landing-section')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = document.getElementById('player-names-section')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
        (_c = document.getElementById('game-section')) === null || _c === void 0 ? void 0 : _c.classList.remove('hidden');
        this.updateScoreDisplay();
        this.updateRoundInputs();
        this.updatePreviousRounds();
        this.updateRoundNumber();
    }
    updateScoreDisplay() {
        const scoreDisplay = document.getElementById('score-display');
        if (!scoreDisplay)
            return;
        scoreDisplay.innerHTML = this.state.players.map(player => `
            <div class="player-score">
                <h4>${player.name}</h4>
                <div class="score-value">${player.score}</div>
            </div>
        `).join('');
    }
    updateRoundInputs() {
        const container = document.getElementById('round-inputs');
        if (!container)
            return;
        container.innerHTML = this.state.players.map(player => `
            <div class="player-round-input">
                <h4>${player.name}</h4>
                <div class="round-input-row">
                    <input type="number" id="bid-${player.name}" placeholder="Bid" min="0" max="${this.state.currentRound}">
                    <input type="number" id="actual-${player.name}" placeholder="Won" min="0" max="${this.state.currentRound}">
                    <input type="number" id="bonus-${player.name}" placeholder="Bonus" min="0">
                </div>
            </div>
        `).join('');
    }
    updateRoundNumber() {
        const roundNumber = document.getElementById('round-number');
        if (roundNumber) {
            roundNumber.textContent = this.state.currentRound.toString();
        }
    }
    updatePreviousRounds() {
        const container = document.getElementById('previous-rounds');
        if (!container)
            return;
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
    calculateRoundScore(bid, actual, bonus) {
        if (bid === actual) {
            if (bid === 0) {
                return 10 * this.state.currentRound + bonus;
            }
            else {
                return 20 * bid + bonus;
            }
        }
        else {
            return -10 * Math.abs(bid - actual);
        }
    }
    handleNewGame() {
        if (this.state.players.length > 0) {
            this.confirmNewGame();
        }
        else {
            this.showPlayerSetup();
        }
    }
    handleStartGame() {
        const players = [];
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
    handleAddRound() {
        const roundData = {
            roundNumber: this.state.currentRound,
            playerData: []
        };
        let totalWins = 0;
        const tempPlayerData = [];
        // First pass: collect data and validate
        for (const player of this.state.players) {
            const bidInput = document.getElementById(`bid-${player.name}`);
            const actualInput = document.getElementById(`actual-${player.name}`);
            const bonusInput = document.getElementById(`bonus-${player.name}`);
            const bid = parseInt((bidInput === null || bidInput === void 0 ? void 0 : bidInput.value) || '0');
            const actual = parseInt((actualInput === null || actualInput === void 0 ? void 0 : actualInput.value) || '0');
            const bonus = parseInt((bonusInput === null || bonusInput === void 0 ? void 0 : bonusInput.value) || '0');
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
    finishAddRound(roundData, tempPlayerData) {
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
            const bidInput = document.getElementById(`bid-${player.name}`);
            const actualInput = document.getElementById(`actual-${player.name}`);
            const bonusInput = document.getElementById(`bonus-${player.name}`);
            if (bidInput)
                bidInput.value = '';
            if (actualInput)
                actualInput.value = '';
            if (bonusInput)
                bonusInput.value = '';
        });
        this.state.rounds.push(roundData);
        this.state.currentRound++;
        this.saveState();
        this.updateUI();
    }
    confirmNewGame() {
        this.showModal('Start New Game?', 'This will end the current game. Are you sure?', true, () => {
            const keepNames = document.getElementById('keep-names-checkbox').checked;
            if (keepNames) {
                this.state.players.forEach(player => player.score = 0);
                this.state.rounds = [];
                this.state.currentRound = 1;
                this.saveState();
                this.showGame();
            }
            else {
                this.state = {
                    players: [],
                    rounds: [],
                    currentRound: 1
                };
                this.saveState();
                this.showLanding();
            }
        });
    }
    confirmDeleteRound() {
        this.showModal('Delete Last Round?', 'This will remove the last round and recalculate scores. Are you sure?', false, () => {
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
        });
    }
    showModal(title, message, showCheckbox, onConfirm) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const checkboxContainer = document.getElementById('modal-checkbox-container');
        if (modal && modalTitle && modalMessage && checkboxContainer) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            if (showCheckbox) {
                checkboxContainer.classList.remove('hidden');
            }
            else {
                checkboxContainer.classList.add('hidden');
            }
            modal.classList.remove('hidden');
            this.modalConfirmCallback = onConfirm;
        }
    }
    hideModal() {
        const modal = document.getElementById('modal');
        modal === null || modal === void 0 ? void 0 : modal.classList.add('hidden');
        this.modalConfirmCallback = null;
    }
    handleModalConfirm() {
        if (this.modalConfirmCallback) {
            this.modalConfirmCallback();
        }
        this.hideModal();
    }
}
// Initialize game
const game = new SkullKingGame();
