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
        const readScoresBtn = document.getElementById('read-scores-btn');
        readScoresBtn === null || readScoresBtn === void 0 ? void 0 : readScoresBtn.addEventListener('click', () => this.readScores());
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
                <button class="btn-remove" onclick="game.removePlayer(${index})" title="Remove player">✕</button>
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
        else {
            // If only one player, just clear the name
            this.tempPlayers[0] = '';
            const input = document.getElementById(`player-0`);
            if (input) {
                input.value = '';
            }
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
        // Validation
        const errors = [];
        // Check total wins
        if (totalWins !== this.state.currentRound) {
            errors.push(`Total wins (${totalWins}) must equal the round number (${this.state.currentRound})!`);
        }
        // Check bonus only allowed if wins > 0
        for (const data of tempPlayerData) {
            if (data.actual === 0 && data.bonus > 0) {
                errors.push(`${data.playerName} cannot have bonus points with 0 wins!`);
            }
        }
        if (errors.length > 0) {
            this.showValidationModal(errors);
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
        const playerNames = this.state.players.map(p => p.name).join(', ');
        this.showNewGameModal(playerNames);
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
        const modalOptions = document.getElementById('modal-options');
        const modalButtons = document.getElementById('modal-buttons');
        const confirmBtn = document.getElementById('modal-confirm');
        const cancelBtn = document.getElementById('modal-cancel');
        modal === null || modal === void 0 ? void 0 : modal.classList.add('hidden');
        modalOptions === null || modalOptions === void 0 ? void 0 : modalOptions.classList.add('hidden');
        modalButtons === null || modalButtons === void 0 ? void 0 : modalButtons.classList.remove('hidden');
        // Restore button states
        if (confirmBtn && cancelBtn) {
            confirmBtn.classList.remove('hidden');
            cancelBtn.textContent = 'Nay';
        }
        this.modalConfirmCallback = null;
    }
    handleModalConfirm() {
        if (this.modalConfirmCallback) {
            this.modalConfirmCallback();
        }
        this.hideModal();
    }
    showNewGameModal(playerNames) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const modalOptions = document.getElementById('modal-options');
        const modalButtons = document.getElementById('modal-buttons');
        const checkboxContainer = document.getElementById('modal-checkbox-container');
        if (modal && modalTitle && modalMessage && modalOptions && modalButtons && checkboxContainer) {
            modalTitle.textContent = 'Start New Game?';
            // Add warning about losing progress if rounds have been played
            let message = '';
            if (this.state.rounds.length > 0) {
                message = `⚠️ Warning: Starting a new game will erase ${this.state.rounds.length} rounds of progress!\n\n`;
            }
            message += 'Choose how to start your new game:';
            modalMessage.textContent = message;
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
    startNewGameSamePlayers() {
        this.state.players.forEach(player => player.score = 0);
        this.state.rounds = [];
        this.state.currentRound = 1;
        this.saveState();
        this.hideModal();
        this.showGame();
    }
    startNewGameNewPlayers() {
        this.state = {
            players: [],
            rounds: [],
            currentRound: 1
        };
        this.saveState();
        this.hideModal();
        this.showLanding();
    }
    readScores() {
        var _a;
        // Check if browser supports speech synthesis
        if (!('speechSynthesis' in window)) {
            alert('Arr! Yer browser doesn\'t support speech. Try a newer vessel!');
            return;
        }
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        // Sort players by score (highest first)
        const sortedPlayers = [...this.state.players].sort((a, b) => b.score - a.score);
        // Build the announcement
        let announcement = `Ahoy mateys! Here be the current standings after round ${this.state.currentRound - 1}. `;
        sortedPlayers.forEach((player, index) => {
            if (index === 0) {
                announcement += `Leading the crew be ${player.name} with ${player.score} pieces of eight! `;
            }
            else if (index === sortedPlayers.length - 1) {
                announcement += `And ${player.name} be at ${player.score}. `;
            }
            else {
                announcement += `${player.name} has ${player.score}. `;
            }
        });
        // Add flavor based on game state
        if (this.state.rounds.length === 0) {
            announcement = "Ahoy! No rounds played yet. Time to start plunderin'!";
        }
        else if (sortedPlayers[0].score > sortedPlayers[sortedPlayers.length - 1].score + 50) {
            announcement += "Shiver me timbers! Someone be runnin' away with the treasure!";
        }
        else if (sortedPlayers[0].score === ((_a = sortedPlayers[1]) === null || _a === void 0 ? void 0 : _a.score)) {
            announcement += "Blimey! We have a tie for the lead!";
        }
        // Create and configure the utterance
        const utterance = new SpeechSynthesisUtterance(announcement);
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 0.9; // Slightly lower for pirate voice
        utterance.volume = 1;
        // Try to use an English voice
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (englishVoice) {
            utterance.voice = englishVoice;
        }
        // Speak!
        window.speechSynthesis.speak(utterance);
    }
    showValidationModal(errors) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const modalOptions = document.getElementById('modal-options');
        const modalButtons = document.getElementById('modal-buttons');
        const checkboxContainer = document.getElementById('modal-checkbox-container');
        if (modal && modalTitle && modalMessage && modalOptions && modalButtons && checkboxContainer) {
            modalTitle.textContent = '⚠️ Round Validation Failed';
            modalMessage.textContent = errors.join('\n\n');
            checkboxContainer.classList.add('hidden');
            modalOptions.classList.add('hidden');
            modalButtons.classList.remove('hidden');
            // Hide the confirm button, only show cancel
            const confirmBtn = document.getElementById('modal-confirm');
            const cancelBtn = document.getElementById('modal-cancel');
            if (confirmBtn && cancelBtn) {
                confirmBtn.classList.add('hidden');
                cancelBtn.textContent = 'Fix Issues';
            }
            modal.classList.remove('hidden');
        }
    }
}
// Initialize game
const game = new SkullKingGame();
