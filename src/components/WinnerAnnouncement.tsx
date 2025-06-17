import { h } from 'preact';
import { GameViewModel } from '../gameViewModel';

interface WinnerAnnouncementProps {
    viewModel: GameViewModel;
}

export function WinnerAnnouncement({ viewModel }: WinnerAnnouncementProps) {
    if (!viewModel.isGameComplete()) {
        return null;
    }

    const announcementText = viewModel.generateWinnerAnnouncement();

    return (
        <div id="winner-announcement" class="winner-announcement parchment">
            <div class="winner-header">
                <h2>🏴‍☠️ Game Complete! 🏴‍☠️</h2>
            </div>
            <div id="winner-text" class="winner-text">
                {announcementText}
            </div>
        </div>
    );
}
