import { h } from 'preact';
import { GameViewModel } from '../gameViewModel';

interface ScoreDisplayProps {
    viewModel: GameViewModel;
    forceAppUpdate: () => void;
    showErrorModal: (message: string) => void;
}

export function ScoreDisplay({ viewModel, showErrorModal }: ScoreDisplayProps) {
    const sortedPlayers = viewModel.getPlayersSortedByScore();

    const handleReadScores = () => {
        if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance'in window)) {
            showErrorModal('Arr! Yer browser doesn\'t support speech. Try a newer vessel!');
            return;
        }

        window.speechSynthesis.cancel(); // Cancel any ongoing speech

        const announcement = viewModel.createScoreAnnouncement();
        const utterance = new SpeechSynthesisUtterance(announcement);

        utterance.rate = 0.8;
        utterance.pitch = 0.7;
        utterance.volume = 1;

        const setVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length === 0) {
                // Voices not loaded yet, try again.
                // This can happen on some browsers.
                setTimeout(setVoice, 50);
                return;
            }

            // Try to find a "pirate-y" or distinct male voice
            const pirateVoice = voices.find(voice =>
                voice.lang.startsWith('en') &&
                (voice.name.toLowerCase().includes('male') ||
                 voice.name.toLowerCase().includes('daniel') || // Common good quality voice
                 voice.name.toLowerCase().includes('david') ||
                 voice.name.toLowerCase().includes('paul') ||
                 voice.name.toLowerCase().includes('alex') ||
                 voice.name.toLowerCase().includes('microsoft david desktop') || // Windows
                 voice.name.toLowerCase().includes('google us english')) // Android/ChromeOS
            ) || voices.find(voice => voice.lang.startsWith('en') && !voice.name.toLowerCase().includes('female'))
              || voices.find(voice => voice.lang.startsWith('en')); // Fallback to any English voice

            if (pirateVoice) {
                utterance.voice = pirateVoice;
                console.log(`Using voice: ${pirateVoice.name} (${pirateVoice.lang})`);
            } else {
                console.log("No specific pirate voice found, using default.");
            }

            window.speechSynthesis.speak(utterance);
        };

        // Browsers might load voices asynchronously.
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = setVoice;
        } else {
            setVoice();
        }
    };

    return (
        <div class="current-scores parchment">
            <div class="score-header">
                <h2>Current Bounty</h2>
                <button id="read-scores-btn" class="btn btn-primary" onClick={handleReadScores}>
                    🔊 Read Scores
                </button>
            </div>
            <div id="score-display" class="score-grid">
                {sortedPlayers.map(player => (
                    <div class="player-score" key={player.name}>
                        <h4>{player.name}</h4>
                        <div class="score-value">{player.score}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
