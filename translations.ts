/**
 * Translation system for Skull King Score Keeper
 * All text strings used in the application for internationalization
 */

// Translation interface definition
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
    clear_all_button: string;
    set_sail_button: string;
    back_to_port_button: string;
    player_placeholder: string;
    game_options_title: string;
    
    // Game section
    current_bounty_title: string;
    read_scores_button: string;
    game_complete_title: string;
    round_label: string;
    round_display: string;
    cards_each: string;
    record_round_button: string;
    
    // Round inputs
    player_label: string;
    bid_label: string;
    won_label: string;
    bonus_label: string;
    score_label: string;
    
    // Graybeard (2-player mode)
    graybeard_name: string;
    graybeard_tricks_label: string;
    graybeard_negative_tricks_error: string;
    graybeard_exceeds_tricks_error: string;
    total_tricks_mismatch_with_graybeard_error: string;
    
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
    
    // Scoring mode
    scoring_mode_label: string;
    scoring_mode_normal: string;
    scoring_mode_normal_desc: string;
    scoring_mode_rascal: string;
    scoring_mode_rascal_desc: string;
    scoring_mode_description: string;
    other_options_label: string;
    expansion_mode_title: string;
    expansion_mode_desc: string;
    expansion_mode_label: string;
    
    // Bonus calculator
    calc_button: string;
    calculate_button: string;
    bonus_calculator_title: string;
    bonus_category_14s: string;
    bonus_category_captures: string;
    bonus_label_standard_14: string;
    bonus_label_black_14: string;
    bonus_label_mermaid_pirate: string;
    bonus_label_sk_pirate: string;
    bonus_label_mermaid_sk: string;
    bonus_label_loot: string;
    bonus_total_label: string;
    
    // Expansion bonus labels
    expansion_bonuses_header: string;
    bonus_label_seven: string;
    bonus_label_eight: string;
    bonus_label_firstmate: string;
    bonus_label_davyjones: string;
    
    kraken_played: string;
    trick_discarded: string;
    bonus_clear_btn: string;
    bonus_apply_btn: string;
    bonus_error_bid_mismatch: string;
    bonus_error_rascal_miss: string;
    
    // Update prompts
    update_available_title: string;
    update_available_message: string;
    
    // Error title
    error_title: string;
}

// English translations
const enTranslation: Translation = {
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
    feature_mobile: "📱 Mobile Skull King Scorecard - Works on phones, tablets, and computers",
    feature_calculator: "🧮 Automatic Score Calculator - No more manual Skull King scoring errors",
    feature_commentary: "🦜 Pirate Commentary - Entertaining feedback on your Skull King gameplay",
    feature_audio: "🔊 Audio Score Reader - Hear your Skull King scores announced",
    feature_saving: "💾 Game State Saving - Never lose your Skull King scoring progress",
    start_button: "Start Your Skull King Score Tracking",
    why_choose_title: "Why Choose Our Skull King Score Keeper?",
    why_choose_description: "Whether you're playing Skull King at home, at a game night, or in a tournament, our digital scorecard makes Skull King scoring effortless. Track bids, actual tricks, bonus points, and watch your Skull King scores calculate automatically. Perfect for Skull King enthusiasts who want accurate, fast scoring.",
    
    // Game section
    current_bounty_title: "Current Bounty",
    read_scores_button: "🔊 Read Scores",
    game_complete_title: "🏴‍☠️ Game Complete! 🏴‍☠️",
    round_label: "Round",
    round_display: "{round} of 10",
    cards_each: "{cards} cards each",
    record_round_button: "Record Round",
    
    // Round inputs
    player_label: "Player",
    bid_label: "Bid",
    won_label: "Won",
    bonus_label: "Bonus",
    score_label: "Score",
    
    // Graybeard (2-player mode)
    graybeard_name: "Graybeard 👻",
    graybeard_tricks_label: "Tricks Won",
    graybeard_negative_tricks_error: "Graybeard's tricks cannot be negative!",
    graybeard_exceeds_tricks_error: "Graybeard cannot win more than {maxTricks} tricks!",
    total_tricks_mismatch_with_graybeard_error: "Total tricks won ({totalActual} including Graybeard) must equal {maxTricks} for round {round}!",
    
    // Modal
    confirm_action_title: "Confirm Action",
    keep_names_label: "Keep player names",
    new_players_button: "New Players",
    cancel_button: "Cancel",
    aye_button: "Aye",
    nay_button: "Nay",
    same_players_prefix: "Same Players -",
    
    // Button labels
    new_game_button: "New Game",
    edit_round_button: "Edit Round {round}",
    
    // Error messages
    min_players_error: "Ye need at least 2 pirates to play, ye scurvy dog!",
    max_players_error: "No more than {maxPlayers} pirates can fit on this ship!",
    duplicate_names_error: "Each pirate needs their own name, ye bilge rat!",
    max_players_add_error: "The ship be full! Maximum {maxPlayers} pirates allowed!",
    invalid_number_error: "{playerName} needs valid numbers for all fields, ye landlubber!",
    whole_numbers_error: "{playerName} can only use whole numbers, no half measures!",
    non_negative_error: "{playerName} can't use negative numbers, ye scallywag!",
    bid_exceeds_tricks_error: "{playerName}'s bid ({bid}) can't exceed {maxTricks} tricks in round {round}!",
    actual_exceeds_tricks_error: "{playerName} can't win more than {maxTricks} tricks in round {round}!",
    bonus_without_correct_bid_error: "{playerName} can't earn bonus points without bidding correctly (bid: {bid}, actual: {actual})!",
    unreasonable_bonus_error: "{playerName}'s bonus of {bonus} seems too high.",
    total_tricks_mismatch_error: "Total tricks won ({totalActual}) must equal {maxTricks} for round {round} with {playerCount} players!",
    no_rounds_to_edit_error: "No rounds to edit yet, ye scurvy dog!",
    browser_speech_error: "Yer browser doesn't support speech, ye landlubber!",
    input_error_title: "Avast! Check yer inputs!",
    fix_it_button: "Aye, I'll fix it!",
    
    // Commentary - Perfect rounds
    perfect_round_1: "Blimey! Every scallywag nailed their bid! The sea gods smile upon ye all!",
    perfect_round_2: "Shiver me timbers! A perfect round! Every pirate read the waters true!",
    perfect_round_3: "By Davy Jones' locker! Not a single miss! Ye all be masters of the seven seas!",
    
    // Commentary - Single disasters
    disaster_1: "Avast! {playerName} be sinkin' faster than a ship with no hull!",
    disaster_2: "Blow me down! {playerName} miscounted worse than a drunk pirate!",
    disaster_3: "Batten down the hatches! {playerName} just took a plunge to Davy Jones!",
    
    // Commentary - Multiple big scores
    big_scores_1: "Yo ho ho! Multiple pirates struck gold this round! The treasure flows freely!",
    big_scores_2: "Pieces of eight! Several scallywags be fillin' their coffers today!",
    big_scores_3: "Ahoy! Big scores all around! The crew be celebratin' tonight!",
    
    // Commentary - Default
    default_1: "Arr! The scores be recorded in the ship's log!",
    default_2: "Another round in the books, me hearties!",
    default_3: "The tale continues, ye salty sea dogs!",
    default_4: "Onwards to glory and treasure, me crew!",
    default_5: "The winds of fortune blow in many directions!",
    
    // Start commentary
    start_1: "Welcome aboard, ye scurvy dogs! May the winds favor the bold!",
    start_2: "Ahoy mateys! Set sail for adventure and glory!",
    start_3: "Hoist the colors! The quest for treasure begins!",
    
    // Winner announcements - Single winner
    winner_single_1: "All hail {name}, the true Skull King of the seas!",
    winner_single_2: "Avast! {name} claims the crown with {score} pieces of eight!",
    winner_single_3: "Yo ho ho! Captain {name} plunders the victory with {score} gold coins!",
    winner_single_4: "Shiver me timbers! {name} be the champion of these waters!",
    
    // Winner announcements - Tie
    winner_tie_1: "Blimey! A tie between {names}! Each with {score} doubloons!",
    winner_tie_2: "By Neptune's beard! {names} share the treasure at {score} pieces of eight each!",
    winner_tie_3: "Avast! Multiple pirates claim victory! {names} all scored {score}!",
    
    // Score announcements
    no_game_announce: "No game in progress to announce, ye landlubber!",
    ahoy_mateys: "Ahoy mateys!",
    current_bounty_after: "Current bounty after {rounds} rounds.",
    leading_fleet: "{name} be leading the fleet with {score} doubloons.",
    bringing_rear: "{name} be bringing up the rear with {score} doubloons.",
    follows_with: "{name} follows with {score} doubloons.",
    may_winds_favor: "May the winds favor ye in the remaining rounds!",
    
    // Footer
    disclaimer_title: "Disclaimer:",
    disclaimer_text_1: "This website is an independent fan-created score keeper for the Skull King card game. It is not affiliated with, endorsed by, or connected to Grandpa Beck's Games, the official publisher of Skull King. Skull King is a trademark of Grandpa Beck's Games.",
    disclaimer_text_2: "This tool is provided for educational and entertainment purposes to help players track their game scores.",
    feedback_text: "For feedback, suggestions, or bug reports, contact:",
    
    // PWA Install
    add_to_home_title: "Add to Home Screen",
    android_chrome_title: "To install on Android (Chrome):",
    android_step_1: "1. Tap the menu button (⋮)",
    android_step_2: "2. Select 'Add to Home screen'",
    android_step_3: "3. Tap 'Add' to confirm",
    ios_safari_title: "To install on iOS (Safari):",
    ios_step_1: "1. Tap the share button",
    ios_step_2: "2. Select 'Add to Home Screen'",
    ios_step_3: "3. Tap 'Add' to confirm",
    close_button: "Close",
    
    // Player setup
    name_crew_title: "Name Yer Crew",
    player_placeholder: "Pirate Name",
    add_pirate_button: "Add Pirate",
    clear_all_button: "Clear All",
    set_sail_button: "Set Sail!",
    back_to_port_button: "Back to Port",
    game_options_title: "Game Options",
    
    // New game modal
    new_game_modal_title: "Start New Game?",
    new_game_modal_message: "Current game in progress. Start a new game?",
    
    // Currencies (for score announcements)
    pieces_of_eight: "pieces of eight",
    doubloons: "doubloons",
    gold_coins: "gold coins",
    
    // Scoring mode
    scoring_mode_label: "Scoring Rules",
    scoring_mode_normal: "Normal Scoring",
    scoring_mode_normal_desc: "Traditional Skull King: Zero bid = 10×round, correct bid = 20×tricks + bonus",
    scoring_mode_rascal: "Rascal's Scoring",
    scoring_mode_rascal_desc: "Even-keeled scoring: 10 pts × cards dealt. Direct hit = full, off by 1 = half, off by 2+ = none",
    scoring_mode_description: "Normal = exact bid scoring, Rascal = proportional scoring",
    other_options_label: "Other Options",
    expansion_mode_title: "Expansion Pack",
    expansion_mode_desc: "Adds 9-player support, Stingray, Davy Jones, and new bonus cards",
    expansion_mode_label: "Play with Expansion Pack (allows 9 players)",
    
    // Bonus calculator
    calc_button: "Calc",
    calculate_button: "Calculate",
    bonus_calculator_title: "Bonus Calculator",
    bonus_category_14s: "Number 14 Cards Captured",
    bonus_category_captures: "Character Captures",
    bonus_label_standard_14: "Yellow/Purple/Green 14s",
    bonus_label_black_14: "Black (Jolly Roger) 14",
    bonus_label_mermaid_pirate: "Mermaids captured by Pirates",
    bonus_label_sk_pirate: "Pirates captured by Skull King",
    bonus_label_mermaid_sk: "Skull King captured by Mermaid",
    bonus_label_loot: "Loot Alliances",
    bonus_total_label: "Total Bonus:",
    
    // Expansion bonus labels
    expansion_bonuses_header: "⚓ Expansion Bonuses",
    bonus_label_seven: "7s Captured (Penalty)",
    bonus_label_eight: "8s Captured (Bonus)",
    bonus_label_firstmate: "First Mate Con Captured",
    bonus_label_davyjones: "Davy Jones Sea Monsters",
    
    kraken_played: "🐙 Kraken played (trick destroyed)",
    trick_discarded: "🚫 Trick discarded (Whale/Stingray - no winner)",
    bonus_clear_btn: "Clear",
    bonus_apply_btn: "Apply Bonus",
    bonus_error_bid_mismatch: "Arrr! Bonus only be allowed when yer bid equals actual tricks won!",
    bonus_error_rascal_miss: "Shiver me timbers! No bonus when ye be off by 2 or more!",
    
    // Update prompts
    update_available_title: "Ahoy! New Treasure Available!",
    update_available_message: "A newer version of the score keeper be ready! Reload to get the latest features?",
    
    // Error title
    error_title: "Avast!"
};

// German translations
const deTranslation: Translation = {
    // Meta tags and SEO
    page_title: "Skull King Punktezähler - Kostenlose Digitale Punktekarte",
    page_description: "Kostenloser Skull King Punktezähler und digitale Punktekarte. Verfolgen Sie Punkte, berechnen Sie automatisch und genießen Sie Piratenkommentare für das Skull King Kartenspiel.",
    page_keywords: "Skull King, Punktezähler, Punktekarte, Punkteverfolgung, Skull King Wertung, Kartenspiel Punkte, Stichspiel, Piratenspiel",
    og_title: "Skull King Punktezähler - Kostenlose Digitale Punktekarte",
    og_description: "Kostenloser digitaler Punktezähler für Skull King Kartenspiel mit Piratenkommentaren und automatischen Berechnungen.",
    twitter_description: "Kostenloser digitaler Punktezähler für Skull King mit automatischer Wertung und Piratenkommentaren.",
    app_title: "Skull King",
    
    // Header and navigation
    header_title: "⚓ Skull King Punktezähler ☠️",
    header_tagline: "Zählt Eure Beute, Ihr Seeräuber!",
    
    // Landing page
    landing_title: "Kostenloser Skull King Punktezähler & Digitale Punktekarte",
    landing_description: "Der ultimative Skull King Punkteverfolger mit automatischen Berechnungen, Piratenkommentaren und mobilfreundlichem Design. Verfolgen Sie Ihre Skull King Spielpunkte wie ein echter Piratenkapitän!",
    landing_subtitle: "Perfekte Skull King Wertungslösung",
    feature_mobile: "📱 Mobile Skull King Punktekarte - Funktioniert auf Handys, Tablets und Computern",
    feature_calculator: "🧮 Automatischer Punkterechner - Keine manuellen Skull King Wertungsfehler mehr",
    feature_commentary: "🦜 Piratenkommentare - Unterhaltsames Feedback zu Ihrem Skull King Spiel",
    feature_audio: "🔊 Audio Punkteansage - Hören Sie Ihre Skull King Punkte",
    feature_saving: "💾 Spielstand Speichern - Verlieren Sie nie Ihren Skull King Fortschritt",
    start_button: "Starten Sie Ihre Skull King Punkteverfolgung",
    why_choose_title: "Warum Unser Skull King Punktezähler?",
    why_choose_description: "Ob Sie Skull King zu Hause, bei einem Spieleabend oder bei einem Turnier spielen, unsere digitale Punktekarte macht die Skull King Wertung mühelos. Verfolgen Sie Gebote, gewonnene Stiche, Bonuspunkte und sehen Sie, wie Ihre Skull King Punkte automatisch berechnet werden.",
    
    // Game section
    current_bounty_title: "Aktuelle Beute",
    read_scores_button: "🔊 Punkte Vorlesen",
    game_complete_title: "🏴‍☠️ Spiel Beendet! 🏴‍☠️",
    round_label: "Runde",
    round_display: "{round} von 10",
    cards_each: "{cards} Karten jeweils",
    record_round_button: "Runde Aufzeichnen",
    
    // Round inputs
    player_label: "Spieler",
    bid_label: "Gebot",
    won_label: "Gewonnen",
    bonus_label: "Bonus",
    score_label: "Punkte",
    
    // Graybeard (2-player mode)
    graybeard_name: "Graubart 👻",
    graybeard_tricks_label: "Gewonnene Stiche",
    graybeard_negative_tricks_error: "Graubarts Stiche können nicht negativ sein!",
    graybeard_exceeds_tricks_error: "Graubart kann nicht mehr als {maxTricks} Stiche gewinnen!",
    total_tricks_mismatch_with_graybeard_error: "Gesamtstiche ({totalActual} mit Graubart) müssen {maxTricks} für Runde {round} sein!",
    
    // Modal
    confirm_action_title: "Aktion Bestätigen",
    keep_names_label: "Spielernamen behalten",
    new_players_button: "Neue Spieler",
    cancel_button: "Abbrechen",
    aye_button: "Aye",
    nay_button: "Nay",
    same_players_prefix: "Gleiche Spieler -",
    
    // Button labels
    new_game_button: "Neues Spiel",
    edit_round_button: "Runde {round} Bearbeiten",
    
    // Error messages
    min_players_error: "Ihr braucht mindestens 2 Piraten zum Spielen!",
    max_players_error: "Nicht mehr als {maxPlayers} Piraten passen auf dieses Schiff!",
    duplicate_names_error: "Jeder Pirat braucht seinen eigenen Namen!",
    max_players_add_error: "Das Schiff ist voll! Maximal {maxPlayers} Piraten erlaubt!",
    invalid_number_error: "{playerName} muss gültige Zahlen für alle Felder eingeben!",
    whole_numbers_error: "{playerName} kann nur ganze Zahlen verwenden, keine halben Sachen!",
    non_negative_error: "{playerName} kann keine negativen Zahlen verwenden!",
    bid_exceeds_tricks_error: "{playerName}s Gebot ({bid}) kann nicht {maxTricks} Stiche in Runde {round} überschreiten!",
    actual_exceeds_tricks_error: "{playerName} kann nicht mehr als {maxTricks} Stiche in Runde {round} gewinnen!",
    bonus_without_correct_bid_error: "{playerName} kann keine Bonuspunkte ohne korrektes Gebot erhalten!",
    unreasonable_bonus_error: "{playerName}s Bonus von {bonus} scheint zu hoch.",
    total_tricks_mismatch_error: "Gesamtstiche ({totalActual}) müssen {maxTricks} für Runde {round} mit {playerCount} Spielern sein!",
    no_rounds_to_edit_error: "Noch keine Runden zum Bearbeiten!",
    browser_speech_error: "Euer Browser unterstützt keine Sprache!",
    input_error_title: "Avast! Überprüft Eure Eingaben!",
    fix_it_button: "Aye, ich werde es reparieren!",
    
    // Commentary - Perfect rounds
    perfect_round_1: "Donnerwetter! Jeder Seeräuber hat sein Gebot getroffen! Die Meeresgötter lächeln euch an!",
    perfect_round_2: "Alle Wetter! Eine perfekte Runde! Jeder Pirat hat die Gewässer richtig gelesen!",
    perfect_round_3: "Bei Davy Jones' Kiste! Kein einziger Fehler! Ihr seid alle Meister der sieben Meere!",
    
    // Commentary - Single disasters
    disaster_1: "Avast! {playerName} sinkt schneller als ein Schiff ohne Rumpf!",
    disaster_2: "Heiliger Klabautermann! {playerName} hat sich schlimmer verzählt als ein betrunkener Pirat!",
    disaster_3: "Luken dicht! {playerName} hat gerade einen Sturz zu Davy Jones gemacht!",
    
    // Commentary - Multiple big scores
    big_scores_1: "Yo ho ho! Mehrere Piraten haben Gold geschlagen! Der Schatz fließt frei!",
    big_scores_2: "Achterstücke! Mehrere Seeräuber füllen heute ihre Truhen!",
    big_scores_3: "Ahoi! Große Punkte überall! Die Crew feiert heute Nacht!",
    
    // Commentary - Default
    default_1: "Arr! Die Punkte sind im Schiffslogbuch eingetragen!",
    default_2: "Eine weitere Runde in den Büchern, meine Herzchen!",
    default_3: "Die Geschichte geht weiter, ihr salzigen Seehunde!",
    default_4: "Weiter zu Ruhm und Schatz, meine Crew!",
    default_5: "Die Winde des Glücks wehen in viele Richtungen!",
    
    // Start commentary
    start_1: "Willkommen an Bord, ihr Seeräuber! Mögen die Winde die Mutigen begünstigen!",
    start_2: "Ahoi Matrosen! Segel setzen für Abenteuer und Ruhm!",
    start_3: "Hisst die Flaggen! Die Suche nach dem Schatz beginnt!",
    
    // Winner announcements - Single winner
    winner_single_1: "Heil {name}, dem wahren Skull King der Meere!",
    winner_single_2: "Avast! {name} beansprucht die Krone mit {score} Achterstücken!",
    winner_single_3: "Yo ho ho! Kapitän {name} plündert den Sieg mit {score} Goldmünzen!",
    winner_single_4: "Alle Wetter! {name} ist der Champion dieser Gewässer!",
    
    // Winner announcements - Tie
    winner_tie_1: "Donnerwetter! Unentschieden zwischen {names}! Jeder mit {score} Dublonen!",
    winner_tie_2: "Bei Neptuns Bart! {names} teilen sich den Schatz bei je {score} Achterstücken!",
    winner_tie_3: "Avast! Mehrere Piraten beanspruchen den Sieg! {names} alle mit {score} Punkten!",
    
    // Score announcements
    no_game_announce: "Kein Spiel im Gange zum Verkünden!",
    ahoy_mateys: "Ahoi Matrosen!",
    current_bounty_after: "Aktuelle Beute nach {rounds} Runden.",
    leading_fleet: "{name} führt die Flotte mit {score} Dublonen an.",
    bringing_rear: "{name} bildet das Schlusslicht mit {score} Dublonen.",
    follows_with: "{name} folgt mit {score} Dublonen.",
    may_winds_favor: "Mögen die Winde euch in den verbleibenden Runden begünstigen!",
    
    // Footer
    disclaimer_title: "Hinweis:",
    disclaimer_text_1: "Diese Website ist ein unabhängiger, von Fans erstellter Punktezähler für das Skull King Kartenspiel. Sie ist nicht mit Grandpa Beck's Games, dem offiziellen Herausgeber von Skull King, verbunden oder von diesem unterstützt. Skull King ist eine Marke von Grandpa Beck's Games.",
    disclaimer_text_2: "Dieses Tool wird für Bildungs- und Unterhaltungszwecke bereitgestellt, um Spielern bei der Verfolgung ihrer Spielpunkte zu helfen.",
    feedback_text: "Für Feedback, Vorschläge oder Fehlerberichte kontaktieren Sie:",
    
    // PWA Install
    add_to_home_title: "Zum Startbildschirm Hinzufügen",
    android_chrome_title: "Installation auf Android (Chrome):",
    android_step_1: "1. Tippen Sie auf die Menütaste (⋮)",
    android_step_2: "2. Wählen Sie 'Zum Startbildschirm hinzufügen'",
    android_step_3: "3. Tippen Sie auf 'Hinzufügen' zur Bestätigung",
    ios_safari_title: "Installation auf iOS (Safari):",
    ios_step_1: "1. Tippen Sie auf die Teilen-Taste",
    ios_step_2: "2. Wählen Sie 'Zum Home-Bildschirm'",
    ios_step_3: "3. Tippen Sie auf 'Hinzufügen' zur Bestätigung",
    close_button: "Schließen",
    
    // Player setup
    name_crew_title: "Mannschaft Benennen",
    player_placeholder: "Piratenname",
    add_pirate_button: "Pirat hinzufügen",
    clear_all_button: "Alle Löschen",
    set_sail_button: "In See stechen!",
    back_to_port_button: "Zurück zum Hafen",
    game_options_title: "Spieloptionen",
    
    // New game modal
    new_game_modal_title: "Neues Spiel Starten?",
    new_game_modal_message: "Aktuelles Spiel läuft. Neues Spiel starten?",
    
    // Currencies (for score announcements)
    pieces_of_eight: "Stücke von acht",
    doubloons: "Dublonen",
    gold_coins: "Goldmünzen",
    
    // Scoring mode
    scoring_mode_label: "Punkteregeln",
    scoring_mode_normal: "Normale Wertung",
    scoring_mode_normal_desc: "Traditionelle Skull King: Null-Gebot = 10×Runde, korrektes Gebot = 20×Stiche + Bonus",
    scoring_mode_rascal: "Schurken-Wertung",
    scoring_mode_rascal_desc: "Ausgeglichene Wertung: 10 Pkt × ausgeteilte Karten. Direkttreffer = voll, um 1 daneben = halb, um 2+ daneben = null",
    scoring_mode_description: "Normal = exakte Gebotswertung, Schurke = proportionale Wertung",
    other_options_label: "Weitere Optionen",
    expansion_mode_title: "Erweiterungspaket",
    expansion_mode_desc: "Fügt 9-Spieler-Unterstützung, Stachelrochen, Davy Jones und neue Bonuskarten hinzu",
    expansion_mode_label: "Mit Erweiterungspaket spielen (erlaubt 9 Spieler)",
    
    // Bonus calculator
    calc_button: "Rechner",
    calculate_button: "Berechnen",
    bonus_calculator_title: "Bonus-Rechner",
    bonus_category_14s: "Eroberte Nummer 14 Karten",
    bonus_category_captures: "Charakterfänge",
    bonus_label_standard_14: "Gelbe/Lila/Grüne 14er",
    bonus_label_black_14: "Schwarze (Jolly Roger) 14",
    bonus_label_mermaid_pirate: "Meerjungfrauen von Piraten gefangen",
    bonus_label_sk_pirate: "Piraten vom Skull King gefangen",
    bonus_label_mermaid_sk: "Skull King von Meerjungfrau gefangen",
    bonus_label_loot: "Beute-Allianzen",
    bonus_total_label: "Gesamt-Bonus:",
    
    // Expansion bonus labels
    expansion_bonuses_header: "⚓ Erweiterungs-Boni",
    bonus_label_seven: "7er Gefangen (Strafe)",
    bonus_label_eight: "8er Gefangen (Bonus)",
    bonus_label_firstmate: "Erster Maat Con Gefangen",
    bonus_label_davyjones: "Davy Jones Seemonster",
    
    kraken_played: "🐙 Kraken gespielt (Stich zerstört)",
    trick_discarded: "🚫 Stich verworfen (Wal/Rochen - kein Gewinner)",
    bonus_clear_btn: "Löschen",
    bonus_apply_btn: "Bonus Anwenden",
    bonus_error_bid_mismatch: "Arrr! Bonus nur erlaubt, wenn Gebot gleich gewonnene Stiche!",
    bonus_error_rascal_miss: "Donnerwetter! Kein Bonus bei 2 oder mehr daneben!",
    
    // Update prompts
    update_available_title: "Ahoi! Neue Version verfügbar!",
    update_available_message: "Eine neuere Version des Punktezählers ist bereit! Neu laden für die neuesten Funktionen?",
    
    // Error title
    error_title: "Achtung!"
};

// Spanish translations
const esTranslation: Translation = {
    // Meta tags and SEO
    page_title: "Contador de Puntos Skull King - Tarjeta de Puntuación Digital Gratis",
    page_description: "Contador de puntos Skull King gratuito y tarjeta de puntuación digital. Rastrea puntos, calcula automáticamente y disfruta de comentarios piratas para el juego de cartas Skull King.",
    page_keywords: "Skull King, contador de puntos, tarjeta de puntuación, seguimiento de puntos, puntuación Skull King, anotador de juegos, juego de bazas, juego pirata",
    og_title: "Contador de Puntos Skull King - Tarjeta Digital Gratis",
    og_description: "Contador de puntos digital gratuito para el juego Skull King con comentarios piratas y cálculos automáticos.",
    twitter_description: "Contador digital gratuito para Skull King con puntuación automática y comentarios piratas.",
    app_title: "Skull King",
    
    // Header and navigation
    header_title: "⚓ Contador de Puntos Skull King ☠️",
    header_tagline: "¡Contad Vuestro Botín, Perros Sarnosos!",
    
    // Landing page
    landing_title: "Contador de Puntos Skull King Gratis & Tarjeta Digital",
    landing_description: "El rastreador de puntos Skull King definitivo con cálculos automáticos, comentarios piratas y diseño móvil. ¡Rastrea tus puntos del juego Skull King como un verdadero capitán pirata!",
    landing_subtitle: "Solución Perfecta de Puntuación Skull King",
    feature_mobile: "📱 Tarjeta Skull King Móvil - Funciona en teléfonos, tablets y computadoras",
    feature_calculator: "🧮 Calculadora Automática - No más errores manuales de puntuación Skull King",
    feature_commentary: "🦜 Comentarios Piratas - Retroalimentación entretenida sobre tu juego Skull King",
    feature_audio: "🔊 Lector de Audio - Escucha tus puntos de Skull King anunciados",
    feature_saving: "💾 Guardado del Estado - Nunca pierdas tu progreso de Skull King",
    start_button: "Comienza tu Seguimiento de Puntos Skull King",
    why_choose_title: "¿Por Qué Elegir Nuestro Contador Skull King?",
    why_choose_description: "Ya sea que juegues Skull King en casa, en una noche de juegos o en un torneo, nuestra tarjeta digital hace que la puntuación sea sin esfuerzo. Rastrea apuestas, bazas ganadas, puntos de bonificación y ve cómo se calculan automáticamente tus puntos de Skull King.",
    
    // Game section
    current_bounty_title: "Botín Actual",
    read_scores_button: "🔊 Leer Puntos",
    game_complete_title: "🏴‍☠️ ¡Juego Completo! 🏴‍☠️",
    round_label: "Ronda",
    round_display: "{round} de 10",
    cards_each: "{cards} cartas cada uno",
    record_round_button: "Registrar Ronda",
    
    // Round inputs
    player_label: "Jugador",
    bid_label: "Apuesta",
    won_label: "Ganadas",
    bonus_label: "Bonus",
    score_label: "Puntos",
    
    // Graybeard (2-player mode)
    graybeard_name: "Barba Gris 👻",
    graybeard_tricks_label: "Bazas Ganadas",
    graybeard_negative_tricks_error: "¡Las bazas de Barba Gris no pueden ser negativas!",
    graybeard_exceeds_tricks_error: "¡Barba Gris no puede ganar más de {maxTricks} bazas!",
    total_tricks_mismatch_with_graybeard_error: "¡Total de bazas ganadas ({totalActual} con Barba Gris) debe ser {maxTricks} para ronda {round}!",
    
    // Modal
    confirm_action_title: "Confirmar Acción",
    keep_names_label: "Mantener nombres de jugadores",
    new_players_button: "Nuevos Jugadores",
    cancel_button: "Cancelar",
    aye_button: "Sí",
    nay_button: "No",
    same_players_prefix: "Mismos Jugadores -",
    
    // Button labels
    new_game_button: "Nuevo Juego",
    edit_round_button: "Editar Ronda {round}",
    
    // Error messages
    min_players_error: "¡Necesitáis al menos 2 piratas para jugar!",
    max_players_error: "¡No más de {maxPlayers} piratas caben en este barco!",
    duplicate_names_error: "¡Cada pirata necesita su propio nombre!",
    max_players_add_error: "¡El barco está lleno! Máximo {maxPlayers} piratas permitidos!",
    invalid_number_error: "¡{playerName} debe ingresar números válidos para todos los campos!",
    whole_numbers_error: "¡{playerName} solo puede usar números enteros, sin medias tintas!",
    non_negative_error: "¡{playerName} no puede usar números negativos!",
    bid_exceeds_tricks_error: "¡La apuesta de {playerName} ({bid}) no puede exceder {maxTricks} bazas en ronda {round}!",
    actual_exceeds_tricks_error: "¡{playerName} no puede ganar más de {maxTricks} bazas en ronda {round}!",
    bonus_without_correct_bid_error: "¡{playerName} no puede ganar puntos de bonificación sin apostar correctamente!",
    unreasonable_bonus_error: "El bonus de {bonus} de {playerName} parece demasiado alto.",
    total_tricks_mismatch_error: "¡Total de bazas ganadas ({totalActual}) debe ser {maxTricks} para ronda {round} con {playerCount} jugadores!",
    no_rounds_to_edit_error: "¡No hay rondas para editar todavía!",
    browser_speech_error: "¡Tu navegador no soporta voz!",
    input_error_title: "¡Avast! ¡Revisa tus entradas!",
    fix_it_button: "¡Sí, lo arreglaré!",
    
    // Commentary - Perfect rounds
    perfect_round_1: "¡Caramba! ¡Cada bucanero acertó su apuesta! ¡Los dioses del mar os sonríen!",
    perfect_round_2: "¡Por mil rayos! ¡Una ronda perfecta! ¡Cada pirata leyó las aguas correctamente!",
    perfect_round_3: "¡Por el cofre de Davy Jones! ¡Ni un solo fallo! ¡Todos sois maestros de los siete mares!",
    
    // Commentary - Single disasters
    disaster_1: "¡Avast! ¡{playerName} se hunde más rápido que un barco sin casco!",
    disaster_2: "¡Por todos los diablos! ¡{playerName} calculó peor que un pirata borracho!",
    disaster_3: "¡Cierren las escotillas! ¡{playerName} acaba de caer hacia Davy Jones!",
    
    // Commentary - Multiple big scores
    big_scores_1: "¡Yo ho ho! ¡Múltiples piratas encontraron oro esta ronda! ¡El tesoro fluye libremente!",
    big_scores_2: "¡Piezas de a ocho! ¡Varios bucaneros llenan sus cofres hoy!",
    big_scores_3: "¡Ahoy! ¡Grandes puntuaciones por todas partes! ¡La tripulación celebra esta noche!",
    
    // Commentary - Default
    default_1: "¡Arr! ¡Los puntos están registrados en el cuaderno de bitácora!",
    default_2: "¡Otra ronda en los libros, mis valientes!",
    default_3: "¡La historia continúa, perros salados!",
    default_4: "¡Adelante hacia la gloria y el tesoro, mi tripulación!",
    default_5: "¡Los vientos de la fortuna soplan en muchas direcciones!",
    
    // Start commentary
    start_1: "¡Bienvenidos a bordo, perros sarnosos! ¡Que los vientos favorezcan a los valientes!",
    start_2: "¡Ahoy marineros! ¡Izad velas hacia la aventura y la gloria!",
    start_3: "¡Icen los colores! ¡La búsqueda del tesoro comienza!",
    
    // Winner announcements - Single winner
    winner_single_1: "¡Salve {name}, el verdadero Rey Calavera de los mares!",
    winner_single_2: "¡Avast! ¡{name} reclama la corona con {score} piezas de a ocho!",
    winner_single_3: "¡Yo ho ho! ¡El capitán {name} saquea la victoria con {score} monedas de oro!",
    winner_single_4: "¡Por mil rayos! ¡{name} es el campeón de estas aguas!",
    
    // Winner announcements - Tie
    winner_tie_1: "¡Caramba! ¡Empate entre {names}! ¡Cada uno con {score} doblones!",
    winner_tie_2: "¡Por la barba de Neptuno! ¡{names} comparten el tesoro con {score} piezas de a ocho cada uno!",
    winner_tie_3: "¡Avast! ¡Múltiples piratas reclaman la victoria! ¡{names} todos con {score} puntos!",
    
    // Score announcements
    no_game_announce: "¡No hay juego en progreso para anunciar!",
    ahoy_mateys: "¡Ahoy marineros!",
    current_bounty_after: "Botín actual después de {rounds} rondas.",
    leading_fleet: "{name} lidera la flota con {score} doblones.",
    bringing_rear: "{name} trae la retaguardia con {score} doblones.",
    follows_with: "{name} sigue con {score} doblones.",
    may_winds_favor: "¡Que los vientos os favorezcan en las rondas restantes!",
    
    // Footer
    disclaimer_title: "Aviso:",
    disclaimer_text_1: "Este sitio web es un contador de puntos creado por fans independientes para el juego de cartas Skull King. No está afiliado, respaldado o conectado con Grandpa Beck's Games, el editor oficial de Skull King. Skull King es una marca registrada de Grandpa Beck's Games.",
    disclaimer_text_2: "Esta herramienta se proporciona con fines educativos y de entretenimiento para ayudar a los jugadores a rastrear sus puntuaciones.",
    feedback_text: "Para comentarios, sugerencias o informes de errores, contacte:",
    
    // PWA Install
    add_to_home_title: "Añadir a Pantalla de Inicio",
    android_chrome_title: "Para instalar en Android (Chrome):",
    android_step_1: "1. Toca el botón de menú (⋮)",
    android_step_2: "2. Selecciona 'Añadir a pantalla de inicio'",
    android_step_3: "3. Toca 'Añadir' para confirmar",
    ios_safari_title: "Para instalar en iOS (Safari):",
    ios_step_1: "1. Toca el botón de compartir",
    ios_step_2: "2. Selecciona 'Añadir a pantalla de inicio'",
    ios_step_3: "3. Toca 'Añadir' para confirmar",
    close_button: "Cerrar",
    
    // Player setup
    name_crew_title: "Nombra Tu Tripulación",
    player_placeholder: "Nombre de Pirata",
    add_pirate_button: "Añadir Pirata",
    clear_all_button: "Borrar Todo",
    set_sail_button: "¡Zarpar!",
    back_to_port_button: "Volver al Puerto",
    game_options_title: "Opciones de Juego",
    
    // New game modal
    new_game_modal_title: "¿Comenzar Nuevo Juego?",
    new_game_modal_message: "Juego actual en progreso. ¿Comenzar un nuevo juego?",
    
    // Currencies (for score announcements)
    pieces_of_eight: "piezas de a ocho",
    doubloons: "doblones",
    gold_coins: "monedas de oro",
    
    // Scoring mode
    scoring_mode_label: "Reglas de Puntuación",
    scoring_mode_normal: "Puntuación Normal",
    scoring_mode_normal_desc: "Skull King tradicional: Apuesta cero = 10×ronda, apuesta correcta = 20×bazas + bonus",
    scoring_mode_rascal: "Puntuación Pícaro",
    scoring_mode_rascal_desc: "Puntuación equilibrada: 10 pts × cartas repartidas. Acierto = completo, fallo por 1 = mitad, fallo por 2+ = cero",
    scoring_mode_description: "Normal = puntuación de apuesta exacta, Pícaro = puntuación proporcional",
    other_options_label: "Otras Opciones",
    expansion_mode_title: "Pack de Expansión",
    expansion_mode_desc: "Añade soporte para 9 jugadores, Raya, Davy Jones y nuevas cartas de bonificación",
    expansion_mode_label: "Jugar con Pack de Expansión (permite 9 jugadores)",
    
    // Bonus calculator
    calc_button: "Calc",
    calculate_button: "Calcular",
    bonus_calculator_title: "Calculadora de Bonus",
    bonus_category_14s: "Cartas Número 14 Capturadas",
    bonus_category_captures: "Capturas de Personajes",
    bonus_label_standard_14: "14s Amarillo/Morado/Verde",
    bonus_label_black_14: "14 Negro (Jolly Roger)",
    bonus_label_mermaid_pirate: "Sirenas capturadas por Piratas",
    bonus_label_sk_pirate: "Piratas capturados por Rey Calavera",
    bonus_label_mermaid_sk: "Rey Calavera capturado por Sirena",
    bonus_label_loot: "Alianzas de Botín",
    bonus_total_label: "Bonus Total:",
    
    // Expansion bonus labels
    expansion_bonuses_header: "⚓ Bonos de Expansión",
    bonus_label_seven: "7s Capturados (Penalización)",
    bonus_label_eight: "8s Capturados (Bonus)",
    bonus_label_firstmate: "Primer Oficial Con Capturado",
    bonus_label_davyjones: "Monstruos Marinos Davy Jones",
    
    kraken_played: "🐙 Kraken jugado (truco destruido)",
    trick_discarded: "🚫 Truco descartado (Ballena/Raya - sin ganador)",
    bonus_clear_btn: "Borrar",
    bonus_apply_btn: "Aplicar Bonus",
    bonus_error_bid_mismatch: "¡Arrr! ¡Bonus solo permitido cuando apuesta igual a bazas ganadas!",
    bonus_error_rascal_miss: "¡Por mil rayos! ¡Sin bonus cuando fallas por 2 o más!",
    
    // Update prompts
    update_available_title: "¡Ahoy! ¡Nueva versión disponible!",
    update_available_message: "¡Una nueva versión del contador está lista! ¿Recargar para obtener las últimas funciones?",
    
    // Error title
    error_title: "¡Alto!"
};

// Export translations object for easy access
const translations = {
    en: enTranslation,
    de: deTranslation,
    es: esTranslation
};

// Export supported languages
const supportedLanguages = ['en', 'de', 'es'] as const;
type SupportedLanguage = typeof supportedLanguages[number];