import { h } from 'preact';
import { GameViewModel } from '../gameViewModel';

interface PreviousRoundsProps {
    viewModel: GameViewModel;
    // handleEditLastRound is managed by GamePage as it affects RoundInputs sibling
}

export function PreviousRounds({ viewModel }: PreviousRoundsProps) {
    const rounds = viewModel.getGameState().rounds;
    const isGameComplete = viewModel.isGameComplete();

    if (rounds.length === 0) {
        return null; // Or a placeholder like <p>No rounds recorded yet.</p>
    }

    // Display rounds in reverse order (newest first)
    const sortedRounds = [...rounds].slice().reverse();

    return (
        <div id="previous-rounds" class="previous-rounds">
            <h3>Previous Rounds</h3>
            {sortedRounds.map(round => (
                <div key={round.roundNumber} class="round-display parchment">
                    <div class="round-header">
                        <h4>Round {round.roundNumber}</h4>
                        {/* The "Edit Last Round" button is in GamePage as it needs to interact with RoundInputs or App state */}
                    </div>
                    <div class="round-data">
                        <div class="round-data-header">
                            <span>Player</span>
                            <span>Bid</span>
                            <span>Won</span>
                            <span>Bonus</span>
                            <span>Score</span>
                        </div>
                        {round.playerData.map(data => (
                            <div class="player-round-data" key={data.playerName}>
                                <strong>{data.playerName}</strong>
                                <span>{data.bid}</span>
                                <span>{data.actual}</span>
                                <span>{data.bonus}</span>
                                <span>{data.roundScore > 0 ? '+' : ''}{data.roundScore}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
