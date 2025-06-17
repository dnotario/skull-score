import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

interface SetupPageProps {
    onGameStart: (playerNames: string[]) => void;
    showErrorModal: (message: string) => void;
}

export function SetupPage({ onGameStart, showErrorModal }: SetupPageProps) {
    const [viewMode, setViewMode] = useState<'landing' | 'playerSetup'>('landing');
    const [tempPlayers, setTempPlayers] = useState<string[]>(['']);
    // errorMessage state is removed, showErrorModal prop will be used

    const handleAddPlayer = () => {
        if (tempPlayers.length < 8) {
            setTempPlayers([...tempPlayers, '']);
        } else {
            showErrorModal('Maximum 8 pirates allowed! Can\'t add more players.');
        }
    };

    const handleRemovePlayer = (index: number) => {
        if (tempPlayers.length > 1) {
            setTempPlayers(tempPlayers.filter((_, i) => i !== index));
        } else {
            setTempPlayers(['']);
        }
    };

    const handlePlayerNameChange = (index: number, value: string) => {
        const newTempPlayers = [...tempPlayers];
        newTempPlayers[index] = value;
        setTempPlayers(newTempPlayers);
    };

    const handleStartGameInternal = () => {
        const validNames = tempPlayers
            .map(name => name.trim())
            .filter(name => name !== '');

        if (validNames.length < 2) {
            showErrorModal('Ye need at least 2 pirates to sail these waters!');
            return;
        }
        if (validNames.length > 8) {
            showErrorModal('Too many pirates! Maximum 8 scallywags allowed.');
            return;
        }
        const uniqueNames = new Set(validNames.map(name => name.toLowerCase()));
        if (uniqueNames.size !== validNames.length) {
            showErrorModal('Each pirate needs a unique name, ye scurvy dogs!');
            return;
        }

        // If onGameStart itself might result in an error (like in App.tsx),
        // that error will be handled by App.tsx's showErrorModal.
        // No need to clear local error message here as it's removed.
        onGameStart(validNames);
    };

    if (viewMode === 'landing') {
        return (
            <section class="landing-section">
                <div class="parchment">
                    <h2>Free Skull King Score Keeper & Digital Scorecard</h2>
                    <p>The ultimate Skull King score tracker with automatic calculations, pirate commentary, and mobile-friendly design. Keep track of your Skull King card game scores like a true pirate captain!</p>

                    <h3>Perfect Skull King Scoring Solution</h3>
                    <ul class="feature-list">
                        <li>📱 <strong>Mobile Skull King Scorecard</strong> - Works on phones, tablets, and computers</li>
                        <li>🧮 <strong>Automatic Score Calculator</strong> - No more manual Skull King scoring errors</li>
                        <li>🦜 <strong>Pirate Commentary</strong> - Entertaining feedback on your Skull King gameplay</li>
                        <li>🔊 <strong>Audio Score Reader</strong> - Hear your Skull King scores announced</li>
                        <li>💾 <strong>Game State Saving</strong> - Never lose your Skull King scoring progress</li>
                    </ul>

                    <div class="player-setup">
                        <button class="btn btn-primary" onClick={() => setViewMode('playerSetup')}>Start Your Skull King Score Tracking</button>
                    </div>

                    <div class="seo-content">
                        <h4>Why Choose Our Skull King Score Keeper?</h4>
                        <p>Whether you're playing Skull King at home, at a game night, or in a tournament, our digital scorecard makes Skull King scoring effortless. Track bids, actual tricks, bonus points, and watch your Skull King scores calculate automatically. Perfect for Skull King enthusiasts who want accurate, fast scoring.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section class="player-names-section">
            <div class="parchment">
                <h2>Name Yer Crew</h2>
                {/* Error messages are now handled by the modal in App.tsx */}
                <div id="player-names-inputs">
                    {tempPlayers.map((name, index) => (
                        <div class="player-name-input" key={index}>
                            <input
                                type="text"
                                placeholder="Enter pirate name..."
                                value={name}
                                onInput={(e) => handlePlayerNameChange(index, (e.target as HTMLInputElement).value)}
                            />
                            <button class="btn-remove" title="Remove player" onClick={() => handleRemovePlayer(index)}>✕</button>
                        </div>
                    ))}
                </div>
                <button id="add-player-btn" class="btn btn-secondary" onClick={handleAddPlayer} disabled={tempPlayers.length >= 8}>Add Pirate</button>
                <button id="start-game-btn" class="btn btn-primary" onClick={handleStartGameInternal}>Set Sail!</button>
                <button id="cancel-setup-btn" class="btn btn-secondary" onClick={() => { setViewMode('landing'); }}>Back to Port</button>
            </div>
        </section>
    );
}
