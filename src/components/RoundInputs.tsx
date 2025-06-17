import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { GameViewModel } from '../gameViewModel'; // Adjust path as necessary
import { Player } from '../gameViewModel'; // Assuming Player is exported or create/import a specific type

interface RoundInputsProps {
    viewModel: GameViewModel;
    onRoundAdded: () => void;
}

export function RoundInputs({ viewModel, onRoundAdded }: RoundInputsProps) {
    const [roundBids, setRoundBids] = useState<{ [playerName: string]: string }>({});
    const [roundActuals, setRoundActuals] = useState<{ [playerName: string]: string }>({});
    const [roundBonuses, setRoundBonuses] = useState<{ [playerName: string]: string }>({});
    const [playerScores, setPlayerScores] = useState<{ [playerName: string]: { score: number | string; className: string } }>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const activePlayers = viewModel.getGameState().players;
    const currentRoundNumber = viewModel.getCurrentRoundNumber();
    const maxTricksForRound = viewModel.getMaxTricksForCurrentRound();

    const initializeInputs = useCallback(() => {
        const initialBids: { [playerName: string]: string } = {};
        const initialActuals: { [playerName: string]: string } = {};
        const initialBonuses: { [playerName: string]: string } = {};
        const initialScores: { [playerName: string]: { score: number | string; className: string } } = {};

        activePlayers.forEach(player => {
            initialBids[player.name] = '';
            initialActuals[player.name] = '';
            initialBonuses[player.name] = '';
            initialScores[player.name] = { score: '-', className: 'computed-score' };
        });

        setRoundBids(initialBids);
        setRoundActuals(initialActuals);
        setRoundBonuses(initialBonuses);
        setPlayerScores(initialScores);
        setErrorMessage(null);
    }, [activePlayers]); // Dependency: activePlayers list

    useEffect(() => {
        initializeInputs();
    }, [currentRoundNumber, initializeInputs]); // Re-initialize when round changes or players change

    const updateDynamicScores = useCallback(() => {
        const newPlayerScores: { [playerName: string]: { score: number | string; className: string } } = {};
        activePlayers.forEach(player => {
            const bidStr = roundBids[player.name] || '';
            const actualStr = roundActuals[player.name] || '';
            const bonusStr = roundBonuses[player.name] || '0'; // Default bonus to '0' if empty for calculation

            if (bidStr === '' || actualStr === '') {
                newPlayerScores[player.name] = { score: '-', className: 'computed-score' };
                return;
            }

            const bid = parseInt(bidStr, 10);
            const actual = parseInt(actualStr, 10);
            const bonus = parseInt(bonusStr, 10);

            // Validate individual input first
            const validationError = viewModel.validateSinglePlayerInput(bid, actual, bonus, player.name, currentRoundNumber);
            if (validationError) {
                newPlayerScores[player.name] = { score: 'Err', className: 'computed-score invalid' };
                // Optionally, set a player-specific error message or highlight field
                return;
            }

            const score = viewModel.testCalculateRoundScore(bid, actual, bonus, currentRoundNumber);
            newPlayerScores[player.name] = {
                score: score > 0 ? `+${score}` : score.toString(),
                className: `computed-score ${score > 0 ? 'positive' : score < 0 ? 'negative' : 'zero'}`
            };
        });
        setPlayerScores(newPlayerScores);
    }, [activePlayers, roundBids, roundActuals, roundBonuses, viewModel, currentRoundNumber]);

    useEffect(() => {
        updateDynamicScores();
    }, [roundBids, roundActuals, roundBonuses, updateDynamicScores]);


    const handleInputChange = (playerName: string, field: 'bid' | 'actual' | 'bonus', value: string) => {
        setErrorMessage(null); // Clear global error on new input
        if (field === 'bid') {
            setRoundBids(prev => ({ ...prev, [playerName]: value }));
        } else if (field === 'actual') {
            setRoundActuals(prev => ({ ...prev, [playerName]: value }));
        } else {
            setRoundBonuses(prev => ({ ...prev, [playerName]: value }));
        }
        // updateDynamicScores will be called by its own useEffect
    };

    const handleRecordRound = () => {
        const collectedData: { [playerName: string]: { bid: number; actual: number; bonus: number } } = {};
        let hasParsingError = false;

        for (const player of activePlayers) {
            const bidStr = roundBids[player.name];
            const actualStr = roundActuals[player.name];
            const bonusStr = roundBonuses[player.name] || '0'; // Default bonus to 0 if empty

            if (bidStr === '' || actualStr === '') {
                setErrorMessage(`Bid and Actual tricks are required for ${player.name}.`);
                hasParsingError = true;
                break;
            }

            const bid = parseInt(bidStr, 10);
            const actual = parseInt(actualStr, 10);
            const bonus = parseInt(bonusStr, 10);

            if (isNaN(bid) || isNaN(actual) || isNaN(bonus)) {
                setErrorMessage(`Invalid number input for ${player.name}.`);
                hasParsingError = true;
                break;
            }
            collectedData[player.name] = { bid, actual, bonus };
        }

        if (hasParsingError) {
            return;
        }

        const error = viewModel.addRound(collectedData);
        if (error) {
            setErrorMessage(error);
        } else {
            setErrorMessage(null);
            onRoundAdded(); // This will trigger forceAppUpdate in App.tsx
            // Inputs will be cleared by useEffect watching currentRoundNumber change
        }
    };

    const roundDisplayInfo = maxTricksForRound < currentRoundNumber ?
        `${currentRoundNumber} (${maxTricksForRound} cards each)` :
        currentRoundNumber.toString();

    return (
        <div id="new-round" class="new-round parchment">
            <div class="round-header">
                <h3>Round <span id="round-number">{roundDisplayInfo}</span></h3>
            </div>
            {errorMessage && <p class="error-message" style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
            <div id="round-inputs" class="round-inputs">
                {activePlayers.map((player: Player) => (
                    <div class="player-round-input" key={player.name}>
                        <h4>{player.name}</h4>
                        <div class="round-input-row">
                            <div class="input-group">
                                <label for={`bid-${player.name}`} class="input-label">Bid</label>
                                <input
                                    type="number"
                                    id={`bid-${player.name}`}
                                    placeholder="0"
                                    min="0"
                                    max={maxTricksForRound.toString()}
                                    value={roundBids[player.name] || ''}
                                    onInput={(e) => handleInputChange(player.name, 'bid', (e.target as HTMLInputElement).value)}
                                />
                            </div>
                            <div class="input-group">
                                <label for={`actual-${player.name}`} class="input-label">Won</label>
                                <input
                                    type="number"
                                    id={`actual-${player.name}`}
                                    placeholder="0"
                                    min="0"
                                    max={maxTricksForRound.toString()}
                                    value={roundActuals[player.name] || ''}
                                    onInput={(e) => handleInputChange(player.name, 'actual', (e.target as HTMLInputElement).value)}
                                />
                            </div>
                            <div class="input-group">
                                <label for={`bonus-${player.name}`} class="input-label">Bonus</label>
                                <input
                                    type="number"
                                    id={`bonus-${player.name}`}
                                    placeholder="0"
                                    min="0"
                                    value={roundBonuses[player.name] || ''}
                                    onInput={(e) => handleInputChange(player.name, 'bonus', (e.target as HTMLInputElement).value)}
                                />
                            </div>
                            <div class="input-group">
                                <label class="input-label">Score</label>
                                <div id={`score-${player.name}`} class={`computed-score ${playerScores[player.name]?.className || ''}`}>
                                    {playerScores[player.name]?.score || '-'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div class="record-round-container">
                <button id="add-round-btn" class="btn btn-primary" onClick={handleRecordRound}>Record Round</button>
            </div>
        </div>
    );
}
