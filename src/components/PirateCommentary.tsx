import { h } from 'preact';
import { GameViewModel } from '../gameViewModel';

interface PirateCommentaryProps {
    viewModel: GameViewModel;
}

export function PirateCommentary({ viewModel }: PirateCommentaryProps) {
    const commentary = viewModel.getCurrentCommentary();
    const hasRounds = viewModel.hasRounds(); // Only show game commentary if rounds have started

    if (!commentary || !hasRounds) {
        // Or if you want commentary even before first round, remove !hasRounds
        return null;
    }

    return (
        <div id="pirate-commentary" class="pirate-commentary">
            <div class="commentary-content">
                <span class="commentary-icon">🦜</span>
                <span id="commentary-text" class="commentary-text">
                    {commentary}
                </span>
            </div>
        </div>
    );
}
