"use strict";
/**
 * GameState - Handles data persistence and storage
 * Pure data layer that only manages localStorage operations
 */
class GameState {
    constructor() {
        this.storageKey = 'skullKingGameState';
    }
    load() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : null;
    }
    save(state) {
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }
    clear() {
        localStorage.removeItem(this.storageKey);
    }
    getDefaultState() {
        return {
            players: [],
            rounds: [],
            currentRound: 1
        };
    }
}
/**
 * GameViewModel - Contains all business logic and state management
 * Manages game rules, scoring calculations, validation, and analytics
 */
class GameViewModel {
    constructor() {
        this.tempPlayers = [];
        this.modalConfirmCallback = null;
        this.gameState = new GameState();
        this.state = this.gameState.load() || this.gameState.getDefaultState();
    }
    // State Management
    getGameState() {
        return Object.assign({}, this.state);
    }
    saveState() {
        this.gameState.save(this.state);
    }
    clearState() {
        this.gameState.clear();
        this.state = this.gameState.getDefaultState();
    }
    // Player Management
    getTempPlayers() {
        return [...this.tempPlayers];
    }
    initializeTempPlayers() {
        this.tempPlayers = this.state.players.map(p => p.name);
        if (this.tempPlayers.length === 0) {
            this.tempPlayers = [''];
        }
    }
    updateTempPlayer(index, value) {
        this.tempPlayers[index] = value;
    }
    addTempPlayer() {
        this.tempPlayers.push('');
    }
    removeTempPlayer(index) {
        if (this.tempPlayers.length > 1) {
            this.tempPlayers.splice(index, 1);
        }
        else {
            this.tempPlayers[0] = '';
        }
    }
    setTempPlayers(players) {
        this.tempPlayers = [...players];
    }
    validateAndStartGame() {
        const validNames = this.tempPlayers.filter(name => name.trim() !== '');
        if (validNames.length < 2) {
            return 'Ye need at least 2 pirates to sail these waters!';
        }
        if (validNames.length > 8) {
            return 'Too many pirates! Maximum 8 scallywags allowed.';
        }
        // Check for duplicate names
        const uniqueNames = new Set(validNames.map(name => name.trim().toLowerCase()));
        if (uniqueNames.size !== validNames.length) {
            return 'Each pirate needs a unique name, ye scurvy dogs!';
        }
        // Initialize game state
        this.state.players = validNames.map(name => ({ name: name.trim(), score: 0 }));
        this.state.rounds = [];
        this.state.currentRound = 1;
        this.saveState();
        // Track analytics
        this.trackEvent('game_start', {
            player_count: this.state.players.length
        });
        return null; // Success
    }
    // Scoring Logic
    calculateRoundScore(bid, actual, bonus, roundNumber) {
        if (bid === 0) {
            // Zero bid scoring
            return actual === 0 ? 10 * roundNumber + bonus : -10 * roundNumber;
        }
        else {
            // Non-zero bid scoring
            if (bid === actual) {
                // Correct prediction: 20 points per trick + bonus
                return 20 * actual + bonus;
            }
            else {
                // Incorrect prediction: -10 points per difference (no bonus)
                return -10 * Math.abs(bid - actual);
            }
        }
    }
    // Round Management
    getCurrentRoundNumber() {
        return this.state.currentRound;
    }
    validateRoundData(data) {
        for (const [playerName, playerData] of Object.entries(data)) {
            const { bid, actual, bonus } = playerData;
            // Check for invalid numbers (NaN)
            if (isNaN(bid) || isNaN(actual) || isNaN(bonus)) {
                return `Invalid number entered for ${playerName}. Please enter valid numbers only.`;
            }
            // Integer validation (check first)
            if (!Number.isInteger(bid) || !Number.isInteger(actual) || !Number.isInteger(bonus)) {
                return `All values must be whole numbers for ${playerName}.`;
            }
            // Basic validation
            if (bid < 0 || actual < 0) {
                return `Bid and actual tricks must be non-negative for ${playerName}.`;
            }
            // Round-specific validation: bids and actual tricks can't exceed round number
            if (bid > this.state.currentRound) {
                return `${playerName}'s bid (${bid}) can't exceed ${this.state.currentRound} tricks in round ${this.state.currentRound}.`;
            }
            if (actual > this.state.currentRound) {
                return `${playerName} can't win more than ${this.state.currentRound} tricks in round ${this.state.currentRound}. Actual: ${actual}`;
            }
            // Bonus point validation - only applies when correctly predicting tricks
            if (bid !== actual && bonus > 0) {
                return `${playerName} can only earn bonus points when correctly predicting tricks! (Bid: ${bid}, Actual: ${actual})`;
            }
            // Reasonable bonus limits
            if (Math.abs(bonus) > 100) {
                return `${playerName}'s bonus points seem unreasonable (${bonus}). Please check your entry.`;
            }
        }
        return null; // Valid
    }
    addRound(data) {
        const validationError = this.validateRoundData(data);
        if (validationError) {
            return validationError;
        }
        const roundData = {
            roundNumber: this.state.currentRound,
            playerData: []
        };
        // Process each player's data
        for (const player of this.state.players) {
            const playerRoundData = data[player.name];
            const roundScore = this.calculateRoundScore(playerRoundData.bid, playerRoundData.actual, playerRoundData.bonus, this.state.currentRound);
            roundData.playerData.push({
                playerName: player.name,
                bid: playerRoundData.bid,
                actual: playerRoundData.actual,
                bonus: playerRoundData.bonus,
                roundScore
            });
            // Update player's total score
            player.score += roundScore;
        }
        this.state.rounds.push(roundData);
        this.state.currentRound++;
        this.saveState();
        // Track analytics
        this.trackEvent('round_complete', {
            round_number: roundData.roundNumber,
            player_count: this.state.players.length
        });
        return null; // Success
    }
    updateLastRound(data) {
        if (this.state.rounds.length === 0) {
            return 'No rounds to update!';
        }
        const validationError = this.validateRoundData(data);
        if (validationError) {
            return validationError;
        }
        const lastRound = this.state.rounds[this.state.rounds.length - 1];
        // Revert old scores
        for (const oldPlayerData of lastRound.playerData) {
            const player = this.state.players.find(p => p.name === oldPlayerData.playerName);
            if (player) {
                player.score -= oldPlayerData.roundScore;
            }
        }
        // Apply new scores
        lastRound.playerData = [];
        for (const player of this.state.players) {
            const playerRoundData = data[player.name];
            const roundScore = this.calculateRoundScore(playerRoundData.bid, playerRoundData.actual, playerRoundData.bonus, lastRound.roundNumber);
            lastRound.playerData.push({
                playerName: player.name,
                bid: playerRoundData.bid,
                actual: playerRoundData.actual,
                bonus: playerRoundData.bonus,
                roundScore
            });
            player.score += roundScore;
        }
        this.saveState();
        // Track analytics
        this.trackEvent('round_updated', {
            round_number: lastRound.roundNumber
        });
        return null; // Success
    }
    getLastRoundData() {
        if (this.state.rounds.length === 0) {
            return null;
        }
        const lastRound = this.state.rounds[this.state.rounds.length - 1];
        const result = {};
        for (const playerData of lastRound.playerData) {
            result[playerData.playerName] = {
                bid: playerData.bid,
                actual: playerData.actual,
                bonus: playerData.bonus
            };
        }
        return result;
    }
    // Modal Management
    setModalConfirmCallback(callback) {
        this.modalConfirmCallback = callback;
    }
    executeModalConfirm() {
        if (this.modalConfirmCallback) {
            this.modalConfirmCallback();
            this.modalConfirmCallback = null;
        }
    }
    // New Game Logic
    startNewGame(keepNames) {
        const existingNames = keepNames ? this.state.players.map(p => p.name) : [];
        this.clearState();
        if (existingNames.length > 0) {
            this.tempPlayers = [...existingNames];
        }
        else {
            this.tempPlayers = [''];
        }
        // Track analytics
        this.trackEvent('new_game_started', {
            kept_names: keepNames,
            player_count: existingNames.length
        });
    }
    // Analytics
    trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
    }
    // Game Status
    isGameActive() {
        return this.state.players.length > 0;
    }
    isGameComplete() {
        return this.state.currentRound > 10;
    }
    hasRounds() {
        return this.state.rounds.length > 0;
    }
    getPlayerCount() {
        return this.state.players.length;
    }
    getRoundCount() {
        return this.state.rounds.length;
    }
    // Commentary generation
    generateCommentary() {
        if (this.state.rounds.length === 0) {
            return '';
        }
        const lastRound = this.state.rounds[this.state.rounds.length - 1];
        const perfectPlayers = lastRound.playerData.filter(p => p.bid === p.actual);
        const disasters = lastRound.playerData.filter(p => Math.abs(p.bid - p.actual) >= 3);
        const bigScores = lastRound.playerData.filter(p => p.roundScore >= 40);
        // Perfect round (everyone got their bid)
        if (perfectPlayers.length === this.state.players.length) {
            const comments = [
                "Blimey! Every scallywag nailed their bid! The sea gods smile upon ye all!",
                "Shiver me timbers! Perfect round for all hands! Not a single miscalculation!",
                "Avast! Every pirate sailed true to their word! What sorcery be this?"
            ];
            return comments[Math.floor(Math.random() * comments.length)];
        }
        // Single disaster
        if (disasters.length === 1) {
            const player = disasters[0];
            const comments = [
                `Avast! ${player.playerName} be sinkin' faster than a ship with no hull!`,
                `${player.playerName} just sailed straight into a kraken! What a disaster!`,
                `Blimey! ${player.playerName} be drownin' in their own overconfidence!`
            ];
            return comments[Math.floor(Math.random() * comments.length)];
        }
        // Multiple big scores
        if (bigScores.length >= 2) {
            const comments = [
                "Pieces of eight! Multiple pirates be strikin' gold this round!",
                "Shiver me timbers! Several captains just filled their treasure chests!",
                "Multiple pirates be countin' serious doubloons after that performance!"
            ];
            return comments[Math.floor(Math.random() * comments.length)];
        }
        // Default commentary
        const defaultComments = [
            "Another round in the books! The seas be unpredictable as always!",
            "The tide turns with each round! Stay sharp, ye scurvy dogs!",
            "Mixed fortunes this round! The ocean gives and takes as she pleases!"
        ];
        return defaultComments[Math.floor(Math.random() * defaultComments.length)];
    }
    // Text-to-Speech
    createScoreAnnouncement() {
        if (this.state.players.length === 0) {
            return "No active game to announce, ye landlubber!";
        }
        let announcement = "Ahoy mateys! ";
        // Add the pirate commentary from the last round first if available
        const commentary = this.generateCommentary();
        if (commentary) {
            announcement += `${commentary} `;
        }
        const sortedPlayers = [...this.state.players].sort((a, b) => b.score - a.score);
        announcement += `Now for the current bounty after round ${this.state.rounds.length}... `;
        sortedPlayers.forEach((player, index) => {
            if (index === 0) {
                announcement += `Leading the fleet, we have ${player.name} with ${player.score} pieces of eight! `;
            }
            else if (index === sortedPlayers.length - 1 && sortedPlayers.length > 2) {
                announcement += `And bringing up the rear, ${player.name} with ${player.score} doubloons. `;
            }
            else {
                announcement += `${player.name} follows with ${player.score} gold coins. `;
            }
        });
        announcement += "May the winds favor the worthy! Arrr!";
        return announcement;
    }
    // Public method for testing
    testCalculateRoundScore(bid, actual, bonus, roundNumber) {
        return this.calculateRoundScore(bid, actual, bonus, roundNumber);
    }
}
/**
 * SkullKingGame - Main game controller using MVVM architecture
 * Coordinates between ViewModel (business logic) and DOM (view)
 */
class SkullKingGame {
    constructor() {
        this.viewModel = new GameViewModel();
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
        addPlayerBtn === null || addPlayerBtn === void 0 ? void 0 : addPlayerBtn.addEventListener('click', () => this.handleAddPlayer());
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
    // Event Handlers
    handleNewGame() {
        if (this.viewModel.isGameActive()) {
            this.confirmNewGame();
        }
        else {
            this.startPlayerSetup();
        }
    }
    handleAddPlayer() {
        const tempPlayers = this.viewModel.getTempPlayers();
        if (tempPlayers.length >= 8) {
            this.showError('Maximum 8 pirates allowed! Can\'t add more players.');
            return;
        }
        this.viewModel.addTempPlayer();
        this.updatePlayerInputs();
    }
    handleStartGame() {
        const error = this.viewModel.validateAndStartGame();
        if (error) {
            this.showError(error);
            return;
        }
        this.updateUI();
    }
    handleAddRound() {
        const gameState = this.viewModel.getGameState();
        const roundData = this.collectRoundData(gameState.players);
        const error = this.viewModel.addRound(roundData);
        if (error) {
            this.showError(error);
            return;
        }
        this.updateUI();
        this.clearRoundInputs();
        this.showCommentary();
    }
    handleModalConfirm() {
        this.viewModel.executeModalConfirm();
        this.hideModal();
    }
    // Helper Methods
    startPlayerSetup() {
        this.viewModel.initializeTempPlayers();
        this.showPlayerSetup();
        this.updatePlayerInputs();
    }
    confirmNewGame() {
        this.showModal('Start New Game', 'Are ye sure ye want to start a new adventure? This will clear the current game.', true);
        this.viewModel.setModalConfirmCallback(() => {
            const keepNames = this.getKeepNamesCheckbox();
            this.viewModel.startNewGame(keepNames);
            this.startPlayerSetup();
        });
    }
    // View Methods
    updateUI() {
        const gameState = this.viewModel.getGameState();
        if (gameState.players.length === 0) {
            this.showLanding();
        }
        else {
            this.showGame();
            this.updateScoreDisplay(gameState.players);
            this.updateRoundInputs(gameState.players, gameState.currentRound);
            this.updatePreviousRounds(gameState.rounds);
        }
    }
    showLanding() {
        var _a, _b, _c, _d;
        (_a = document.getElementById('landing-section')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
        (_b = document.getElementById('player-names-section')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
        (_c = document.getElementById('game-section')) === null || _c === void 0 ? void 0 : _c.classList.add('hidden');
        (_d = document.getElementById('new-game-section')) === null || _d === void 0 ? void 0 : _d.classList.add('hidden');
    }
    showPlayerSetup() {
        var _a, _b, _c, _d;
        (_a = document.getElementById('landing-section')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = document.getElementById('player-names-section')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        (_c = document.getElementById('game-section')) === null || _c === void 0 ? void 0 : _c.classList.add('hidden');
        (_d = document.getElementById('new-game-section')) === null || _d === void 0 ? void 0 : _d.classList.add('hidden');
    }
    showGame() {
        var _a, _b, _c, _d;
        (_a = document.getElementById('landing-section')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = document.getElementById('player-names-section')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
        (_c = document.getElementById('game-section')) === null || _c === void 0 ? void 0 : _c.classList.remove('hidden');
        (_d = document.getElementById('new-game-section')) === null || _d === void 0 ? void 0 : _d.classList.remove('hidden');
    }
    updatePlayerInputs() {
        const container = document.getElementById('player-names-inputs');
        const addPlayerBtn = document.getElementById('add-player-btn');
        if (!container)
            return;
        const tempPlayers = this.viewModel.getTempPlayers();
        container.innerHTML = tempPlayers.map((name, index) => `
            <div class="player-name-input">
                <input type="text" id="player-${index}" placeholder="Enter pirate name..." value="${name}" onchange="game.updateTempPlayer(${index}, this.value)">
                <button class="btn-remove" onclick="game.removePlayer(${index})" title="Remove player">✕</button>
            </div>
        `).join('');
        // Hide/show Add Pirate button based on player count (max 8)
        if (addPlayerBtn) {
            if (tempPlayers.length >= 8) {
                addPlayerBtn.style.display = 'none';
            }
            else {
                addPlayerBtn.style.display = 'inline-block';
            }
        }
    }
    updateScoreDisplay(players) {
        const scoreDisplay = document.getElementById('score-display');
        if (!scoreDisplay)
            return;
        scoreDisplay.innerHTML = players.map(player => `
            <div class="player-score">
                <h4>${player.name}</h4>
                <div class="score-value">${player.score}</div>
            </div>
        `).join('');
    }
    updateRoundInputs(players, currentRound) {
        const container = document.getElementById('round-inputs');
        const roundNumberEl = document.getElementById('round-number');
        if (!container)
            return;
        if (roundNumberEl) {
            roundNumberEl.textContent = currentRound.toString();
        }
        container.innerHTML = players.map(player => `
            <div class="player-round-input">
                <h4>${player.name}</h4>
                <div class="round-input-row">
                    <div class="input-group">
                        <label for="bid-${player.name}" class="input-label">Bid</label>
                        <input type="number" id="bid-${player.name}" placeholder="0" min="0" max="${currentRound}">
                    </div>
                    <div class="input-group">
                        <label for="actual-${player.name}" class="input-label">Won</label>
                        <input type="number" id="actual-${player.name}" placeholder="0" min="0" max="${currentRound}">
                    </div>
                    <div class="input-group">
                        <label for="bonus-${player.name}" class="input-label">Bonus</label>
                        <input type="number" id="bonus-${player.name}" placeholder="0" min="0">
                    </div>
                </div>
            </div>
        `).join('');
    }
    updatePreviousRounds(rounds) {
        const container = document.getElementById('previous-rounds');
        if (!container)
            return;
        if (rounds.length === 0) {
            container.innerHTML = '';
            return;
        }
        // Display rounds in reverse order (newest first)
        const sortedRounds = [...rounds].reverse();
        container.innerHTML = sortedRounds.map((round, index) => `
            <div class="round-display parchment">
                <div class="round-header">
                    <h3>Round ${round.roundNumber}</h3>
                    ${index === 0 ? '<button class="btn btn-secondary" onclick="game.handleUpdateLastRound()">Edit Round</button>' : ''}
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
    collectRoundData(players) {
        var _a, _b, _c;
        const data = {};
        for (const player of players) {
            const bidInput = document.getElementById(`bid-${player.name}`);
            const actualInput = document.getElementById(`actual-${player.name}`);
            const bonusInput = document.getElementById(`bonus-${player.name}`);
            // Parse values, defaulting to 0 for empty inputs
            const bidValue = ((_a = bidInput === null || bidInput === void 0 ? void 0 : bidInput.value) === null || _a === void 0 ? void 0 : _a.trim()) || '0';
            const actualValue = ((_b = actualInput === null || actualInput === void 0 ? void 0 : actualInput.value) === null || _b === void 0 ? void 0 : _b.trim()) || '0';
            const bonusValue = ((_c = bonusInput === null || bonusInput === void 0 ? void 0 : bonusInput.value) === null || _c === void 0 ? void 0 : _c.trim()) || '0';
            data[player.name] = {
                bid: parseInt(bidValue),
                actual: parseInt(actualValue),
                bonus: parseInt(bonusValue)
            };
        }
        return data;
    }
    clearRoundInputs() {
        const inputs = document.querySelectorAll('#round-inputs input');
        inputs.forEach(input => input.value = '');
    }
    showCommentary() {
        const commentary = this.viewModel.generateCommentary();
        const commentaryEl = document.getElementById('pirate-commentary');
        const textEl = document.getElementById('commentary-text');
        if (commentaryEl && textEl && commentary) {
            textEl.textContent = commentary;
            commentaryEl.classList.remove('hidden');
        }
    }
    showModal(title, message, showCheckbox = false) {
        const modal = document.getElementById('modal');
        const titleEl = document.getElementById('modal-title');
        const messageEl = document.getElementById('modal-message');
        const checkboxContainer = document.getElementById('modal-checkbox-container');
        const modalButtons = document.getElementById('modal-buttons');
        const modalOptions = document.getElementById('modal-options');
        const newGameOptions = document.getElementById('new-game-options');
        if (!modal || !titleEl || !messageEl)
            return;
        titleEl.textContent = title;
        messageEl.textContent = message;
        // Hide all optional sections by default
        checkboxContainer === null || checkboxContainer === void 0 ? void 0 : checkboxContainer.classList.add('hidden');
        modalOptions === null || modalOptions === void 0 ? void 0 : modalOptions.classList.add('hidden');
        newGameOptions === null || newGameOptions === void 0 ? void 0 : newGameOptions.classList.add('hidden');
        // Show standard buttons
        modalButtons === null || modalButtons === void 0 ? void 0 : modalButtons.classList.remove('hidden');
        if (showCheckbox && checkboxContainer) {
            checkboxContainer.classList.remove('hidden');
        }
        modal.classList.remove('hidden');
    }
    showErrorModal(message) {
        const modal = document.getElementById('modal');
        const titleEl = document.getElementById('modal-title');
        const messageEl = document.getElementById('modal-message');
        const checkboxContainer = document.getElementById('modal-checkbox-container');
        const modalButtons = document.getElementById('modal-buttons');
        const modalOptions = document.getElementById('modal-options');
        const newGameOptions = document.getElementById('new-game-options');
        const modalConfirm = document.getElementById('modal-confirm');
        const modalCancel = document.getElementById('modal-cancel');
        if (!modal || !titleEl || !messageEl)
            return;
        titleEl.textContent = 'Arr! Input Error';
        messageEl.textContent = message;
        // Hide all optional sections
        checkboxContainer === null || checkboxContainer === void 0 ? void 0 : checkboxContainer.classList.add('hidden');
        modalOptions === null || modalOptions === void 0 ? void 0 : modalOptions.classList.add('hidden');
        newGameOptions === null || newGameOptions === void 0 ? void 0 : newGameOptions.classList.add('hidden');
        modalButtons === null || modalButtons === void 0 ? void 0 : modalButtons.classList.remove('hidden');
        // Show only the confirm button (OK)
        if (modalConfirm && modalCancel) {
            modalConfirm.textContent = 'Aye, I\'ll fix it!';
            modalCancel.style.display = 'none';
        }
        // Clear any existing callback and set error modal behavior
        this.viewModel.setModalConfirmCallback(() => {
            if (modalCancel)
                modalCancel.style.display = 'inline-block';
            if (modalConfirm)
                modalConfirm.textContent = 'Aye';
        });
        modal.classList.remove('hidden');
    }
    hideModal() {
        const modal = document.getElementById('modal');
        modal === null || modal === void 0 ? void 0 : modal.classList.add('hidden');
    }
    getKeepNamesCheckbox() {
        const checkbox = document.getElementById('keep-names-checkbox');
        return (checkbox === null || checkbox === void 0 ? void 0 : checkbox.checked) || false;
    }
    showError(message) {
        this.showErrorModal(message);
    }
    readScores() {
        // Check if browser supports speech synthesis
        if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
            this.showErrorModal('Arr! Yer browser doesn\'t support speech. Try a newer vessel!');
            return;
        }
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        const announcement = this.viewModel.createScoreAnnouncement();
        // Create and configure the utterance for maximum pirate effect
        const utterance = new SpeechSynthesisUtterance(announcement);
        utterance.rate = 0.7; // Slower and more dramatic
        utterance.pitch = 0.7; // Lower pitch for gruff pirate voice
        utterance.volume = 1;
        // Try to find the most pirate-sounding voice
        const voices = window.speechSynthesis.getVoices();
        const pirateVoice = voices.find(voice => voice.lang.startsWith('en') &&
            (voice.name.toLowerCase().includes('male') ||
                voice.name.toLowerCase().includes('daniel'))) || voices.find(voice => voice.lang.startsWith('en'));
        if (pirateVoice) {
            utterance.voice = pirateVoice;
        }
        // Speak!
        window.speechSynthesis.speak(utterance);
    }
    // Public API for HTML event handlers
    updateTempPlayer(index, value) {
        this.viewModel.updateTempPlayer(index, value);
    }
    removePlayer(index) {
        this.viewModel.removeTempPlayer(index);
        this.updatePlayerInputs();
    }
    handleUpdateLastRound() {
        const lastRoundData = this.viewModel.getLastRoundData();
        if (!lastRoundData) {
            this.showError('No rounds to update!');
            return;
        }
        // Populate the inputs with last round data
        for (const [playerName, data] of Object.entries(lastRoundData)) {
            const bidInput = document.getElementById(`bid-${playerName}`);
            const actualInput = document.getElementById(`actual-${playerName}`);
            const bonusInput = document.getElementById(`bonus-${playerName}`);
            if (bidInput)
                bidInput.value = data.bid.toString();
            if (actualInput)
                actualInput.value = data.actual.toString();
            if (bonusInput)
                bonusInput.value = data.bonus.toString();
        }
        this.showModal('Update Last Round', 'Modify the values above and click "Record Round" to update the last round.');
    }
    // Public method for testing the scoring logic
    testCalculateRoundScore(bid, actual, bonus, roundNumber) {
        return this.viewModel.testCalculateRoundScore(bid, actual, bonus, roundNumber);
    }
}
// Initialize game
const game = new SkullKingGame();
// Expose class for testing
window.SkullKingGame = SkullKingGame;
