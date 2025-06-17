/**
 * GameState - Handles data persistence and storage
 * Pure data layer that only manages localStorage operations
 */
export class GameState {
    private readonly storageKey = 'skullKingGameState';

    load(): GameStateData | null {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : null;
    }

    save(state: GameStateData): void {
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    clear(): void {
        localStorage.removeItem(this.storageKey);
    }

    getDefaultState(): GameStateData {
        return {
            players: [],
            rounds: [],
            currentRound: 1
        };
    }
}

// Necessary interface, will be moved or duplicated for GameViewModel too.
// For now, to make GameState self-contained until other files are created.
interface Player {
    name: string;
    score: number;
}

interface PlayerRoundData {
    playerName: string;
    bid: number;
    actual: number;
    bonus: number;
    roundScore: number;
}

interface RoundData {
    roundNumber: number;
    playerData: PlayerRoundData[];
    commentary: string;
}

export interface GameStateData {
    players: Player[];
    rounds: RoundData[];
    currentRound: number;
}
