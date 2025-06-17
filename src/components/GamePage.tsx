import { h, Fragment } from 'preact';
import { GameViewModel } from '../gameViewModel';
import { ScoreDisplay } from './ScoreDisplay';
import { RoundInputs } from './RoundInputs';
import { PreviousRounds } from './PreviousRounds'; // Import new component
import { PirateCommentary } from './PirateCommentary'; // Import new component
import { WinnerAnnouncement } from './WinnerAnnouncement'; // Import new component

interface GamePageProps {
    viewModel: GameViewModel;
    forceAppUpdate: () => void;
    onRequestNewGame: () => void;
    showErrorModal: (message: string) => void; // Added this prop
}

export function GamePage({ viewModel, forceAppUpdate, onRequestNewGame, showErrorModal }: GamePageProps) {
    const handleEditLastRound = () => {
        const lastRoundData = viewModel.removeLastRound();
        if (lastRoundData) {
            forceAppUpdate();
            console.log("Last round removed, data:", lastRoundData);
        } else {
            console.log("No rounds to remove for editing.");
        }
    };

    const isGameComplete = viewModel.isGameComplete();
    const showPreviousRounds = viewModel.getGameState().rounds.length > 0;

    // The "Edit Last Round" button needs to be passed to PreviousRounds or handled here
    // For simplicity, if PreviousRounds is purely display, GamePage keeps edit logic.
    // However, the button itself is thematically part of the PreviousRounds display for the latest round.
    // Let's keep the button logic here in GamePage for now, similar to original.
    // A more component-based approach might pass a specific callback to PreviousRounds for just that button.

    return (
        <Fragment>
            <div class="new-game-section parchment">
                <div class="global-actions">
                    <button id="new-game-ingame-btn" class="btn btn-secondary" onClick={onRequestNewGame}>
                        New Game
                    </button>
                </div>
            </div>

            <ScoreDisplay viewModel={viewModel} forceAppUpdate={forceAppUpdate} showErrorModal={showErrorModal} />

            <WinnerAnnouncement viewModel={viewModel} />

            {!isGameComplete && (
                <RoundInputs viewModel={viewModel} onRoundAdded={forceAppUpdate} />
            )}

            <PirateCommentary viewModel={viewModel} />

            {/* PreviousRounds component now handles its own rendering logic, including the "Edit Last Round" button */}
            {/* We might need to pass handleEditLastRound to PreviousRounds if the button is inside it */}
            {/* For now, the button is outside PreviousRounds if it's part of GamePage's direct layout */}

            {showPreviousRounds && (
                <div id="previous-rounds-container"> {/* Wrapper for PreviousRounds and potentially its Edit button if kept separate */}
                     <PreviousRounds viewModel={viewModel} />
                     {/* Example: If Edit button is for the overall last round and part of GamePage logic directly: */}
                     {!isGameComplete && viewModel.getGameState().rounds.length > 0 && (
                        <div class="edit-last-round-section parchment" style={{textAlign: 'center', padding: '10px'}}>
                             <button
                                class="btn btn-secondary"
                                onClick={handleEditLastRound}
                                title="Removes the last recorded round and allows you to re-enter scores for it."
                            >
                                Edit Last Round
                            </button>
                        </div>
                     )}
                </div>
            )}
        </Fragment>
    );
}
