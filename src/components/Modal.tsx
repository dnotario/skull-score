import { h, ComponentChildren } from 'preact';

export interface ModalProps {
    isOpen: boolean;
    title: string;
    children: ComponentChildren;
    showConfirmButton?: boolean;
    confirmText?: string;
    onConfirm?: () => void;
    showCancelButton?: boolean;
    cancelText?: string;
    onCancel?: () => void;

    // Specific to New Game Modal variant
    showNewGameOptions?: boolean;
    samePlayersText?: string;
    onSamePlayers?: () => void;
    onNewPlayers?: () => void;
    onCancelNewGame?: () => void; // Should typically be the same as onCancel
}

export function Modal(props: ModalProps) {
    if (!props.isOpen) {
        return null;
    }

    const handleConfirm = () => {
        if (props.onConfirm) {
            props.onConfirm();
        }
    };

    const handleCancel = () => {
        if (props.onCancel) {
            props.onCancel();
        }
    };

    const handleSamePlayers = () => {
        if (props.onSamePlayers) {
            props.onSamePlayers();
        }
    };

    const handleNewPlayers = () => {
        if (props.onNewPlayers) {
            props.onNewPlayers();
        }
    };

    const handleCancelNewGame = () => {
        if (props.onCancelNewGame) {
            props.onCancelNewGame();
        } else if (props.onCancel) { // Fallback to general onCancel
            props.onCancel();
        }
    };


    // Default values
    const confirmText = props.confirmText || 'Aye';
    const cancelText = props.cancelText || 'Nay';
    const showConfirm = props.showConfirmButton === undefined ? true : props.showConfirmButton;
    const showCancel = props.showCancelButton === undefined ? true : props.showCancelButton;

    return (
        <div id="modal" class="modal" style={{ display: 'flex' }}> {/* Use style to show/hide based on isOpen via parent */}
            <div class="modal-content parchment">
                <h3 id="modal-title">{props.title}</h3>

                <div id="modal-message" class="modal-message-body"> {/* Added a class for children styling */}
                    {props.children}
                </div>

                {props.showNewGameOptions ? (
                    <div id="new-game-options" class="new-game-options">
                        {props.samePlayersText && props.onSamePlayers && (
                            <button class="btn btn-primary" onClick={handleSamePlayers}>{props.samePlayersText}</button>
                        )}
                        {props.onNewPlayers && (
                           <button class="btn btn-secondary" onClick={handleNewPlayers}>New Players</button>
                        )}
                        <button class="btn btn-secondary" onClick={handleCancelNewGame}>{props.cancelText || 'Cancel'}</button>
                    </div>
                ) : (
                    <div id="modal-buttons" class="modal-buttons">
                        {showConfirm && (
                            <button id="modal-confirm" class="btn btn-primary" onClick={handleConfirm}>
                                {confirmText}
                            </button>
                        )}
                        {showCancel && (
                            <button id="modal-cancel" class="btn btn-secondary" onClick={handleCancel}>
                                {cancelText}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
