/**
 * Translation system for Skull King Score Keeper
 * Supports English, German, and Spanish with pirate-themed vocabulary
 */

// Language interface definition
interface Translation {
    // Meta tags and SEO
    page_title: string;
    page_description: string;
    page_keywords: string;
    og_title: string;
    og_description: string;
    twitter_description: string;
    app_title: string;
    
    // Header and navigation
    header_title: string;
    header_tagline: string;
    
    // Landing page
    landing_title: string;
    landing_description: string;
    landing_subtitle: string;
    feature_mobile: string;
    feature_calculator: string;
    feature_commentary: string;
    feature_audio: string;
    feature_saving: string;
    start_button: string;
    why_choose_title: string;
    why_choose_description: string;
    
    // Player setup
    name_crew_title: string;
    add_pirate_button: string;
    set_sail_button: string;
    back_to_port_button: string;
    player_placeholder: string;
    
    // Game section
    current_bounty_title: string;
    read_scores_button: string;
    game_complete_title: string;
    round_label: string;
    record_round_button: string;
    
    // Round inputs
    bid_label: string;
    won_label: string;
    bonus_label: string;
    score_label: string;
    
    // Modal
    confirm_action_title: string;
    keep_names_label: string;
    new_players_button: string;
    cancel_button: string;
    aye_button: string;
    nay_button: string;
    same_players_prefix: string;
    
    // Button labels
    new_game_button: string;
    edit_round_button: string;
    
    // Error messages
    min_players_error: string;
    max_players_error: string;
    duplicate_names_error: string;
    max_players_add_error: string;
    invalid_number_error: string;
    whole_numbers_error: string;
    non_negative_error: string;
    bid_exceeds_tricks_error: string;
    actual_exceeds_tricks_error: string;
    bonus_without_correct_bid_error: string;
    unreasonable_bonus_error: string;
    total_tricks_mismatch_error: string;
    no_rounds_to_edit_error: string;
    browser_speech_error: string;
    input_error_title: string;
    fix_it_button: string;
    
    // Commentary - Perfect rounds
    perfect_round_1: string;
    perfect_round_2: string;
    perfect_round_3: string;
    
    // Commentary - Single disasters  
    disaster_1: string;
    disaster_2: string;
    disaster_3: string;
    
    // Commentary - Multiple big scores
    big_scores_1: string;
    big_scores_2: string;
    big_scores_3: string;
    
    // Commentary - Default
    default_1: string;
    default_2: string;
    default_3: string;
    default_4: string;
    default_5: string;
    
    // Start commentary
    start_1: string;
    start_2: string;
    start_3: string;
    
    // Winner announcements - Single winner
    winner_single_1: string;
    winner_single_2: string;
    winner_single_3: string;
    winner_single_4: string;
    
    // Winner announcements - Tie
    winner_tie_1: string;
    winner_tie_2: string;
    winner_tie_3: string;
    
    // Score announcements
    no_game_announce: string;
    ahoy_mateys: string;
    current_bounty_after: string;
    leading_fleet: string;
    bringing_rear: string;
    follows_with: string;
    may_winds_favor: string;
    
    // Footer
    disclaimer_title: string;
    disclaimer_text_1: string;
    disclaimer_text_2: string;
    feedback_text: string;
    
    // PWA Install
    add_to_home_title: string;
    android_chrome_title: string;
    android_step_1: string;
    android_step_2: string;
    android_step_3: string;
    ios_safari_title: string;
    ios_step_1: string;
    ios_step_2: string;
    ios_step_3: string;
    close_button: string;
    
    // New game modal
    new_game_modal_title: string;
    new_game_modal_message: string;
    
    // Currencies (for score announcements)
    pieces_of_eight: string;
    doubloons: string;
    gold_coins: string;
}

// English translations (default)
const en: Translation = {
    // Meta tags and SEO
    page_title: "Skull King Score Keeper - Free Digital Scorecard & Score Tracker",
    page_description: "Free Skull King score keeper and digital scorecard. Track scores, calculate points, and enjoy pirate commentary for the Skull King card game. Mobile-friendly score tracker with automatic scoring.",
    page_keywords: "Skull King, score keeper, scorecard, score tracker, Skull King scoring, card game scorer, trick taking game, pirate game, score calculator, digital scorecard",
    og_title: "Skull King Score Keeper - Free Digital Scorecard",
    og_description: "Free digital score keeper for Skull King card game. Track scores with pirate commentary and automatic calculations.",
    twitter_description: "Free digital score keeper for Skull King card game with automatic scoring and pirate commentary.",
    app_title: "Skull King",
    
    // Header and navigation
    header_title: "⚓ Skull King Score Keeper ☠️",
    header_tagline: "Track Yer Plunder, Ye Scurvy Dogs!",
    
    // Landing page
    landing_title: "Free Skull King Score Keeper & Digital Scorecard",
    landing_description: "The ultimate Skull King score tracker with automatic calculations, pirate commentary, and mobile-friendly design. Keep track of your Skull King card game scores like a true pirate captain!",
    landing_subtitle: "Perfect Skull King Scoring Solution",
    feature_mobile: "📱 <strong>Mobile Skull King Scorecard</strong> - Works on phones, tablets, and computers",
    feature_calculator: "🧮 <strong>Automatic Score Calculator</strong> - No more manual Skull King scoring errors",
    feature_commentary: "🦜 <strong>Pirate Commentary</strong> - Entertaining feedback on your Skull King gameplay",
    feature_audio: "🔊 <strong>Audio Score Reader</strong> - Hear your Skull King scores announced",
    feature_saving: "💾 <strong>Game State Saving</strong> - Never lose your Skull King scoring progress",
    start_button: "Start Your Skull King Score Tracking",
    why_choose_title: "Why Choose Our Skull King Score Keeper?",
    why_choose_description: "Whether you're playing Skull King at home, at a game night, or in a tournament, our digital scorecard makes Skull King scoring effortless. Track bids, actual tricks, bonus points, and watch your Skull King scores calculate automatically. Perfect for Skull King enthusiasts who want accurate, fast scoring.",
    
    // Player setup
    name_crew_title: "Name Yer Crew",
    add_pirate_button: "Add Pirate",
    set_sail_button: "Set Sail!",
    back_to_port_button: "Back to Port",
    player_placeholder: "Enter pirate name...",
    
    // Game section
    current_bounty_title: "Current Bounty",
    read_scores_button: "🔊 Read Scores",
    game_complete_title: "🏴‍☠️ Game Complete! 🏴‍☠️",
    round_label: "Round",
    record_round_button: "Record Round",
    
    // Round inputs
    bid_label: "Bid",
    won_label: "Won",
    bonus_label: "Bonus",
    score_label: "Score",
    
    // Modal
    confirm_action_title: "Confirm Action",
    keep_names_label: "Keep player names",
    new_players_button: "New Players",
    cancel_button: "Cancel",
    aye_button: "Aye",
    nay_button: "Nay",
    same_players_prefix: "Same Players",
    
    // Button labels
    new_game_button: "New Game",
    edit_round_button: "Edit Round",
    
    // Error messages
    min_players_error: "Ye need at least 2 pirates to sail these waters!",
    max_players_error: "Too many pirates! Maximum 8 scallywags allowed.",
    duplicate_names_error: "Each pirate needs a unique name, ye scurvy dogs!",
    max_players_add_error: "Maximum 8 pirates allowed! Can't add more players.",
    invalid_number_error: "Invalid number entered for {playerName}. Please enter valid numbers only.",
    whole_numbers_error: "All values must be whole numbers for {playerName}.",
    non_negative_error: "Bid, actual tricks, and bonus must be non-negative for {playerName}.",
    bid_exceeds_tricks_error: "{playerName}'s bid ({bid}) can't exceed {maxTricks} tricks in round {round} with {playerCount} players.",
    actual_exceeds_tricks_error: "{playerName} can't win more than {maxTricks} tricks in round {round} with {playerCount} players. Actual: {actual}",
    bonus_without_correct_bid_error: "{playerName} can only earn bonus points when correctly predicting tricks! (Bid: {bid}, Actual: {actual})",
    unreasonable_bonus_error: "{playerName}'s bonus points seem unreasonable ({bonus}). Please check your entry.",
    total_tricks_mismatch_error: "Total tricks won ({totalActual}) must equal the number of tricks available ({maxTricks}) in round {round} with {playerCount} players.",
    no_rounds_to_edit_error: "No rounds to edit!",
    browser_speech_error: "Arr! Yer browser doesn't support speech. Try a newer vessel!",
    input_error_title: "Arr! Input Error",
    fix_it_button: "Aye, I'll fix it!",
    
    // Commentary - Perfect rounds
    perfect_round_1: "Blimey! Every scallywag nailed their bid! The sea gods smile upon ye all!",
    perfect_round_2: "Shiver me timbers! Perfect round for all hands! Not a single miscalculation!",
    perfect_round_3: "Avast! Every pirate sailed true to their word! What sorcery be this?",
    
    // Commentary - Single disasters
    disaster_1: "Avast! {playerName} be sinkin' faster than a ship with no hull!",
    disaster_2: "{playerName} just sailed straight into a kraken! What a disaster!",
    disaster_3: "Blimey! {playerName} be drownin' in their own overconfidence!",
    
    // Commentary - Multiple big scores
    big_scores_1: "Pieces of eight! Multiple pirates be strikin' gold this round!",
    big_scores_2: "Shiver me timbers! Several captains just filled their treasure chests!",
    big_scores_3: "Multiple pirates be countin' serious doubloons after that performance!",
    
    // Commentary - Default
    default_1: "Another round in the books! The seas be unpredictable as always!",
    default_2: "The tide turns with each round! Stay sharp, ye scurvy dogs!",
    default_3: "Mixed fortunes this round! The ocean gives and takes as she pleases!",
    default_4: "The winds of fortune blow in mysterious ways, ye landlubbers!",
    default_5: "Some pirates swim with the sharks, others sail to victory!",
    
    // Start commentary
    start_1: "Batten down the hatches, me hearties! The adventure begins!",
    start_2: "Hoist the colors! Time to see which scallywag rules these waters!",
    start_3: "All hands on deck! May the best pirate claim the treasure!",
    
    // Winner announcements - Single winner
    winner_single_1: "Huzzah! Captain {name} emerges victorious with {score} pieces of eight! The crown of Skull King belongs to ye!",
    winner_single_2: "Avast! {name} has conquered the seven seas with {score} doubloons! All hail the new Skull King!",
    winner_single_3: "Shiver me timbers! {name} stands triumphant with {score} gold coins! Ye be the true master of these waters!",
    winner_single_4: "Blimey! {name} has plundered the most treasure with {score} pieces of eight! The Skull King's throne is yours!",
    
    // Winner announcements - Tie
    winner_tie_1: "Avast! We have a tie! {names} both finish with {score} pieces of eight! Ye must share the Skull King's crown!",
    winner_tie_2: "Blimey! {names} have tied with {score} doubloons each! Two captains, one throne - may the best pirate win!",
    winner_tie_3: "Shiver me timbers! {names} are deadlocked at {score} gold coins! The seas couldn't choose between such worthy pirates!",
    
    // Score announcements
    no_game_announce: "No active game to announce, ye landlubber!",
    ahoy_mateys: "Ahoy mateys! ",
    current_bounty_after: "Now for the current bounty after round {roundCount}... ",
    leading_fleet: "Leading the fleet, we have {name} with {score} pieces of eight! ",
    bringing_rear: "And bringing up the rear, {name} with {score} doubloons. ",
    follows_with: "{name} follows with {score} gold coins. ",
    may_winds_favor: "May the winds favor the worthy! Arrr!",
    
    // Footer
    disclaimer_title: "Disclaimer:",
    disclaimer_text_1: "This website is an independent fan-created score keeper for the Skull King card game. It is not affiliated with, endorsed by, or connected to Grandpa Beck's Games, the official publisher of Skull King. Skull King is a trademark of Grandpa Beck's Games.",
    disclaimer_text_2: "This tool is provided for educational and entertainment purposes to help players track their game scores.",
    feedback_text: "For feedback, suggestions, or bug reports, contact: ",
    
    // PWA Install
    add_to_home_title: "📱 Add to Home Screen",
    android_chrome_title: "For Android Chrome:",
    android_step_1: "Tap the menu (⋮) in browser",
    android_step_2: "Select \"Add to Home screen\"",
    android_step_3: "Tap \"Add\" to confirm",
    ios_safari_title: "For iOS Safari:",
    ios_step_1: "Tap the share button (⎘)",
    ios_step_2: "Scroll down and tap \"Add to Home Screen\"", 
    ios_step_3: "Tap \"Add\" to confirm",
    close_button: "✕ Close",
    
    // New game modal
    new_game_modal_title: "Start New Game",
    new_game_modal_message: "Choose how ye want to start yer new adventure:",
    
    // Currencies (for score announcements)
    pieces_of_eight: "pieces of eight",
    doubloons: "doubloons", 
    gold_coins: "gold coins"
};

// German translations (pirate-themed)
const de: Translation = {
    // Meta tags and SEO
    page_title: "Skull King Punktezähler - Kostenloses Digitales Scorecard & Punktetracker",
    page_description: "Kostenloser Skull King Punktezähler und digitales Scorecard. Verfolge Punkte, berechne Ergebnisse und genieße Piraten-Kommentare für das Skull King Kartenspiel. Mobilfreundlicher Punktetracker mit automatischer Berechnung.",
    page_keywords: "Skull King, Punktezähler, Scorecard, Punktetracker, Skull King Punkte, Kartenspiel Zähler, Stichspiel, Piratenspiel, Punkterechner, digitales Scorecard",
    og_title: "Skull King Punktezähler - Kostenloses Digitales Scorecard",
    og_description: "Kostenloser digitaler Punktezähler für das Skull King Kartenspiel. Verfolge Punkte mit Piraten-Kommentaren und automatischen Berechnungen.",
    twitter_description: "Kostenloser digitaler Punktezähler für das Skull King Kartenspiel mit automatischer Punkteberechnung und Piraten-Kommentaren.",
    app_title: "Skull King",
    
    // Header and navigation
    header_title: "⚓ Skull King Punktezähler ☠️",
    header_tagline: "Verfolgt Eure Beute, Ihr Schurken!",
    
    // Landing page
    landing_title: "Kostenloser Skull King Punktezähler & Digitales Scorecard",
    landing_description: "Der ultimative Skull King Punktetracker mit automatischen Berechnungen, Piraten-Kommentaren und mobilfreundlichem Design. Verfolge deine Skull King Kartenspiel-Punkte wie ein echter Piratenkapitän!",
    landing_subtitle: "Perfekte Skull King Punktezähllösung",
    feature_mobile: "📱 <strong>Mobile Skull King Scorecard</strong> - Funktioniert auf Handys, Tablets und Computern",
    feature_calculator: "🧮 <strong>Automatischer Punkterechner</strong> - Keine manuellen Skull King Punktezählfehler mehr",
    feature_commentary: "🦜 <strong>Piraten-Kommentare</strong> - Unterhaltsame Rückmeldungen zu deinem Skull King Gameplay",
    feature_audio: "🔊 <strong>Audio-Punkteansager</strong> - Höre deine Skull King Punkte verkündet",
    feature_saving: "💾 <strong>Spielstand speichern</strong> - Verliere nie wieder deinen Skull King Punktefortschritt",
    start_button: "Starte Deine Skull King Punkteverfolgung",
    why_choose_title: "Warum Unseren Skull King Punktezähler Wählen?",
    why_choose_description: "Ob du Skull King zu Hause, bei einem Spieleabend oder in einem Turnier spielst, unser digitales Scorecard macht das Skull King Punktezählen mühelos. Verfolge Gebote, tatsächliche Stiche, Bonuspunkte und sieh zu, wie sich deine Skull King Punkte automatisch berechnen. Perfekt für Skull King Enthusiasten, die präzise, schnelle Punktevergabe wollen.",
    
    // Player setup
    name_crew_title: "Nennt Eure Mannschaft",
    add_pirate_button: "Pirat Hinzufügen",
    set_sail_button: "Segel Setzen!",
    back_to_port_button: "Zurück zum Hafen",
    player_placeholder: "Piratenname eingeben...",
    
    // Game section
    current_bounty_title: "Aktuelle Beute",
    read_scores_button: "🔊 Punkte Vorlesen",
    game_complete_title: "🏴‍☠️ Spiel Beendet! 🏴‍☠️",
    round_label: "Runde",
    record_round_button: "Runde Aufzeichnen",
    
    // Round inputs
    bid_label: "Gebot",
    won_label: "Gewonnen",
    bonus_label: "Bonus",
    score_label: "Punkte",
    
    // Modal
    confirm_action_title: "Aktion Bestätigen",
    keep_names_label: "Spielernamen behalten",
    new_players_button: "Neue Spieler",
    cancel_button: "Abbrechen",
    aye_button: "Aye",
    nay_button: "Nein",
    same_players_prefix: "Gleiche Spieler",
    
    // Button labels
    new_game_button: "Neues Spiel",
    edit_round_button: "Runde Bearbeiten",
    
    // Error messages
    min_players_error: "Ihr braucht mindestens 2 Piraten, um diese Gewässer zu befahren!",
    max_players_error: "Zu viele Piraten! Maximum 8 Schurken erlaubt.",
    duplicate_names_error: "Jeder Pirat braucht einen einzigartigen Namen, ihr Seehunde!",
    max_players_add_error: "Maximum 8 Piraten erlaubt! Kann keine weiteren Spieler hinzufügen.",
    invalid_number_error: "Ungültige Zahl für {playerName} eingegeben. Bitte nur gültige Zahlen eingeben.",
    whole_numbers_error: "Alle Werte müssen ganze Zahlen für {playerName} sein.",
    non_negative_error: "Gebot, tatsächliche Stiche und Bonus müssen nicht-negativ für {playerName} sein.",
    bid_exceeds_tricks_error: "{playerName}s Gebot ({bid}) kann nicht {maxTricks} Stiche in Runde {round} mit {playerCount} Spielern überschreiten.",
    actual_exceeds_tricks_error: "{playerName} kann nicht mehr als {maxTricks} Stiche in Runde {round} mit {playerCount} Spielern gewinnen. Tatsächlich: {actual}",
    bonus_without_correct_bid_error: "{playerName} kann nur Bonuspunkte verdienen, wenn Stiche korrekt vorhergesagt werden! (Gebot: {bid}, Tatsächlich: {actual})",
    unreasonable_bonus_error: "{playerName}s Bonuspunkte scheinen unvernünftig ({bonus}). Bitte überprüfe deine Eingabe.",
    total_tricks_mismatch_error: "Gesamte gewonnene Stiche ({totalActual}) müssen der Anzahl verfügbarer Stiche ({maxTricks}) in Runde {round} mit {playerCount} Spielern entsprechen.",
    no_rounds_to_edit_error: "Keine Runden zu bearbeiten!",
    browser_speech_error: "Arrr! Euer Browser unterstützt keine Sprache. Probiert ein neueres Schiff!",
    input_error_title: "Arrr! Eingabefehler",
    fix_it_button: "Aye, ich repariere es!",
    
    // Commentary - Perfect rounds
    perfect_round_1: "Donnerwetter! Jeder Schuft hat sein Gebot getroffen! Die Meeresgötter lächeln euch allen zu!",
    perfect_round_2: "Alle Wetter! Perfekte Runde für alle Hände! Keine einzige Fehlkalkulation!",
    perfect_round_3: "Avast! Jeder Pirat segelte treu zu seinem Wort! Was für eine Zauberei ist das?",
    
    // Commentary - Single disasters
    disaster_1: "Avast! {playerName} sinkt schneller als ein Schiff ohne Rumpf!",
    disaster_2: "{playerName} ist geradewegs in einen Kraken gesegelt! Was für eine Katastrophe!",
    disaster_3: "Donnerwetter! {playerName} ertrinkt in der eigenen Selbstüberschätzung!",
    
    // Commentary - Multiple big scores
    big_scores_1: "Stücke von acht! Mehrere Piraten schlagen Gold in dieser Runde!",
    big_scores_2: "Alle Wetter! Mehrere Kapitäne haben gerade ihre Schatztruhen gefüllt!",
    big_scores_3: "Mehrere Piraten zählen ernsthafte Dublonen nach dieser Leistung!",
    
    // Commentary - Default
    default_1: "Noch eine Runde abgehakt! Die See ist unberechenbar wie immer!",
    default_2: "Die Gezeiten wenden sich mit jeder Runde! Bleibt scharf, ihr räudigen Hunde!",
    default_3: "Gemischtes Glück in dieser Runde! Der Ozean gibt und nimmt, wie es ihr gefällt!",
    default_4: "Die Winde des Glücks wehen auf mysteriöse Weise, ihr Landratten!",
    default_5: "Manche Piraten schwimmen mit den Haien, andere segeln zum Sieg!",
    
    // Start commentary
    start_1: "Macht die Luken dicht, meine Herzen! Das Abenteuer beginnt!",
    start_2: "Hisst die Farben! Zeit zu sehen, welcher Schuft diese Gewässer beherrscht!",
    start_3: "Alle Mann an Deck! Möge der beste Pirat den Schatz beanspruchen!",
    
    // Winner announcements - Single winner
    winner_single_1: "Huzzah! Kapitän {name} geht siegreich hervor mit {score} Stücken von acht! Die Krone des Skull King gehört dir!",
    winner_single_2: "Avast! {name} hat die sieben Meere mit {score} Dublonen erobert! Es lebe der neue Skull King!",
    winner_single_3: "Alle Wetter! {name} steht triumphierend mit {score} Goldmünzen! Du bist der wahre Meister dieser Gewässer!",
    winner_single_4: "Donnerwetter! {name} hat den meisten Schatz mit {score} Stücken von acht geplündert! Der Thron des Skull King gehört dir!",
    
    // Winner announcements - Tie
    winner_tie_1: "Avast! Wir haben ein Unentschieden! {names} beenden beide mit {score} Stücken von acht! Ihr müsst die Krone des Skull King teilen!",
    winner_tie_2: "Donnerwetter! {names} haben mit jeweils {score} Dublonen unentschieden gespielt! Zwei Kapitäne, ein Thron - möge der beste Pirat gewinnen!",
    winner_tie_3: "Alle Wetter! {names} sind bei {score} Goldmünzen im Patt! Die See konnte nicht zwischen solch würdigen Piraten wählen!",
    
    // Score announcements
    no_game_announce: "Kein aktives Spiel zu verkünden, du Landratte!",
    ahoy_mateys: "Ahoy Kameraden! ",
    current_bounty_after: "Jetzt für die aktuelle Beute nach Runde {roundCount}... ",
    leading_fleet: "Die Flotte anführend haben wir {name} mit {score} Stücken von acht! ",
    bringing_rear: "Und das Schlusslicht bildend, {name} mit {score} Dublonen. ",
    follows_with: "{name} folgt mit {score} Goldmünzen. ",
    may_winds_favor: "Mögen die Winde den Würdigen begünstigen! Arrr!",
    
    // Footer
    disclaimer_title: "Haftungsausschluss:",
    disclaimer_text_1: "Diese Website ist ein unabhängiger, von Fans erstellter Punktezähler für das Skull King Kartenspiel. Sie ist nicht verbunden mit, unterstützt von oder verbunden mit Grandpa Beck's Games, dem offiziellen Herausgeber von Skull King. Skull King ist eine Marke von Grandpa Beck's Games.",
    disclaimer_text_2: "Dieses Tool wird für Bildungs- und Unterhaltungszwecke bereitgestellt, um Spielern beim Verfolgen ihrer Spielergebnisse zu helfen.",
    feedback_text: "Für Feedback, Vorschläge oder Fehlerberichte, kontaktiere: ",
    
    // PWA Install
    add_to_home_title: "📱 Zum Startbildschirm hinzufügen",
    android_chrome_title: "Für Android Chrome:",
    android_step_1: "Tippe auf das Menü (⋮) im Browser",
    android_step_2: "Wähle \"Zum Startbildschirm hinzufügen\"",
    android_step_3: "Tippe \"Hinzufügen\" zur Bestätigung",
    ios_safari_title: "Für iOS Safari:",
    ios_step_1: "Tippe auf den Teilen-Button (⎘)",
    ios_step_2: "Scrolle nach unten und tippe \"Zum Home-Bildschirm\"",
    ios_step_3: "Tippe \"Hinzufügen\" zur Bestätigung",
    close_button: "✕ Schließen",
    
    // New game modal
    new_game_modal_title: "Neues Spiel Starten",
    new_game_modal_message: "Wählt, wie ihr euer neues Abenteuer beginnen wollt:",
    
    // Currencies (for score announcements)
    pieces_of_eight: "Stücke von acht",
    doubloons: "Dublonen",
    gold_coins: "Goldmünzen"
};

// Spanish translations (pirate-themed)
const es: Translation = {
    // Meta tags and SEO
    page_title: "Contador de Puntos Skull King - Scorecard Digital y Tracker de Puntos Gratis",
    page_description: "Contador de puntos gratuito para Skull King y scorecard digital. Rastrea puntos, calcula resultados y disfruta comentarios piratas para el juego de cartas Skull King. Tracker de puntos móvil con puntuación automática.",
    page_keywords: "Skull King, contador de puntos, scorecard, tracker de puntos, puntuación Skull King, contador de juego de cartas, juego de bazas, juego de piratas, calculadora de puntos, scorecard digital",
    og_title: "Contador de Puntos Skull King - Scorecard Digital Gratis",
    og_description: "Contador de puntos digital gratuito para el juego de cartas Skull King. Rastrea puntos con comentarios piratas y cálculos automáticos.",
    twitter_description: "Contador de puntos digital gratuito para el juego de cartas Skull King con puntuación automática y comentarios piratas.",
    app_title: "Skull King",
    
    // Header and navigation
    header_title: "⚓ Contador de Puntos Skull King ☠️",
    header_tagline: "¡Rastreá Vuestro Botín, Perros Malditos!",
    
    // Landing page
    landing_title: "Contador de Puntos Skull King Gratis & Scorecard Digital",
    landing_description: "El tracker de puntos definitivo para Skull King con cálculos automáticos, comentarios piratas y diseño móvil. ¡Rastrea los puntos de tu juego de cartas Skull King como un verdadero capitán pirata!",
    landing_subtitle: "Solución Perfecta de Puntuación Skull King",
    feature_mobile: "📱 <strong>Scorecard Móvil Skull King</strong> - Funciona en teléfonos, tabletas y computadoras",
    feature_calculator: "🧮 <strong>Calculadora Automática de Puntos</strong> - No más errores manuales de puntuación Skull King",
    feature_commentary: "🦜 <strong>Comentarios Piratas</strong> - Comentarios entretenidos sobre tu gameplay de Skull King",
    feature_audio: "🔊 <strong>Lector de Puntos por Audio</strong> - Escucha tus puntos de Skull King anunciados",
    feature_saving: "💾 <strong>Guardado del Estado del Juego</strong> - Nunca pierdas tu progreso de puntuación de Skull King",
    start_button: "Comenzá Tu Rastreo de Puntos Skull King",
    why_choose_title: "¿Por Qué Elegir Nuestro Contador de Puntos Skull King?",
    why_choose_description: "Ya sea que juegues Skull King en casa, en una noche de juegos o en un torneo, nuestro scorecard digital hace que la puntuación de Skull King sea sin esfuerzo. Rastrea apuestas, bazas reales, puntos bonus, y ve tus puntos de Skull King calcularse automáticamente. Perfecto para entusiastas de Skull King que quieren puntuación precisa y rápida.",
    
    // Player setup
    name_crew_title: "Nombrad Vuestra Tripulación",
    add_pirate_button: "Agregar Pirata",
    set_sail_button: "¡Zarpar!",
    back_to_port_button: "Volver al Puerto",
    player_placeholder: "Ingrese nombre del pirata...",
    
    // Game section
    current_bounty_title: "Botín Actual",
    read_scores_button: "🔊 Leer Puntos",
    game_complete_title: "🏴‍☠️ ¡Juego Completo! 🏴‍☠️",
    round_label: "Ronda",
    record_round_button: "Registrar Ronda",
    
    // Round inputs
    bid_label: "Apuesta",
    won_label: "Ganadas",
    bonus_label: "Bonus",
    score_label: "Puntos",
    
    // Modal
    confirm_action_title: "Confirmar Acción",
    keep_names_label: "Mantener nombres de jugadores",
    new_players_button: "Nuevos Jugadores",
    cancel_button: "Cancelar",
    aye_button: "Sí",
    nay_button: "No",
    same_players_prefix: "Mismos Jugadores",
    
    // Button labels
    new_game_button: "Nuevo Juego",
    edit_round_button: "Editar Ronda",
    
    // Error messages
    min_players_error: "¡Necesitáis al menos 2 piratas para navegar estas aguas!",
    max_players_error: "¡Demasiados piratas! Máximo 8 bribones permitidos.",
    duplicate_names_error: "¡Cada pirata necesita un nombre único, perros del mar!",
    max_players_add_error: "¡Máximo 8 piratas permitidos! No se pueden agregar más jugadores.",
    invalid_number_error: "Número inválido ingresado para {playerName}. Por favor ingrese solo números válidos.",
    whole_numbers_error: "Todos los valores deben ser números enteros para {playerName}.",
    non_negative_error: "Apuesta, bazas reales y bonus deben ser no-negativos para {playerName}.",
    bid_exceeds_tricks_error: "La apuesta de {playerName} ({bid}) no puede exceder {maxTricks} bazas en la ronda {round} con {playerCount} jugadores.",
    actual_exceeds_tricks_error: "{playerName} no puede ganar más de {maxTricks} bazas en la ronda {round} con {playerCount} jugadores. Real: {actual}",
    bonus_without_correct_bid_error: "¡{playerName} solo puede ganar puntos bonus cuando predice las bazas correctamente! (Apuesta: {bid}, Real: {actual})",
    unreasonable_bonus_error: "Los puntos bonus de {playerName} parecen irrazonables ({bonus}). Por favor verifica tu entrada.",
    total_tricks_mismatch_error: "Total de bazas ganadas ({totalActual}) debe igual el número de bazas disponibles ({maxTricks}) en la ronda {round} con {playerCount} jugadores.",
    no_rounds_to_edit_error: "¡No hay rondas para editar!",
    browser_speech_error: "¡Arr! Vuestro navegador no soporta voz. ¡Probad una nave más nueva!",
    input_error_title: "¡Arr! Error de Entrada",
    fix_it_button: "¡Sí, lo arreglaré!",
    
    // Commentary - Perfect rounds
    perfect_round_1: "¡Rayos! ¡Cada granuja acertó su apuesta! ¡Los dioses del mar os sonríen a todos!",
    perfect_round_2: "¡Mil rayos! ¡Ronda perfecta para todas las manos! ¡Ni un solo error de cálculo!",
    perfect_round_3: "¡Alto ahí! ¡Cada pirata navegó fiel a su palabra! ¿Qué brujería es esta?",
    
    // Commentary - Single disasters
    disaster_1: "¡Alto ahí! ¡{playerName} se hunde más rápido que un barco sin casco!",
    disaster_2: "¡{playerName} acaba de navegar directo hacia un kraken! ¡Qué desastre!",
    disaster_3: "¡Rayos! ¡{playerName} se ahoga en su propia arrogancia!",
    
    // Commentary - Multiple big scores
    big_scores_1: "¡Piezas de a ocho! ¡Múltiples piratas están haciendo oro esta ronda!",
    big_scores_2: "¡Mil rayos! ¡Varios capitanes acaban de llenar sus cofres del tesoro!",
    big_scores_3: "¡Múltiples piratas están contando doblones serios después de esa actuación!",
    
    // Commentary - Default
    default_1: "¡Otra ronda en los libros! ¡Los mares son impredecibles como siempre!",
    default_2: "¡La marea cambia con cada ronda! ¡Manteneos alerta, perros sarnosos!",
    default_3: "¡Fortunas mixtas esta ronda! ¡El océano da y quita como le place!",
    default_4: "¡Los vientos de la fortuna soplan de maneras misteriosas, terrestres!",
    default_5: "¡Algunos piratas nadan con los tiburones, otros navegan hacia la victoria!",
    
    // Start commentary
    start_1: "¡Asegurad las escotillas, corazones míos! ¡La aventura comienza!",
    start_2: "¡Izad los colores! ¡Hora de ver qué granuja gobierna estas aguas!",
    start_3: "¡Todos a cubierta! ¡Que el mejor pirata reclame el tesoro!",
    
    // Winner announcements - Single winner
    winner_single_1: "¡Hurra! ¡El Capitán {name} emerge victorioso con {score} piezas de a ocho! ¡La corona del Skull King te pertenece!",
    winner_single_2: "¡Alto ahí! ¡{name} ha conquistado los siete mares con {score} doblones! ¡Salve el nuevo Skull King!",
    winner_single_3: "¡Mil rayos! ¡{name} se alza triunfante con {score} monedas de oro! ¡Eres el verdadero maestro de estas aguas!",
    winner_single_4: "¡Rayos! ¡{name} ha saqueado el mayor tesoro con {score} piezas de a ocho! ¡El trono del Skull King es tuyo!",
    
    // Winner announcements - Tie
    winner_tie_1: "¡Alto ahí! ¡Tenemos un empate! ¡{names} ambos terminan con {score} piezas de a ocho! ¡Debéis compartir la corona del Skull King!",
    winner_tie_2: "¡Rayos! ¡{names} han empatado con {score} doblones cada uno! ¡Dos capitanes, un trono - que gane el mejor pirata!",
    winner_tie_3: "¡Mil rayos! ¡{names} están empatados con {score} monedas de oro! ¡Los mares no pudieron elegir entre piratas tan dignos!",
    
    // Score announcements
    no_game_announce: "¡No hay juego activo que anunciar, terrestre!",
    ahoy_mateys: "¡Ahoy compañeros! ",
    current_bounty_after: "Ahora para el botín actual después de la ronda {roundCount}... ",
    leading_fleet: "Liderando la flota, tenemos a {name} con {score} piezas de a ocho! ",
    bringing_rear: "Y cerrando la marcha, {name} con {score} doblones. ",
    follows_with: "{name} sigue con {score} monedas de oro. ",
    may_winds_favor: "¡Que los vientos favorezcan a los dignos! ¡Arrr!",
    
    // Footer
    disclaimer_title: "Descargo de responsabilidad:",
    disclaimer_text_1: "Este sitio web es un contador de puntos independiente creado por fans para el juego de cartas Skull King. No está afiliado, respaldado o conectado con Grandpa Beck's Games, el editor oficial de Skull King. Skull King es una marca registrada de Grandpa Beck's Games.",
    disclaimer_text_2: "Esta herramienta se proporciona con fines educativos y de entretenimiento para ayudar a los jugadores a rastrear sus puntuaciones de juego.",
    feedback_text: "Para comentarios, sugerencias o reportes de errores, contacta: ",
    
    // PWA Install
    add_to_home_title: "📱 Agregar a Pantalla de Inicio",
    android_chrome_title: "Para Android Chrome:",
    android_step_1: "Toca el menú (⋮) en el navegador",
    android_step_2: "Selecciona \"Agregar a pantalla de inicio\"",
    android_step_3: "Toca \"Agregar\" para confirmar",
    ios_safari_title: "Para iOS Safari:",
    ios_step_1: "Toca el botón compartir (⎘)",
    ios_step_2: "Desplázate hacia abajo y toca \"Agregar a pantalla de inicio\"",
    ios_step_3: "Toca \"Agregar\" para confirmar", 
    close_button: "✕ Cerrar",
    
    // New game modal
    new_game_modal_title: "Comenzar Nuevo Juego",
    new_game_modal_message: "Elegid cómo queréis comenzar vuestra nueva aventura:",
    
    // Currencies (for score announcements)
    pieces_of_eight: "piezas de a ocho",
    doubloons: "doblones",
    gold_coins: "monedas de oro"
};

// Translation system class
class TranslationSystem {
    private currentLanguage: string = 'en';
    private translations: { [key: string]: Translation } = { en, de, es };
    
    constructor() {
        // Try to get saved language from localStorage
        const saved = localStorage.getItem('skull-king-language');
        if (saved && this.translations[saved]) {
            this.currentLanguage = saved;
        } else {
            // Auto-detect browser language
            const browserLang = navigator.language.substr(0, 2);
            if (this.translations[browserLang]) {
                this.currentLanguage = browserLang;
            }
        }
    }
    
    getCurrentLanguage(): string {
        return this.currentLanguage;
    }
    
    setLanguage(lang: string): void {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('skull-king-language', lang);
            // Trigger update event
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
        }
    }
    
    getAvailableLanguages(): { code: string; name: string }[] {
        return [
            { code: 'en', name: 'English' },
            { code: 'de', name: 'Deutsch' },
            { code: 'es', name: 'Español' }
        ];
    }
    
    translate(key: keyof Translation, params?: { [key: string]: string | number }): string {
        const translation = this.translations[this.currentLanguage];
        if (!translation || !translation[key]) {
            console.warn(`Translation missing for key: ${key} in language: ${this.currentLanguage}`);
            return this.translations['en'][key] || key;
        }
        
        let result = translation[key];
        
        // Replace parameters if provided
        if (params) {
            Object.entries(params).forEach(([param, value]) => {
                result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), value.toString());
            });
        }
        
        return result;
    }
}

// Global translation system instance
const translationSystem = new TranslationSystem();

// Make it available globally for browser environment
if (typeof window !== 'undefined') {
    (window as any).i18n = translationSystem;
} else if (typeof global !== 'undefined') {
    (global as any).i18n = translationSystem;
}