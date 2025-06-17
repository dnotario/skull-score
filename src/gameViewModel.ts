import { GameState, GameStateData } from './gameState';

// Data model interfaces (also used by GameState, consider moving to types.ts later)
export interface Player {
    name: string;
    score: number;
}

export interface PlayerRoundData {
    playerName: string;
    bid: number;
    actual: number;
    bonus: number;
    roundScore: number;
}

export interface RoundData {
    roundNumber: number;
    playerData: PlayerRoundData[];
    commentary: string;
}

// Re-declaring GameStateData here for now, or it could be imported if GameState exports it.
// For clarity during refactor, GameState's GameStateData is what GameViewModel will use.
// So, ensure GameState exports GameStateData and import it here.

// Google Analytics gtag function declaration
declare function gtag(...args: any[]): void;

// PWA Install Prompt Interface
export interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * GameViewModel - Contains all business logic and state management
 * Manages game rules, scoring calculations, validation, and analytics
 */
export class GameViewModel {
    private gameState: GameState;
    private state: GameStateData;
    private tempPlayers: string[] = [];
    private modalConfirmCallback: (() => void) | null = null;

    constructor() {
        this.gameState = new GameState();
        this.state = this.gameState.load() || this.gameState.getDefaultState();
    }

    // State Management
    getGameState(): GameStateData {
        return { ...this.state };
    }

    saveState(): void {
        this.gameState.save(this.state);
    }

    clearState(): void {
        this.gameState.clear();
        this.state = this.gameState.getDefaultState();
    }

    // Player Management
    getTempPlayers(): string[] {
        return [...this.tempPlayers];
    }

    initializeTempPlayers(): void {
        this.tempPlayers = this.state.players.map(p => p.name);
        if (this.tempPlayers.length === 0) {
            this.tempPlayers = [''];
        }
    }

    updateTempPlayer(index: number, value: string): void {
        this.tempPlayers[index] = value;
    }

    addTempPlayer(): void {
        this.tempPlayers.push('');
    }

    removeTempPlayer(index: number): void {
        if (this.tempPlayers.length > 1) {
            this.tempPlayers.splice(index, 1);
        } else {
            this.tempPlayers[0] = '';
        }
    }

    setTempPlayers(players: string[]): void {
        this.tempPlayers = [...players];
    }

    validateAndStartGame(): string | null {
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
            event_category: 'game',
            event_label: 'new_game',
            player_count: this.state.players.length,
            value: this.state.players.length
        });

        return null; // Success
    }

    // Scoring Logic
    private calculateRoundScore(bid: number, actual: number, bonus: number, roundNumber: number): number {
        if (bid === 0) {
            // Zero bid scoring
            return actual === 0 ? 10 * roundNumber + bonus : -10 * roundNumber;
        } else {
            // Non-zero bid scoring
            if (bid === actual) {
                // Correct prediction: 20 points per trick + bonus
                return 20 * actual + bonus;
            } else {
                // Incorrect prediction: -10 points per difference (no bonus)
                return -10 * Math.abs(bid - actual);
            }
        }
    }

    // Input Validation
    validateSinglePlayerInput(bid: number, actual: number, bonus: number, playerName: string, roundNumber?: number): string | null {
        const targetRound = roundNumber || this.state.currentRound;

        // Check for invalid numbers (NaN)
        if (isNaN(bid) || isNaN(actual) || isNaN(bonus)) {
            return `Invalid number entered for ${playerName}. Please enter valid numbers only.`;
        }

        // Integer validation
        if (!Number.isInteger(bid) || !Number.isInteger(actual) || !Number.isInteger(bonus)) {
            return `All values must be whole numbers for ${playerName}.`;
        }

        // Basic validation
        if (bid < 0 || actual < 0 || bonus < 0) {
            return `Bid, actual tricks, and bonus must be non-negative for ${playerName}.`;
        }

        // Round-specific validation: bids and actual tricks can't exceed available cards
        const maxTricks = this.getCardsPerRound(targetRound, this.state.players.length);
        if (bid > maxTricks) {
            return `${playerName}'s bid (${bid}) can't exceed ${maxTricks} tricks in round ${targetRound} with ${this.state.players.length} players.`;
        }
        if (actual > maxTricks) {
            return `${playerName} can't win more than ${maxTricks} tricks in round ${targetRound} with ${this.state.players.length} players. Actual: ${actual}`;
        }

        // Bonus point validation - only applies when correctly predicting tricks
        if (bid !== actual && bonus > 0) {
            return `${playerName} can only earn bonus points when correctly predicting tricks! (Bid: ${bid}, Actual: ${actual})`;
        }

        // Reasonable bonus limits
        if (Math.abs(bonus) > 100) {
            return `${playerName}'s bonus points seem unreasonable (${bonus}). Please check your entry.`;
        }

        return null; // Valid
    }

    // Round Management
    getCurrentRoundNumber(): number {
        return this.state.currentRound;
    }

    // Card distribution logic for Skull King (70 card deck)
    getCardsPerRound(roundNumber: number, playerCount: number): number {
        // Skull King is a 10-round game - rounds beyond 10 are invalid
        if (roundNumber > 10) {
            throw new Error(`Invalid round number: ${roundNumber}. Skull King only has 10 rounds.`);
        }

        // Basic validation
        if (roundNumber < 1) {
            throw new Error(`Invalid round number: ${roundNumber}. Round number must be 1 or greater.`);
        }

        if (playerCount < 1) {
            throw new Error(`Invalid player count: ${playerCount}. Must have at least 1 player.`);
        }

        const totalCards = 70;
        const idealCards = roundNumber;
        const cardsNeeded = idealCards * playerCount;

        // If we can deal the ideal number of cards, do so
        if (cardsNeeded <= totalCards) {
            return idealCards;
        }

        // Otherwise, calculate the maximum cards we can deal per player
        return Math.floor(totalCards / playerCount);
    }

    // Get maximum tricks available for current round
    getMaxTricksForCurrentRound(): number {
        return this.getCardsPerRound(this.state.currentRound, this.state.players.length);
    }

    validateRoundData(data: { [playerName: string]: { bid: number; actual: number; bonus: number } }, roundNumber?: number): string | null {
        const targetRound = roundNumber || this.state.currentRound;

        // Validate each player's input
        for (const [playerName, playerData] of Object.entries(data)) {
            const { bid, actual, bonus } = playerData;
            const validationError = this.validateSinglePlayerInput(bid, actual, bonus, playerName, targetRound);
            if (validationError) {
                return validationError;
            }
        }

        // Validate that total actual wins equals the number of tricks available
        const maxTricks = this.getCardsPerRound(targetRound, this.state.players.length);
        const totalActualWins = Object.values(data).reduce((sum, playerData) => sum + playerData.actual, 0);

        if (totalActualWins !== maxTricks) {
            return `Total tricks won (${totalActualWins}) must equal the number of tricks available (${maxTricks}) in round ${targetRound} with ${this.state.players.length} players.`;
        }

        return null; // Valid
    }

    addRound(data: { [playerName: string]: { bid: number; actual: number; bonus: number } }): string | null {
        const validationError = this.validateRoundData(data);
        if (validationError) {
            return validationError;
        }

        const roundData: RoundData = {
            roundNumber: this.state.currentRound,
            playerData: [],
            commentary: ''
        };

        // Process each player's data
        for (const player of this.state.players) {
            const playerRoundData = data[player.name];
            const roundScore = this.calculateRoundScore(
                playerRoundData.bid,
                playerRoundData.actual,
                playerRoundData.bonus,
                this.state.currentRound
            );

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

        // Generate commentary for this round
        roundData.commentary = this.generateRoundCommentary(roundData);

        this.state.rounds.push(roundData);
        this.state.currentRound++;
        this.saveState();

        // Track analytics
        this.trackEvent('round_complete', {
            event_category: 'gameplay',
            event_label: 'round_finished',
            round_number: roundData.roundNumber,
            player_count: this.state.players.length,
            value: roundData.roundNumber
        });

        return null; // Success
    }

    removeLastRound(): { [playerName: string]: { bid: number; actual: number; bonus: number } } | null {
        if (this.state.rounds.length === 0) {
            return null;
        }

        const lastRound = this.state.rounds.pop()!;

        // Revert scores from the removed round
        for (const playerData of lastRound.playerData) {
            const player = this.state.players.find(p => p.name === playerData.playerName);
            if (player) {
                player.score -= playerData.roundScore;
            }
        }

        // Decrease current round number
        this.state.currentRound = Math.max(1, this.state.currentRound - 1);
        this.saveState();

        // Track analytics
        this.trackEvent('round_removed', {
            event_category: 'gameplay',
            event_label: 'round_deleted',
            round_number: lastRound.roundNumber,
            value: lastRound.roundNumber
        });

        // Return the round data for pre-filling inputs
        const result: { [playerName: string]: { bid: number; actual: number; bonus: number } } = {};
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
    setModalConfirmCallback(callback: (() => void) | null): void {
        this.modalConfirmCallback = callback;
    }

    executeModalConfirm(): void {
        if (this.modalConfirmCallback) {
            this.modalConfirmCallback();
            this.modalConfirmCallback = null;
        }
    }

    // New Game Logic
    startNewGame(keepNames: boolean): void {
        const existingNames = keepNames ? this.state.players.map(p => p.name) : [];

        this.clearState();

        if (existingNames.length > 0) {
            this.tempPlayers = [...existingNames];
        } else {
            this.tempPlayers = [''];
        }

        // Track analytics
        this.trackEvent('new_game_started', {
            event_category: 'navigation',
            event_label: keepNames ? 'same_players' : 'new_players',
            kept_names: keepNames,
            player_count: existingNames.length,
            value: existingNames.length
        });
    }

    // Analytics
    private trackEvent(eventName: string, parameters: { [key: string]: any } = {}): void {
        console.log('🔍 Analytics Event:', eventName, parameters);

        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
            console.log('✅ Event sent to Google Analytics');
        } else {
            console.warn('⚠️ gtag not available - analytics event not sent');
        }
    }

    // Game Status
    isGameActive(): boolean {
        return this.state.players.length > 0;
    }

    isGameComplete(): boolean {
        return this.state.currentRound > 10;
    }

    hasRounds(): boolean {
        return this.state.rounds.length > 0;
    }

    getPlayerCount(): number {
        return this.state.players.length;
    }

    getRoundCount(): number {
        return this.state.rounds.length;
    }

    // Get players sorted by score (highest first)
    getPlayersSortedByScore(): Player[] {
        return [...this.state.players].sort((a, b) => b.score - a.score);
    }

    // Commentary generation for a specific round
    generateRoundCommentary(roundData: RoundData): string {
        const perfectPlayers = roundData.playerData.filter(p => p.bid === p.actual);
        const disasters = roundData.playerData.filter(p => Math.abs(p.bid - p.actual) >= 3);
        const bigScores = roundData.playerData.filter(p => p.roundScore >= 40);

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

        // Default commentary - always return something
        const defaultComments = [
            "Another round in the books! The seas be unpredictable as always!",
            "The tide turns with each round! Stay sharp, ye scurvy dogs!",
            "Mixed fortunes this round! The ocean gives and takes as she pleases!",
            "The winds of fortune blow in mysterious ways, ye landlubbers!",
            "Some pirates swim with the sharks, others sail to victory!"
        ];
        return defaultComments[Math.floor(Math.random() * defaultComments.length)];
    }

    // Get commentary for current state (for voice reading)
    getCurrentCommentary(): string {
        if (this.state.rounds.length === 0) {
            const startComments = [
                "Batten down the hatches, me hearties! The adventure begins!",
                "Hoist the colors! Time to see which scallywag rules these waters!",
                "All hands on deck! May the best pirate claim the treasure!"
            ];
            return startComments[Math.floor(Math.random() * startComments.length)];
        }

        // Return the commentary from the most recent round
        const lastRound = this.state.rounds[this.state.rounds.length - 1];
        return lastRound.commentary;
    }

    // Winner determination
    getWinner(): Player[] | null {
        if (this.state.players.length === 0) return null;

        const sortedPlayers = [...this.state.players].sort((a, b) => b.score - a.score);
        const highestScore = sortedPlayers[0].score;

        // Return all players with the highest score (in case of tie)
        return sortedPlayers.filter(player => player.score === highestScore);
    }

    generateWinnerAnnouncement(): string {
        const winners = this.getWinner();
        if (!winners || winners.length === 0) {
            return "The seas have claimed all! No winners this voyage!";
        }

        if (winners.length === 1) {
            const winner = winners[0];
            const winnerMessages = [
                `Huzzah! Captain ${winner.name} emerges victorious with ${winner.score} pieces of eight! The crown of Skull King belongs to ye!`,
                `Avast! ${winner.name} has conquered the seven seas with ${winner.score} doubloons! All hail the new Skull King!`,
                `Shiver me timbers! ${winner.name} stands triumphant with ${winner.score} gold coins! Ye be the true master of these waters!`,
                `Blimey! ${winner.name} has plundered the most treasure with ${winner.score} pieces of eight! The Skull King's throne is yours!`
            ];
            return winnerMessages[Math.floor(Math.random() * winnerMessages.length)];
        } else {
            // Multiple winners (tie)
            const winnerNames = winners.map(w => w.name).join(' and ');
            const score = winners[0].score;
            const tieMessages = [
                `Avast! We have a tie! ${winnerNames} both finish with ${score} pieces of eight! Ye must share the Skull King's crown!`,
                `Blimey! ${winnerNames} have tied with ${score} doubloons each! Two captains, one throne - may the best pirate win!`,
                `Shiver me timbers! ${winnerNames} are deadlocked at ${score} gold coins! The seas couldn't choose between such worthy pirates!`
            ];
            return tieMessages[Math.floor(Math.random() * tieMessages.length)];
        }
    }

    // Text-to-Speech
    createScoreAnnouncement(): string {
        if (this.state.players.length === 0) {
            return "No active game to announce, ye landlubber!";
        }

        let announcement = "Ahoy mateys! ";

        // Always use the current commentary from the viewmodel
        const commentary = this.getCurrentCommentary();
        announcement += `${commentary} `;

        const sortedPlayers = [...this.state.players].sort((a, b) => b.score - a.score);

        announcement += `Now for the current bounty after round ${this.state.rounds.length}... `;

        sortedPlayers.forEach((player, index) => {
            if (index === 0) {
                announcement += `Leading the fleet, we have ${player.name} with ${player.score} pieces of eight! `;
            } else if (index === sortedPlayers.length - 1 && sortedPlayers.length > 2) {
                announcement += `And bringing up the rear, ${player.name} with ${player.score} doubloons. `;
            } else {
                announcement += `${player.name} follows with ${player.score} gold coins. `;
            }
        });

        announcement += "May the winds favor the worthy! Arrr!";
        return announcement;
    }

    // Public method for testing
    public testCalculateRoundScore(bid: number, actual: number, bonus: number, roundNumber: number): number {
        return this.calculateRoundScore(bid, actual, bonus, roundNumber);
    }
}
