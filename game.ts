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

        const readScoresBtn = document.getElementById('read-scores-btn');
        readScoresBtn?.addEventListener('click', () => this.readScores());

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
        } else {
            // If only one player, just clear the name
            this.tempPlayers[0] = '';
            const input = document.getElementById(`player-0`) as HTMLInputElement;
            if (input) {
                input.value = '';
            }
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

        // Validation
        const errors: string[] = [];
        
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
        this.updateCommentary(roundData);
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
        const confirmBtn = document.getElementById('modal-confirm');
        const cancelBtn = document.getElementById('modal-cancel');
        
        modal?.classList.add('hidden');
        modalOptions?.classList.add('hidden');
        modalButtons?.classList.remove('hidden');
        
        // Restore button states
        if (confirmBtn && cancelBtn) {
            confirmBtn.classList.remove('hidden');
            cancelBtn.textContent = 'Nay';
        }
        
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

    private readScores(): void {
        // Check if browser supports speech synthesis
        if (!('speechSynthesis' in window)) {
            alert('Arr! Yer browser doesn\'t support speech. Try a newer vessel!');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Sort players by score (highest first)
        const sortedPlayers = [...this.state.players].sort((a, b) => b.score - a.score);

        // Build the announcement starting with previous round's commentary
        let announcement = '';
        
        // Add previous round commentary if available
        if (this.state.rounds.length > 0) {
            const commentaryText = document.getElementById('commentary-text')?.textContent;
            if (commentaryText) {
                announcement += `${commentaryText} ... `;
            }
        }
        
        announcement += `Ahoy mateys! Here be the current standings after round ${this.state.currentRound - 1}. `;
        
        sortedPlayers.forEach((player, index) => {
            if (index === 0) {
                announcement += `Leading the crew be ${player.name} with ${player.score} pieces of eight! `;
            } else if (index === sortedPlayers.length - 1) {
                announcement += `And ${player.name} be at ${player.score}. `;
            } else {
                announcement += `${player.name} has ${player.score}. `;
            }
        });

        // Add flavor based on game state
        if (this.state.rounds.length === 0) {
            announcement = "Ahoy! No rounds played yet. Time to start plunderin'!";
        } else if (sortedPlayers[0].score > sortedPlayers[sortedPlayers.length - 1].score + 50) {
            announcement += "Shiver me timbers! Someone be runnin' away with the treasure!";
        } else if (sortedPlayers[0].score === sortedPlayers[1]?.score) {
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

    private showValidationModal(errors: string[]): void {
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

    private updateCommentary(roundData: RoundData): void {
        const commentary = this.generateCommentary(roundData);
        const commentarySection = document.getElementById('pirate-commentary');
        const commentaryText = document.getElementById('commentary-text');
        
        if (commentarySection && commentaryText && commentary) {
            commentaryText.textContent = commentary;
            commentarySection.classList.remove('hidden');
        }
    }

    private generateCommentary(roundData: RoundData): string {
        const playerData = roundData.playerData;
        const roundNumber = roundData.roundNumber;
        
        // Analyze round performance
        const perfectBids = playerData.filter(p => p.bid === p.actual).length;
        const totalPlayers = playerData.length;
        const badMisses = playerData.filter(p => Math.abs(p.bid - p.actual) >= 3).length;
        const bigScorers = playerData.filter(p => p.roundScore >= 40).length;
        const disasters = playerData.filter(p => p.roundScore <= -30).length;
        const zeroBidders = playerData.filter(p => p.bid === 0).length;
        const successfulZeros = playerData.filter(p => p.bid === 0 && p.actual === 0).length;
        
        // Current game state analysis
        const currentScores = this.state.players.map(p => p.score).sort((a, b) => b - a);
        const leader = this.state.players.find(p => p.score === currentScores[0]);
        const lastPlace = this.state.players.find(p => p.score === currentScores[currentScores.length - 1]);
        const spread = currentScores[0] - currentScores[currentScores.length - 1];
        
        // Generate commentary based on round events
        const commentaries: string[] = [];
        
        // Perfect round commentary
        if (perfectBids === totalPlayers) {
            const perfectRoundVariants = [
                "Blimey! Every scallywag nailed their bid! The sea gods smile upon ye all!",
                "Incredible! All hands hit their mark perfectly! Even Neptune himself applauds!",
                "Shiver me timbers! Perfect accuracy from the whole crew! Ye be true sea dogs!",
                "By Blackbeard's beard! Every pirate called it exactly right! Legendary sailing!",
                "Astounding! Not a single miscalculation in sight! Ye all deserve treasure chests!"
            ];
            commentaries.push(perfectRoundVariants[Math.floor(Math.random() * perfectRoundVariants.length)]);
        } else if (perfectBids >= totalPlayers * 0.75) {
            const mostPerfectVariants = [
                "Arrr! Most of ye landlubbers actually know how to count tricks! Impressive sailing!",
                "Well, well! The majority of ye scurvy dogs got it right! There's hope for ye yet!",
                "Huzzah! Most pirates sailed true to their word! The few stragglers need more rum!",
                "Impressive! The bulk of ye crew knows their business! A few still need navigatin' lessons!",
                "Magnificent! Most of ye sea wolves predicted perfectly! The rest... well, practice makes perfect!"
            ];
            commentaries.push(mostPerfectVariants[Math.floor(Math.random() * mostPerfectVariants.length)]);
        } else if (perfectBids === 0) {
            const noPerfectVariants = [
                "Shiver me timbers! Not a single soul hit their mark! Ye all sail like drunken sailors!",
                "Pathetic! Every last one of ye missed yer target! I've seen better aim from blind sea turtles!",
                "Disgraceful! Not one pirate got it right! Ye couldn't hit water if ye fell out of a boat!",
                "Embarrassing! Complete failure from bow to stern! Time to keelhaul the lot of ye!",
                "Abysmal! Every prediction was wrong! Ye make landlubbers look like seasoned captains!"
            ];
            commentaries.push(noPerfectVariants[Math.floor(Math.random() * noPerfectVariants.length)]);
        }
        
        // Disaster commentary
        if (disasters >= 2) {
            const multiDisasterVariants = [
                "Har har! Some scurvy dogs be walkin' the plank with those scores!",
                "Catastrophe on the high seas! Multiple pirates be sinkin' to Davy Jones' locker!",
                "What a shipwreck! Several sea dogs took a mighty tumble this round!",
                "Disaster strikes! Multiple crew members be needin' rescue boats with those scores!",
                "By the kraken's tentacles! Several pirates just hit the rocks and sank!"
            ];
            commentaries.push(multiDisasterVariants[Math.floor(Math.random() * multiDisasterVariants.length)]);
        } else if (disasters === 1) {
            const disaster = playerData.find(p => p.roundScore <= -30);
            const singleDisasterVariants = [
                `Avast! ${disaster?.playerName} be sinkin' faster than a ship with no hull!`,
                `Yikes! ${disaster?.playerName} just sailed straight into a whirlpool of failure!`,
                `Mercy! ${disaster?.playerName} took a cannonball to the treasure chest this round!`,
                `Blimey! ${disaster?.playerName} be drownin' in their own poor choices!`,
                `Ouch! ${disaster?.playerName} just discovered what it feels like to hit an iceberg!`
            ];
            commentaries.push(singleDisasterVariants[Math.floor(Math.random() * singleDisasterVariants.length)]);
        }
        
        // Big scorer commentary
        if (bigScorers >= 2) {
            const multiBigScorerVariants = [
                "Pieces of eight! Multiple pirates be strikin' gold this round!",
                "Treasure galore! Several sea dogs found the mother lode today!",
                "Riches beyond measure! Multiple buccaneers struck it rich this round!",
                "Golden doubloons for all! Several pirates be swimmin' in treasure!",
                "What a haul! Multiple captains filled their coffers to the brim!"
            ];
            commentaries.push(multiBigScorerVariants[Math.floor(Math.random() * multiBigScorerVariants.length)]);
        } else if (bigScorers === 1) {
            const bigScorer = playerData.find(p => p.roundScore >= 40);
            const singleBigScorerVariants = [
                `${bigScorer?.playerName} be plunderin' like a true pirate king! Magnificent haul!`,
                `Huzzah! ${bigScorer?.playerName} just struck the richest vein of treasure on the seven seas!`,
                `Incredible! ${bigScorer?.playerName} sailed away with enough gold to buy their own fleet!`,
                `Outstanding! ${bigScorer?.playerName} just pulled off the heist of the century!`,
                `Spectacular! ${bigScorer?.playerName} be rakin' in doubloons like a legendary buccaneer!`
            ];
            commentaries.push(singleBigScorerVariants[Math.floor(Math.random() * singleBigScorerVariants.length)]);
        }
        
        // Zero bid commentary
        if (zeroBidders > 0) {
            if (successfulZeros === zeroBidders) {
                const successfulZeroVariants = [
                    `${zeroBidders === 1 ? 'A crafty' : 'Some crafty'} pirate${zeroBidders > 1 ? 's' : ''} played it safe with zero bids and lived to tell the tale!`,
                    `${zeroBidders === 1 ? 'A clever' : 'Some clever'} sea dog${zeroBidders > 1 ? 's' : ''} avoided all tricks and kept their treasure safe!`,
                    `${zeroBidders === 1 ? 'A wise' : 'Some wise'} sailor${zeroBidders > 1 ? 's' : ''} chose the path of caution and sailed home rich!`,
                    `${zeroBidders === 1 ? 'A shrewd' : 'Some shrewd'} buccaneer${zeroBidders > 1 ? 's' : ''} stayed out of trouble and pocketed the gold!`,
                    `${zeroBidders === 1 ? 'A cunning' : 'Some cunning'} pirate${zeroBidders > 1 ? 's' : ''} played it smart and avoided the storm entirely!`
                ];
                commentaries.push(successfulZeroVariants[Math.floor(Math.random() * successfulZeroVariants.length)]);
            } else {
                const failedZeroVariants = [
                    "Some cowardly sea dogs tried to avoid all tricks but failed! No treasure for the timid!",
                    "Ha! Some scallywags tried to hide from trouble but got caught anyway! Pathetic!",
                    "Amusing! Some landlubbers thought they could avoid all action but failed miserably!",
                    "Pitiful! Some yellow-bellied pirates tried to play it safe but couldn't even do that right!",
                    "Laughable! Some spineless crew members attempted to dodge danger but got swept up anyway!"
                ];
                commentaries.push(failedZeroVariants[Math.floor(Math.random() * failedZeroVariants.length)]);
            }
        }
        
        // Bad miss commentary
        if (badMisses >= totalPlayers / 2) {
            const badMissVariants = [
                "Most of ye be as accurate as a blind man throwin' daggers! Learn to count, ye scurvy dogs!",
                "Pathetic aim from the majority! Ye couldn't hit the broad side of a treasure galleon!",
                "Terrible navigation from most of the crew! Did ye all forget how to count to ten?",
                "Abysmal predictions! Most of ye missed by leagues! Time for some basic seamanship lessons!",
                "Dreadful accuracy! The majority sailed way off course! Even a compass wouldn't help ye now!"
            ];
            commentaries.push(badMissVariants[Math.floor(Math.random() * badMissVariants.length)]);
        }
        
        // Game state commentary
        if (roundNumber >= 5) {
            if (spread > 100) {
                const dominationVariants = [
                    `${leader?.name} be dominatin' these waters while ${lastPlace?.name} be drownin' in their own wake!`,
                    `${leader?.name} be runnin' away with the treasure while ${lastPlace?.name} be sinkin' like a stone!`,
                    `${leader?.name} be sailin' circles around ${lastPlace?.name}! What a gap in skill!`,
                    `${leader?.name} be crushin' the competition while ${lastPlace?.name} flounders like a fish!`,
                    `${leader?.name} be the captain of captains while ${lastPlace?.name} needs a rescue boat!`
                ];
                commentaries.push(dominationVariants[Math.floor(Math.random() * dominationVariants.length)]);
            } else if (spread < 20) {
                const tightRaceVariants = [
                    "This be a tight race! Any one of ye bilge rats could claim the crown!",
                    "Neck and neck like racing dolphins! Anyone could still seize the treasure!",
                    "Close as thieves! The winner be anyone's guess at this point!",
                    "Tighter than a ship's rigging! Every pirate still has a fighting chance!",
                    "What a battle! The scores be closer than barnacles on a hull!"
                ];
                commentaries.push(tightRaceVariants[Math.floor(Math.random() * tightRaceVariants.length)]);
            }
        }
        
        // Late game commentary
        if (roundNumber >= 8) {
            if (leader && leader.score > 200) {
                const legendVariants = [
                    `${leader.name} be sailin' toward legend! Can anyone stop this pirate?`,
                    `${leader.name} be writin' their name in pirate history! What a commanding lead!`,
                    `${leader.name} be on course to legendary status! The crown awaits!`,
                    `${leader.name} be dominatin' like a true sea emperor! Unstoppable!`,
                    `${leader.name} be carvin' out a legacy! The stuff of pirate legends!`
                ];
                commentaries.push(legendVariants[Math.floor(Math.random() * legendVariants.length)]);
            }
            const finalRoundsVariants = [
                "The final rounds approach! Time to separate the captains from the cabin boys!",
                "The endgame draws near! Only true pirates will survive these waters!",
                "The climax approaches! Time to see who has real sea legs!",
                "The final stretch! Now we'll discover the worthy from the worthless!",
                "The home stretch beckons! Time to prove yer pirate mettle!"
            ];
            commentaries.push(finalRoundsVariants[Math.floor(Math.random() * finalRoundsVariants.length)]);
        }
        
        // Round-specific commentary
        if (roundNumber === 1) {
            const firstRoundVariants = [
                "First blood has been drawn! Let the plunderin' begin!",
                "The adventure begins! Time to see what ye landlubbers are made of!",
                "First round in the books! The battle for pirate supremacy starts now!",
                "The opening salvo! Let's see who's got the courage for this journey!",
                "Round one complete! The quest for treasure has officially begun!"
            ];
            commentaries.push(firstRoundVariants[Math.floor(Math.random() * firstRoundVariants.length)]);
        } else if (roundNumber === 10) {
            const finalRoundVariants = [
                "The final round! Time to see who truly deserves the title of Skull King!",
                "The ultimate test! Only one can claim the crown of the seven seas!",
                "The last stand! Time to discover the true Skull King among ye!",
                "The final battle! The throne of piracy awaits its rightful ruler!",
                "The concluding chapter! Who will emerge as the ultimate sea lord?"
            ];
            commentaries.push(finalRoundVariants[Math.floor(Math.random() * finalRoundVariants.length)]);
        }
        
        // Random snarky commentary if nothing specific happened
        const randomCommentary = [
            "Another round of mediocre piracy! I've seen better sailing from landlubbers!",
            "Ye call that bidding? My grandmother could predict tricks better with her eyes closed!",
            "Some of ye be playin' like ye've never seen a deck of cards before!",
            "The sea be full of surprises, unlike yer predictable play!",
            "Keep this up and ye'll all be swabbin' the deck instead of scorin' points!",
            "I've seen more excitement watchin' barnacles grow on ship hulls!",
            "Yer treasure-huntin' skills need work, mateys!",
            "Ordinary round from ordinary pirates! Where be the spark of adventure?",
            "Standard sailing from a standard crew! Nothing legendary about this voyage!",
            "Routine plunderin' from routine buccaneers! Wake me when something interesting happens!",
            "Average performance across the board! Ye be sailin' in circles like confused seagulls!",
            "Typical tricks from typical pirates! Even the sea monsters be yawnin'!",
            "Predictable as the tides! Spice up yer game, ye sleepy sea dogs!",
            "Mundane as merchant sailing! Where be the daring pirate spirit?",
            "Safe and boring! Ye play like ye're haulin' cargo instead of huntin' treasure!",
            "Uninspiring round! Even the ship's cat could bid better than this!",
            "Lackluster performance! Ye need more fire in yer pirate bellies!",
            "Dull as dishwater! I've seen more excitement in a monastery!",
            "Tepid sailing! The wind has more personality than this crew!",
            "Forgettable round! This tale won't be sung in any tavern!",
            "Bland as hardtack! Where be the swashbuckling adventure?",
            "Colorless as fog! Ye need to paint this voyage with bolder strokes!",
            "Flat as calm seas! Stir up some waves with yer next plays!",
            "Tame as a parrot! Show some wild pirate cunning!",
            "Mild as morning mist! Time to unleash the storm within ye!",
            "Gentle as a summer breeze! Ye need hurricane-force gameplay!",
            "Quiet as a graveyard! Make some noise with yer next bids!"
        ];
        
        if (commentaries.length === 0) {
            commentaries.push(randomCommentary[Math.floor(Math.random() * randomCommentary.length)]);
        }
        
        return commentaries[Math.floor(Math.random() * commentaries.length)];
    }
}

// Initialize game
const game = new SkullKingGame();