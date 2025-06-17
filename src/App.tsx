import { h, Fragment, ComponentChildren } from 'preact';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { SetupPage } from './components/SetupPage';
import { GamePage } from './components/GamePage';
import { GameViewModel, BeforeInstallPromptEvent } from './gameViewModel';
import { Modal, ModalProps } from './components/Modal';

export function App() {
    const [viewModel, setViewModel] = useState<GameViewModel | null>(null);
    const [currentTheme, setCurrentTheme] = useState<string>('parchment'); // eslint-disable-line @typescript-eslint/no-unused-vars
    const [appRevision, setAppRevision] = useState<number>(0);
    const [modalConfig, setModalConfig] = useState<ModalProps | null>(null);
    const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallButton, setShowInstallButton] = useState<boolean>(false);

    const forceAppUpdate = useCallback(() => {
        setAppRevision(prev => prev + 1);
    }, [appRevision]);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallPromptEvent(event as BeforeInstallPromptEvent);
            setShowInstallButton(true);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setShowInstallButton(false);
        }
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (installPromptEvent) {
            installPromptEvent.prompt();
            const { outcome } = await installPromptEvent.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            setInstallPromptEvent(null);
            setShowInstallButton(false);
        } else {
            showModal({
                title: "Install App",
                children: (
                    h('div', null,
                        h('p', null, "To install this app, please use your browser's \"Add to Home Screen\" or \"Install\" option."),
                        h('p', null, h('strong', null, "iOS:"), " Tap Share, then \"Add to Home Screen\"."),
                        h('p', null, h('strong', null, "Android:"), " Tap menu, then \"Install app\" or \"Add to Home screen\".")
                    )
                ),
                confirmText: "Got it!",
                showCancelButton: false,
            });
        }
    };

    const hideModal = () => setModalConfig(null);

    const showModal = (config: Omit<ModalProps, 'isOpen' | 'children'>, children?: ComponentChildren) => {
        const onCancelAction = config.onCancel ? () => { config.onCancel!(); hideModal(); } : hideModal;
        const onConfirmAction = config.onConfirm ? () => { config.onConfirm!(); hideModal(); } : hideModal;
        const onSamePlayersAction = config.onSamePlayers ? () => { config.onSamePlayers!(); hideModal(); } : undefined;
        const onNewPlayersAction = config.onNewPlayers ? () => { config.onNewPlayers!(); hideModal(); } : undefined;
        const onCancelNewGameAction = config.onCancelNewGame ? () => { config.onCancelNewGame!(); hideModal(); } : onCancelAction;

        setModalConfig({
            ...config,
            isOpen: true,
            children: children || config.children,
            onConfirm: onConfirmAction,
            onCancel: onCancelAction,
            onSamePlayers: onSamePlayersAction,
            onNewPlayers: onNewPlayersAction,
            onCancelNewGame: onCancelNewGameAction,
        });
    };

    const showErrorModal = (message: string) => {
        showModal({
            title: 'Arr! Input Error',
            confirmText: "Aye, I'll fix it!",
            showCancelButton: false,
        }, h('p', null, message));
    };

    const handleGameStart = (names: string[]) => {
        const newViewModel = new GameViewModel();
        newViewModel.setTempPlayers(names);
        const error = newViewModel.validateAndStartGame();
        if (error) {
            showErrorModal(error);
            return;
        }
        setViewModel(newViewModel);
        forceAppUpdate();
    };

    const handleNewGameRequest = () => {
        const currentPlayersNames = viewModel?.getGameState().players.map(p => p.name).join(', ') || "";
        showModal({
            title: 'Start New Game',
            children: h('p', null, 'Choose how ye want to start yer new adventure:'),
            showNewGameOptions: true,
            samePlayersText: `Same Pirates (${currentPlayersNames})`,
            onSamePlayers: () => {
                if (viewModel) {
                    const playerNames = viewModel.getGameState().players.map(p => p.name);
                    const newViewModel = new GameViewModel();
                    newViewModel.setTempPlayers(playerNames);
                    const error = newViewModel.validateAndStartGame();
                    if (error) {
                        showErrorModal(error);
                        setViewModel(viewModel);
                    } else {
                        setViewModel(newViewModel);
                        forceAppUpdate();
                    }
                }
            },
            onNewPlayers: () => {
                setViewModel(null);
            },
        });
    };

    // Using JSX for PageWrapper as it's a common pattern and should work.
    // If this still causes issues, the problem might be deeper in Parcel/TS/Preact config.
    const PageWrapper = ({ children }: { children: ComponentChildren }) => (
        h(Fragment, null,
            h('header', { class: `pirate-header theme-${currentTheme}` },
                h('div', { class: "header-content" },
                    h('h1', null, "⚓ Skull King Score Keeper ☠️"),
                    h('p', { class: "tagline" },
                        viewModel ? "Game On, Captains!" : "Track Yer Plunder, Ye Scurvy Dogs! (Preact Edition)"
                    ),
                    showInstallButton && h('button', {
                        id: "install-app-btn-header",
                        class: "install-app-btn-header",
                        title: "Install App",
                        onClick: handleInstallClick
                    }, "📱 Install")
                )
            ),
            h('main', { class: `container theme-${currentTheme}` }, children),
            modalConfig && modalConfig.isOpen && h(Modal, { ...modalConfig }), // Pass modalConfig directly
            h('footer', { class: `disclaimer-footer theme-${currentTheme}` },
                h('div', { class: "container" },
                    h('div', { class: "disclaimer-content" },
                        h('p', null, h('strong', null, "Disclaimer:"), " This website is an independent fan-created score keeper for the Skull King card game..."),
                        h('p', null, "For feedback, suggestions, or bug reports, contact: ",
                            h('a', { href: "mailto:captain@skullkingscorekeeper.com", class: "feedback-link" }, "captain@skullkingscorekeeper.com")
                        )
                    )
                )
            )
        )
    );

    if (!viewModel) {
        return h(PageWrapper, null,
            h(SetupPage, { onGameStart: handleGameStart, showErrorModal: showErrorModal })
        );
    }

    return h(PageWrapper, null,
        h(GamePage, {
            key: appRevision, // key is a standard Preact prop, no need to declare in GamePageProps
            viewModel: viewModel,
            forceAppUpdate: forceAppUpdate,
            onRequestNewGame: handleNewGameRequest,
            showErrorModal: showErrorModal
        })
    );
}
