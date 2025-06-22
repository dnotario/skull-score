"use strict";
/**
 * Translation system for Skull King Score Keeper
 * All text strings used in the application for internationalization
 */
// English translations
const enTranslation = {
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
    // Player setup
    name_crew_title: "Name Yer Crew",
    add_pirate_button: "Add Pirate",
    clear_all_button: "Clear All",
    set_sail_button: "Set Sail!",
    back_to_port_button: "Back to Port",
    player_placeholder: "Pirate",
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
    max_players_error: "No more than 8 pirates can fit on this ship!",
    duplicate_names_error: "Each pirate needs their own name, ye bilge rat!",
    max_players_add_error: "The ship be full! Maximum 8 pirates allowed!",
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
    scoring_mode_rascal_desc: "Even-keeled scoring: 10 pts × cards dealt. Direct hit = full, off by 1 = half, off by 2+ = none"
};
// German translations
const deTranslation = {
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
    // Player setup
    name_crew_title: "Benennt Eure Crew",
    add_pirate_button: "Pirat Hinzufügen",
    clear_all_button: "Alle Löschen",
    set_sail_button: "Segel Setzen!",
    back_to_port_button: "Zurück zum Hafen",
    player_placeholder: "Pirat",
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
    max_players_error: "Nicht mehr als 8 Piraten passen auf dieses Schiff!",
    duplicate_names_error: "Jeder Pirat braucht seinen eigenen Namen!",
    max_players_add_error: "Das Schiff ist voll! Maximal 8 Piraten erlaubt!",
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
    scoring_mode_rascal_desc: "Ausgeglichene Wertung: 10 Pkt × ausgeteilte Karten. Direkttreffer = voll, um 1 daneben = halb, um 2+ daneben = null"
};
// Spanish translations
const esTranslation = {
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
    // Player setup
    name_crew_title: "Nombrad a Vuestra Tripulación",
    add_pirate_button: "Añadir Pirata",
    clear_all_button: "Borrar Todo",
    set_sail_button: "¡Zarpar!",
    back_to_port_button: "Volver al Puerto",
    player_placeholder: "Pirata",
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
    max_players_error: "¡No más de 8 piratas caben en este barco!",
    duplicate_names_error: "¡Cada pirata necesita su propio nombre!",
    max_players_add_error: "¡El barco está lleno! Máximo 8 piratas permitidos!",
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
    scoring_mode_rascal_desc: "Puntuación equilibrada: 10 pts × cartas repartidas. Acierto = completo, fallo por 1 = mitad, fallo por 2+ = cero"
};
// Export translations object for easy access
const translations = {
    en: enTranslation,
    de: deTranslation,
    es: esTranslation
};
// Export supported languages
const supportedLanguages = ['en', 'de', 'es'];
/**
 * ⚠️  DO NOT EDIT THE GENERATED game.js FILE! ⚠️
 *
 * This TypeScript file (game.ts) is the source of truth.
 * The game.js file is automatically generated by TypeScript compiler.
 *
 * To make changes:
 * 1. Edit this file (game.ts)
 * 2. Run: npm run build (or npm run dev for watch mode)
 * 3. The game.js file will be automatically updated
 */
// Translation system class
class GameTranslationSystem {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {
            en: enTranslation,
            de: deTranslation,
            es: esTranslation
        };
        // Try to get saved language from localStorage
        const saved = localStorage.getItem('skull-king-language');
        if (saved && this.translations[saved]) {
            this.currentLanguage = saved;
        }
        else {
            // Auto-detect browser language
            const browserLang = navigator.language.substr(0, 2);
            if (this.translations[browserLang]) {
                this.currentLanguage = browserLang;
            }
        }
    }
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('skull-king-language', lang);
            // Trigger update event
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
        }
    }
    translate(key, params) {
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
const translationSystem = new GameTranslationSystem();
// Create backward-compatible global i18n object
const i18n = translationSystem;
// Make it available globally for browser environment
if (typeof window !== 'undefined') {
    window.i18n = i18n;
}
else if (typeof global !== 'undefined') {
    global.i18n = i18n;
}
/**
 * GameState - Handles data persistence and storage
 * Pure data layer that only manages localStorage operations
 */
class GameState {
    constructor() {
        this.storageKey = 'skullKingGameState';
    }
    load() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : null;
    }
    save(state) {
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }
    clear() {
        localStorage.removeItem(this.storageKey);
    }
    getDefaultState() {
        return {
            players: [],
            rounds: [],
            currentRound: 1,
            scoringMode: 'normal'
        };
    }
}
/**
 * GameViewModel - Contains all business logic and state management
 * Manages game rules, scoring calculations, validation, and analytics
 */
class GameViewModel {
    constructor() {
        this.tempPlayers = [];
        this.modalConfirmCallback = null;
        this.gameState = new GameState();
        this.state = this.gameState.load() || this.gameState.getDefaultState();
    }
    // State Management
    getGameState() {
        return Object.assign({}, this.state);
    }
    saveState() {
        this.gameState.save(this.state);
    }
    clearState() {
        this.gameState.clear();
        this.state = this.gameState.getDefaultState();
    }
    // Scoring Mode Management
    getScoringMode() {
        // First check if there's a saved preference
        const savedPreference = localStorage.getItem('skull-king-scoring-mode');
        if (savedPreference && ['normal', 'rascal'].includes(savedPreference)) {
            return savedPreference;
        }
        // Otherwise use the game state or default
        return this.state.scoringMode || 'normal';
    }
    setScoringMode(mode) {
        this.state.scoringMode = mode;
        this.saveState();
        // Also save as a separate preference
        localStorage.setItem('skull-king-scoring-mode', mode);
    }
    // Player Management
    getTempPlayers() {
        return [...this.tempPlayers];
    }
    initializeTempPlayers() {
        this.tempPlayers = this.state.players.map(p => p.name);
        if (this.tempPlayers.length === 0) {
            this.tempPlayers = [''];
        }
    }
    updateTempPlayer(index, value) {
        this.tempPlayers[index] = value;
    }
    addTempPlayer() {
        this.tempPlayers.push('');
    }
    removeTempPlayer(index) {
        if (this.tempPlayers.length > 1) {
            this.tempPlayers.splice(index, 1);
        }
        else {
            this.tempPlayers[0] = '';
        }
    }
    setTempPlayers(players) {
        this.tempPlayers = [...players];
    }
    validateAndStartGame() {
        const validNames = this.tempPlayers.filter(name => name.trim() !== '');
        if (validNames.length < 2) {
            return this.t('min_players_error');
        }
        if (validNames.length > 8) {
            return this.t('max_players_error');
        }
        // Check for duplicate names
        const uniqueNames = new Set(validNames.map(name => name.trim().toLowerCase()));
        if (uniqueNames.size !== validNames.length) {
            return this.t('duplicate_names_error');
        }
        // Initialize game state
        this.state.players = validNames.map(name => ({ name: name.trim(), score: 0 }));
        this.state.rounds = [];
        this.state.currentRound = 1;
        this.saveState();
        // Track analytics
        this.trackEvent('game_start', {
            event_category: 'game',
            event_label: 'new_game',
            player_count: this.state.players.length,
            value: this.state.players.length
        });
        return null; // Success
    }
    // Scoring Logic
    calculateRoundScore(bid, actual, bonus, roundNumber) {
        const scoringMode = this.getScoringMode();
        const cardsDealt = this.getCardsPerRound(roundNumber, this.state.players.length);
        if (scoringMode === 'rascal') {
            // Rascal's scoring: potential points = 10 × cards dealt
            const potentialPoints = 10 * cardsDealt;
            const difference = Math.abs(bid - actual);
            if (difference === 0) {
                // Direct hit: full points + bonus
                return potentialPoints + bonus;
            }
            else if (difference === 1) {
                // Glancing blow: half points + half bonus
                return Math.floor(potentialPoints / 2) + Math.floor(bonus / 2);
            }
            else {
                // Complete miss: no points
                return 0;
            }
        }
        else {
            // Normal/Traditional Skull King scoring
            if (bid === 0) {
                // Zero bid scoring: 10 points per card dealt for success
                return actual === 0 ? 10 * cardsDealt + bonus : -10 * cardsDealt;
            }
            else {
                // Non-zero bid scoring
                if (bid === actual) {
                    // Correct prediction: 20 points per card dealt + bonus
                    return 20 * cardsDealt + bonus;
                }
                else {
                    // Incorrect prediction: -10 points per difference (no bonus)
                    return -10 * Math.abs(bid - actual);
                }
            }
        }
    }
    // Input Validation
    validateSinglePlayerInput(bid, actual, bonus, playerName, roundNumber) {
        const targetRound = roundNumber || this.state.currentRound;
        // Check for invalid numbers (NaN)
        if (isNaN(bid) || isNaN(actual) || isNaN(bonus)) {
            return this.t('invalid_number_error', { playerName });
        }
        // Integer validation
        if (!Number.isInteger(bid) || !Number.isInteger(actual) || !Number.isInteger(bonus)) {
            return this.t('whole_numbers_error', { playerName });
        }
        // Basic validation
        if (bid < 0 || actual < 0 || bonus < 0) {
            return this.t('non_negative_error', { playerName });
        }
        // Round-specific validation: bids and actual tricks can't exceed available cards
        const maxTricks = this.getCardsPerRound(targetRound, this.state.players.length);
        if (bid > maxTricks) {
            return this.t('bid_exceeds_tricks_error', {
                playerName,
                bid: bid.toString(),
                maxTricks: maxTricks.toString(),
                round: targetRound.toString(),
                playerCount: this.state.players.length.toString()
            });
        }
        if (actual > maxTricks) {
            return this.t('actual_exceeds_tricks_error', {
                playerName,
                maxTricks: maxTricks.toString(),
                round: targetRound.toString(),
                playerCount: this.state.players.length.toString(),
                actual: actual.toString()
            });
        }
        // Bonus point validation - only applies when correctly predicting tricks
        if (bid !== actual && bonus > 0) {
            return this.t('bonus_without_correct_bid_error', {
                playerName,
                bid: bid.toString(),
                actual: actual.toString()
            });
        }
        // Reasonable bonus limits
        if (Math.abs(bonus) > 100) {
            return this.t('unreasonable_bonus_error', {
                playerName,
                bonus: bonus.toString()
            });
        }
        return null; // Valid
    }
    // Round Management
    getCurrentRoundNumber() {
        return this.state.currentRound;
    }
    // Card distribution logic for Skull King (70 card deck)
    getCardsPerRound(roundNumber, playerCount) {
        // Skull King is a 10-round game - rounds beyond 10 are invalid
        if (roundNumber > 10) {
            throw new Error(`Invalid round number: ${roundNumber}. Skull King only has 10 rounds.`);
        }
        // Basic validation
        if (roundNumber < 1) {
            throw new Error(`Invalid round number: ${roundNumber}. Round number must be 1 or greater.`);
        }
        if (playerCount < 1) {
            throw new Error(`Invalid player count: ${playerCount}. Must have at least 1 player.`);
        }
        const totalCards = 70;
        const idealCards = roundNumber;
        const cardsNeeded = idealCards * playerCount;
        // If we can deal the ideal number of cards, do so
        if (cardsNeeded <= totalCards) {
            return idealCards;
        }
        // Otherwise, calculate the maximum cards we can deal per player
        return Math.floor(totalCards / playerCount);
    }
    // Get maximum tricks available for current round
    getMaxTricksForCurrentRound() {
        return this.getCardsPerRound(this.state.currentRound, this.state.players.length);
    }
    validateRoundData(data, roundNumber) {
        const targetRound = roundNumber || this.state.currentRound;
        // Validate each player's input
        for (const [playerName, playerData] of Object.entries(data)) {
            const { bid, actual, bonus } = playerData;
            const validationError = this.validateSinglePlayerInput(bid, actual, bonus, playerName, targetRound);
            if (validationError) {
                return validationError;
            }
        }
        // Validate that total actual wins equals the number of tricks available
        const maxTricks = this.getCardsPerRound(targetRound, this.state.players.length);
        const totalActualWins = Object.values(data).reduce((sum, playerData) => sum + playerData.actual, 0);
        if (totalActualWins !== maxTricks) {
            return this.t('total_tricks_mismatch_error', {
                totalActual: totalActualWins.toString(),
                maxTricks: maxTricks.toString(),
                round: targetRound.toString(),
                playerCount: this.state.players.length.toString()
            });
        }
        return null; // Valid
    }
    addRound(data) {
        const validationError = this.validateRoundData(data);
        if (validationError) {
            return validationError;
        }
        const roundData = {
            roundNumber: this.state.currentRound,
            playerData: [],
            commentary: ''
        };
        // Process each player's data
        for (const player of this.state.players) {
            const playerRoundData = data[player.name];
            const roundScore = this.calculateRoundScore(playerRoundData.bid, playerRoundData.actual, playerRoundData.bonus, this.state.currentRound);
            roundData.playerData.push({
                playerName: player.name,
                bid: playerRoundData.bid,
                actual: playerRoundData.actual,
                bonus: playerRoundData.bonus,
                roundScore
            });
            // Update player's total score
            player.score += roundScore;
        }
        // Generate commentary for this round
        roundData.commentary = this.generateRoundCommentary(roundData);
        this.state.rounds.push(roundData);
        this.state.currentRound++;
        this.saveState();
        // Track analytics
        this.trackEvent('round_complete', {
            event_category: 'gameplay',
            event_label: 'round_finished',
            round_number: roundData.roundNumber,
            player_count: this.state.players.length,
            value: roundData.roundNumber
        });
        // Check if game is complete and track it
        if (this.isGameComplete()) {
            const sortedPlayers = this.getPlayersSortedByScore();
            const winner = sortedPlayers[0];
            this.trackEvent('game_completed', {
                event_category: 'gameplay',
                event_label: 'game_finished',
                winning_score: winner.score,
                scoring_mode: this.getScoringMode(),
                language: translationSystem.getCurrentLanguage(),
                value: this.state.players.length
            });
        }
        return null; // Success
    }
    removeLastRound() {
        if (this.state.rounds.length === 0) {
            return null;
        }
        const lastRound = this.state.rounds.pop();
        // Revert scores from the removed round
        for (const playerData of lastRound.playerData) {
            const player = this.state.players.find(p => p.name === playerData.playerName);
            if (player) {
                player.score -= playerData.roundScore;
            }
        }
        // Decrease current round number
        this.state.currentRound = Math.max(1, this.state.currentRound - 1);
        this.saveState();
        // Track analytics
        this.trackEvent('round_removed', {
            event_category: 'gameplay',
            event_label: 'round_deleted',
            round_number: lastRound.roundNumber,
            value: lastRound.roundNumber
        });
        // Return the round data for pre-filling inputs
        const result = {};
        for (const playerData of lastRound.playerData) {
            result[playerData.playerName] = {
                bid: playerData.bid,
                actual: playerData.actual,
                bonus: playerData.bonus
            };
        }
        return result;
    }
    // Modal Management
    setModalConfirmCallback(callback) {
        this.modalConfirmCallback = callback;
    }
    executeModalConfirm() {
        if (this.modalConfirmCallback) {
            this.modalConfirmCallback();
            this.modalConfirmCallback = null;
        }
    }
    // New Game Logic
    startNewGame(keepNames) {
        const existingNames = keepNames ? this.state.players.map(p => p.name) : [];
        // Preserve the scoring mode preference before clearing state
        const currentScoringMode = this.getScoringMode();
        this.clearState();
        // Restore the scoring mode preference after clearing state
        this.setScoringMode(currentScoringMode);
        if (existingNames.length > 0) {
            this.tempPlayers = [...existingNames];
        }
        else {
            this.tempPlayers = [''];
        }
        // Track analytics
        this.trackEvent('new_game_started', {
            event_category: 'navigation',
            event_label: keepNames ? 'same_players' : 'new_players',
            kept_names: keepNames,
            player_count: existingNames.length,
            value: existingNames.length
        });
    }
    // Analytics
    trackEvent(eventName, parameters = {}) {
        console.log('🔍 Analytics Event:', eventName, parameters);
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
            console.log('✅ Event sent to Google Analytics');
        }
        else {
            console.warn('⚠️ gtag not available - analytics event not sent');
        }
    }
    // Game Status
    isGameActive() {
        return this.state.players.length > 0;
    }
    isGameComplete() {
        return this.state.currentRound > 10;
    }
    hasRounds() {
        return this.state.rounds.length > 0;
    }
    getPlayerCount() {
        return this.state.players.length;
    }
    getRoundCount() {
        return this.state.rounds.length;
    }
    // Get players sorted by score (highest first)
    getPlayersSortedByScore() {
        return [...this.state.players].sort((a, b) => b.score - a.score);
    }
    getPlayers() {
        return [...this.state.players];
    }
    // Commentary generation for a specific round
    generateRoundCommentary(roundData) {
        const perfectPlayers = roundData.playerData.filter(p => p.bid === p.actual);
        const disasters = roundData.playerData.filter(p => Math.abs(p.bid - p.actual) >= 3);
        const bigScores = roundData.playerData.filter(p => p.roundScore >= 40);
        let commentaryMeta = {};
        // Perfect round (everyone got their bid)
        if (perfectPlayers.length === this.state.players.length) {
            const index = Math.floor(Math.random() * 3);
            commentaryMeta = { type: 'perfect', index };
            const comments = [
                this.t('perfect_round_1'),
                this.t('perfect_round_2'),
                this.t('perfect_round_3')
            ];
            roundData.commentaryMeta = commentaryMeta;
            return comments[index];
        }
        // Single disaster
        if (disasters.length === 1) {
            const player = disasters[0];
            const index = Math.floor(Math.random() * 3);
            commentaryMeta = { type: 'disaster', index, playerName: player.playerName };
            const comments = [
                this.t('disaster_1', { playerName: player.playerName }),
                this.t('disaster_2', { playerName: player.playerName }),
                this.t('disaster_3', { playerName: player.playerName })
            ];
            roundData.commentaryMeta = commentaryMeta;
            return comments[index];
        }
        // Multiple big scores
        if (bigScores.length >= 2) {
            const index = Math.floor(Math.random() * 3);
            commentaryMeta = { type: 'big_scores', index };
            const comments = [
                this.t('big_scores_1'),
                this.t('big_scores_2'),
                this.t('big_scores_3')
            ];
            roundData.commentaryMeta = commentaryMeta;
            return comments[index];
        }
        // Default commentary - always return something
        const index = Math.floor(Math.random() * 5);
        commentaryMeta = { type: 'default', index };
        const defaultComments = [
            this.t('default_1'),
            this.t('default_2'),
            this.t('default_3'),
            this.t('default_4'),
            this.t('default_5')
        ];
        roundData.commentaryMeta = commentaryMeta;
        return defaultComments[index];
    }
    // Regenerate commentary from metadata (for language changes)
    regenerateCommentaryFromMeta(meta) {
        if (!meta)
            return this.t('default_1');
        switch (meta.type) {
            case 'perfect':
                const perfectComments = [
                    this.t('perfect_round_1'),
                    this.t('perfect_round_2'),
                    this.t('perfect_round_3')
                ];
                return perfectComments[meta.index] || perfectComments[0];
            case 'disaster':
                const disasterComments = [
                    this.t('disaster_1', { playerName: meta.playerName }),
                    this.t('disaster_2', { playerName: meta.playerName }),
                    this.t('disaster_3', { playerName: meta.playerName })
                ];
                return disasterComments[meta.index] || disasterComments[0];
            case 'big_scores':
                const bigScoreComments = [
                    this.t('big_scores_1'),
                    this.t('big_scores_2'),
                    this.t('big_scores_3')
                ];
                return bigScoreComments[meta.index] || bigScoreComments[0];
            case 'start':
                const startComments = [
                    this.t('start_1'),
                    this.t('start_2'),
                    this.t('start_3')
                ];
                return startComments[meta.index] || startComments[0];
            case 'default':
            default:
                const defaultComments = [
                    this.t('default_1'),
                    this.t('default_2'),
                    this.t('default_3'),
                    this.t('default_4'),
                    this.t('default_5')
                ];
                return defaultComments[meta.index] || defaultComments[0];
        }
    }
    // Get commentary for current state (for voice reading)
    getCurrentCommentary() {
        if (this.state.rounds.length === 0) {
            const startComments = [
                this.t('start_1'),
                this.t('start_2'),
                this.t('start_3')
            ];
            return startComments[Math.floor(Math.random() * startComments.length)];
        }
        // Return the commentary from the most recent round, regenerated in current language
        const lastRound = this.state.rounds[this.state.rounds.length - 1];
        if (lastRound.commentaryMeta) {
            const regeneratedCommentary = this.regenerateCommentaryFromMeta(lastRound.commentaryMeta);
            // Update the stored commentary text to match current language
            lastRound.commentary = regeneratedCommentary;
            return regeneratedCommentary;
        }
        return lastRound.commentary; // Fallback to stored text for backwards compatibility
    }
    // Update all round commentaries to current language
    updateAllCommentariesToCurrentLanguage() {
        this.state.rounds.forEach(round => {
            if (round.commentaryMeta) {
                round.commentary = this.regenerateCommentaryFromMeta(round.commentaryMeta);
            }
        });
    }
    // Winner determination
    getWinner() {
        if (this.state.players.length === 0)
            return null;
        const sortedPlayers = [...this.state.players].sort((a, b) => b.score - a.score);
        const highestScore = sortedPlayers[0].score;
        // Return all players with the highest score (in case of tie)
        return sortedPlayers.filter(player => player.score === highestScore);
    }
    generateWinnerAnnouncement() {
        const winners = this.getWinner();
        if (!winners || winners.length === 0) {
            return "The seas have claimed all! No winners this voyage!";
        }
        if (winners.length === 1) {
            const winner = winners[0];
            const winnerMessages = [
                this.t('winner_single_1', { name: winner.name, score: winner.score.toString() }),
                this.t('winner_single_2', { name: winner.name, score: winner.score.toString() }),
                this.t('winner_single_3', { name: winner.name, score: winner.score.toString() }),
                this.t('winner_single_4', { name: winner.name, score: winner.score.toString() })
            ];
            return winnerMessages[Math.floor(Math.random() * winnerMessages.length)];
        }
        else {
            // Multiple winners (tie)
            const winnerNames = winners.map(w => w.name).join(' and ');
            const score = winners[0].score;
            const tieMessages = [
                this.t('winner_tie_1', { names: winnerNames, score: score.toString() }),
                this.t('winner_tie_2', { names: winnerNames, score: score.toString() }),
                this.t('winner_tie_3', { names: winnerNames, score: score.toString() })
            ];
            return tieMessages[Math.floor(Math.random() * tieMessages.length)];
        }
    }
    // Text-to-Speech
    createScoreAnnouncement() {
        if (this.state.players.length === 0) {
            return this.t('no_game_announce');
        }
        let announcement = this.t('ahoy_mateys');
        // Always use the current commentary from the viewmodel
        const commentary = this.getCurrentCommentary();
        announcement += `${commentary} `;
        const sortedPlayers = [...this.state.players].sort((a, b) => b.score - a.score);
        announcement += this.t('current_bounty_after', { rounds: this.state.rounds.length.toString() });
        sortedPlayers.forEach((player, index) => {
            if (index === 0) {
                announcement += this.t('leading_fleet', { name: player.name, score: player.score.toString() });
            }
            else if (index === sortedPlayers.length - 1 && sortedPlayers.length > 2) {
                announcement += this.t('bringing_rear', { name: player.name, score: player.score.toString() });
            }
            else {
                announcement += this.t('follows_with', { name: player.name, score: player.score.toString() });
            }
        });
        announcement += this.t('may_winds_favor');
        return announcement;
    }
    // Safe translation helper
    t(key, params) {
        return translationSystem.translate(key, params);
    }
    // Public method for testing
    testCalculateRoundScore(bid, actual, bonus, roundNumber, playerCount) {
        // For testing, allow overriding player count
        if (playerCount !== undefined) {
            const cardsDealt = this.getCardsPerRound(roundNumber, playerCount);
            const scoringMode = this.getScoringMode();
            if (scoringMode === 'rascal') {
                // Rascal's scoring: potential points = 10 × cards dealt
                const potentialPoints = 10 * cardsDealt;
                const difference = Math.abs(bid - actual);
                if (difference === 0) {
                    // Direct hit: full points + bonus
                    return potentialPoints + bonus;
                }
                else if (difference === 1) {
                    // Glancing blow: half points + half bonus
                    return Math.floor(potentialPoints / 2) + Math.floor(bonus / 2);
                }
                else {
                    // Complete miss: no points
                    return 0;
                }
            }
            else {
                // Normal/Traditional Skull King scoring
                if (bid === 0) {
                    // Zero bid scoring: 10 points per card dealt for success
                    return actual === 0 ? 10 * cardsDealt + bonus : -10 * cardsDealt;
                }
                else {
                    // Non-zero bid scoring
                    if (bid === actual) {
                        // Correct prediction: 20 points per card dealt + bonus
                        return 20 * cardsDealt + bonus;
                    }
                    else {
                        // Incorrect prediction: -10 points per difference (no bonus)
                        return -10 * Math.abs(bid - actual);
                    }
                }
            }
        }
        return this.calculateRoundScore(bid, actual, bonus, roundNumber);
    }
}
/**
 * SkullKingGame - Main game controller using MVVM architecture
 * Coordinates between ViewModel (business logic) and DOM (view)
 */
class SkullKingGame {
    constructor() {
        this.deferredPrompt = null;
        this.viewModel = new GameViewModel();
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.initializePWA();
        this.initializeTranslations();
        this.updateUI();
    }
    setupEventListeners() {
        // Landing page
        const newGameBtn = document.getElementById('new-game-btn');
        newGameBtn === null || newGameBtn === void 0 ? void 0 : newGameBtn.addEventListener('click', () => this.handleNewGame());
        // Player names setup
        const addPlayerBtn = document.getElementById('add-player-btn');
        addPlayerBtn === null || addPlayerBtn === void 0 ? void 0 : addPlayerBtn.addEventListener('click', () => this.handleAddPlayer());
        const startGameBtn = document.getElementById('start-game-btn');
        startGameBtn === null || startGameBtn === void 0 ? void 0 : startGameBtn.addEventListener('click', () => this.handleStartGame());
        const closeSetupBtn = document.getElementById('close-setup-btn');
        closeSetupBtn === null || closeSetupBtn === void 0 ? void 0 : closeSetupBtn.addEventListener('click', () => this.showLanding());
        // In-game
        const newGameIngameBtn = document.getElementById('new-game-ingame-btn');
        newGameIngameBtn === null || newGameIngameBtn === void 0 ? void 0 : newGameIngameBtn.addEventListener('click', () => this.confirmNewGame());
        const addRoundBtn = document.getElementById('add-round-btn');
        addRoundBtn === null || addRoundBtn === void 0 ? void 0 : addRoundBtn.addEventListener('click', () => this.handleAddRound());
        const readScoresBtn = document.getElementById('read-scores-btn');
        readScoresBtn === null || readScoresBtn === void 0 ? void 0 : readScoresBtn.addEventListener('click', () => this.readScores());
        // Modal
        const modalConfirm = document.getElementById('modal-confirm');
        modalConfirm === null || modalConfirm === void 0 ? void 0 : modalConfirm.addEventListener('click', () => this.handleModalConfirm());
        const modalCancel = document.getElementById('modal-cancel');
        modalCancel === null || modalCancel === void 0 ? void 0 : modalCancel.addEventListener('click', () => this.hideModal());
        // Language selector
        const languageSelector = document.getElementById('language-selector');
        languageSelector === null || languageSelector === void 0 ? void 0 : languageSelector.addEventListener('change', () => this.handleLanguageChange(languageSelector.value));
    }
    // Event Handlers
    handleNewGame() {
        if (this.viewModel.isGameActive()) {
            this.confirmNewGame();
        }
        else {
            this.startPlayerSetup();
        }
    }
    handleAddPlayer() {
        const tempPlayers = this.viewModel.getTempPlayers();
        if (tempPlayers.length >= 8) {
            this.showError(this.t('max_players_add_error'));
            return;
        }
        this.viewModel.addTempPlayer();
        this.updatePlayerInputs();
    }
    handleStartGame() {
        // Get selected scoring mode
        const scoringModeInput = document.querySelector('input[name="scoring-mode"]:checked');
        if (scoringModeInput) {
            this.viewModel.setScoringMode(scoringModeInput.value);
        }
        const error = this.viewModel.validateAndStartGame();
        if (error) {
            this.showError(error);
            return;
        }
        this.updateUI();
    }
    handleAddRound() {
        const gameState = this.viewModel.getGameState();
        const roundData = this.collectRoundData(gameState.players);
        const error = this.viewModel.addRound(roundData);
        if (error) {
            this.showError(error);
            return;
        }
        this.updateUI();
        this.clearRoundInputs();
        this.showCommentary();
        // Scroll to the scores section after recording round
        const scoresSection = document.querySelector('.current-scores');
        if (scoresSection) {
            scoresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    handleModalConfirm() {
        this.viewModel.executeModalConfirm();
        this.hideModal();
    }
    // Helper Methods
    startPlayerSetup() {
        this.viewModel.initializeTempPlayers();
        this.showPlayerSetup();
        this.updatePlayerInputs();
        // Restore scoring mode selection
        const scoringMode = this.viewModel.getScoringMode();
        const scoringModeInput = document.getElementById(`scoring-${scoringMode}`);
        if (scoringModeInput) {
            scoringModeInput.checked = true;
        }
    }
    confirmNewGame() {
        this.showModal(this.t('new_game_modal_title'), this.t('new_game_modal_message'));
        this.viewModel.setModalConfirmCallback(() => {
            // Always keep names when user confirms new game
            this.viewModel.startNewGame(true);
            // Names are already preserved in startNewGame, no need to initialize
            this.showPlayerSetup();
            this.updatePlayerInputs();
            // Restore scoring mode selection
            const scoringMode = this.viewModel.getScoringMode();
            const scoringModeInput = document.getElementById(`scoring-${scoringMode}`);
            if (scoringModeInput) {
                scoringModeInput.checked = true;
            }
        });
    }
    // View Methods
    updateUI() {
        const gameState = this.viewModel.getGameState();
        if (gameState.players.length === 0) {
            this.showLanding();
        }
        else {
            this.showGame();
            this.updateScoreDisplay(gameState.players);
            // Check if game is complete
            const isGameComplete = this.viewModel.isGameComplete();
            if (isGameComplete) {
                this.showWinnerAnnouncement();
                this.hideNewRoundInputs();
            }
            else {
                this.hideWinnerAnnouncement();
                this.showNewRoundInputs();
                this.updateRoundInputs(gameState.players, gameState.currentRound);
            }
            this.updatePreviousRounds(gameState.rounds);
            // Show commentary if we have rounds
            if (gameState.rounds.length > 0) {
                this.showCommentary();
            }
        }
    }
    showLanding() {
        var _a, _b, _c, _d;
        (_a = document.getElementById('landing-section')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
        (_b = document.getElementById('player-names-section')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
        (_c = document.getElementById('game-section')) === null || _c === void 0 ? void 0 : _c.classList.add('hidden');
        (_d = document.getElementById('new-game-section')) === null || _d === void 0 ? void 0 : _d.classList.add('hidden');
    }
    showPlayerSetup() {
        var _a, _b, _c, _d;
        (_a = document.getElementById('landing-section')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = document.getElementById('player-names-section')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        (_c = document.getElementById('game-section')) === null || _c === void 0 ? void 0 : _c.classList.add('hidden');
        (_d = document.getElementById('new-game-section')) === null || _d === void 0 ? void 0 : _d.classList.add('hidden');
        // Ensure scoring mode translations are applied
        this.updateAllTranslations();
    }
    showGame() {
        var _a, _b, _c, _d;
        (_a = document.getElementById('landing-section')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = document.getElementById('player-names-section')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
        (_c = document.getElementById('game-section')) === null || _c === void 0 ? void 0 : _c.classList.remove('hidden');
        (_d = document.getElementById('new-game-section')) === null || _d === void 0 ? void 0 : _d.classList.remove('hidden');
    }
    updatePlayerInputs() {
        const container = document.getElementById('player-names-inputs');
        const addPlayerBtn = document.getElementById('add-player-btn');
        if (!container)
            return;
        const tempPlayers = this.viewModel.getTempPlayers();
        container.innerHTML = tempPlayers.map((name, index) => `
            <div class="player-name-input">
                <input type="text" id="player-${index}" placeholder="${this.t('player_placeholder')}" value="${name}" onchange="game.updateTempPlayer(${index}, this.value)">
                <button class="btn-remove" onclick="game.removePlayer(${index})" title="Remove player">✕</button>
            </div>
        `).join('');
        // Hide/show Add Pirate button based on player count (max 8)
        if (addPlayerBtn) {
            if (tempPlayers.length >= 8) {
                addPlayerBtn.style.display = 'none';
            }
            else {
                addPlayerBtn.style.display = 'inline-block';
            }
        }
    }
    updateScoreDisplay(players) {
        const scoreDisplay = document.getElementById('score-display');
        if (!scoreDisplay)
            return;
        // Get players sorted by score from the view model
        const sortedPlayers = this.viewModel.getPlayersSortedByScore();
        scoreDisplay.innerHTML = sortedPlayers.map(player => `
            <div class="player-score">
                <h4>${player.name}</h4>
                <div class="score-value">${player.score}</div>
            </div>
        `).join('');
    }
    updateRoundInputs(players, currentRound) {
        const container = document.getElementById('round-inputs');
        const roundNumberEl = document.getElementById('round-number');
        if (!container)
            return;
        const maxTricks = this.viewModel.getMaxTricksForCurrentRound();
        const roundDisplay = maxTricks < currentRound ?
            `${currentRound} (${this.t('cards_each', { cards: maxTricks.toString() })})` :
            currentRound.toString();
        if (roundNumberEl) {
            roundNumberEl.textContent = roundDisplay;
        }
        container.innerHTML = players.map((player, index) => `
            <div class="player-round-input">
                <h4>${player.name}</h4>
                <div class="round-input-row">
                    <div class="input-group">
                        <label for="bid-player-${index}" class="input-label">${this.t('bid_label')}</label>
                        <input type="number" id="bid-player-${index}" placeholder="0" min="0" max="${maxTricks}" oninput="game.updateRoundScoreByIndex(${index})">
                    </div>
                    <div class="input-group">
                        <label for="actual-player-${index}" class="input-label">${this.t('won_label')}</label>
                        <input type="number" id="actual-player-${index}" placeholder="0" min="0" max="${maxTricks}" oninput="game.updateRoundScoreByIndex(${index})">
                    </div>
                    <div class="input-group">
                        <label for="bonus-player-${index}" class="input-label">${this.t('bonus_label')}</label>
                        <input type="number" id="bonus-player-${index}" placeholder="0" min="0" oninput="game.updateRoundScoreByIndex(${index})">
                    </div>
                    <div class="input-group">
                        <label class="input-label">${this.t('score_label')}</label>
                        <div id="score-player-${index}" class="computed-score">-</div>
                    </div>
                </div>
            </div>
        `).join('');
        // Initialize computed scores for all players
        players.forEach((player, index) => this.updateRoundScoreInternalByIndex(index));
    }
    updatePreviousRounds(rounds) {
        const container = document.getElementById('previous-rounds');
        if (!container)
            return;
        if (rounds.length === 0) {
            container.innerHTML = '';
            return;
        }
        // Display rounds in reverse order (newest first)
        const sortedRounds = [...rounds].reverse();
        container.innerHTML = sortedRounds.map((round, index) => `
            <div class="round-display parchment">
                <div class="round-header">
                    <h3>${this.t('round_display', { round: round.roundNumber.toString() })}</h3>
                    ${index === 0 ? `<button class="btn btn-secondary" onclick="game.handleUpdateLastRound()">${this.t('edit_round_button')}</button>` : ''}
                </div>
                <div class="round-data">
                    <div class="round-data-header">
                        <span>${this.t('player_label')}</span>
                        <span>${this.t('bid_label')}</span>
                        <span>${this.t('won_label')}</span>
                        <span>${this.t('bonus_label')}</span>
                        <span>${this.t('score_label')}</span>
                    </div>
                    ${round.playerData.map(data => `
                        <div class="player-round-data">
                            <strong>${data.playerName}</strong>
                            <span>${data.bid}</span>
                            <span>${data.actual}</span>
                            <span>${data.bonus}</span>
                            <span>${data.roundScore > 0 ? '+' : ''}${data.roundScore}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    collectRoundData(players) {
        const data = {};
        players.forEach((player, index) => {
            var _a, _b, _c;
            const bidInput = document.getElementById(`bid-player-${index}`);
            const actualInput = document.getElementById(`actual-player-${index}`);
            const bonusInput = document.getElementById(`bonus-player-${index}`);
            // Parse values, defaulting to 0 for empty inputs
            const bidValue = ((_a = bidInput === null || bidInput === void 0 ? void 0 : bidInput.value) === null || _a === void 0 ? void 0 : _a.trim()) || '0';
            const actualValue = ((_b = actualInput === null || actualInput === void 0 ? void 0 : actualInput.value) === null || _b === void 0 ? void 0 : _b.trim()) || '0';
            const bonusValue = ((_c = bonusInput === null || bonusInput === void 0 ? void 0 : bonusInput.value) === null || _c === void 0 ? void 0 : _c.trim()) || '0';
            data[player.name] = {
                bid: parseInt(bidValue),
                actual: parseInt(actualValue),
                bonus: parseInt(bonusValue)
            };
        });
        return data;
    }
    clearRoundInputs() {
        const inputs = document.querySelectorAll('#round-inputs input');
        inputs.forEach(input => input.value = '');
    }
    showCommentary() {
        const commentary = this.viewModel.getCurrentCommentary();
        const commentaryEl = document.getElementById('pirate-commentary');
        const textEl = document.getElementById('commentary-text');
        if (commentaryEl && textEl) {
            if (commentary) {
                textEl.textContent = commentary;
                commentaryEl.classList.remove('hidden');
            }
            else {
                commentaryEl.classList.add('hidden');
            }
        }
    }
    showWinnerAnnouncement() {
        const winnerAnnouncement = document.getElementById('winner-announcement');
        const winnerText = document.getElementById('winner-text');
        if (winnerAnnouncement && winnerText) {
            const announcement = this.viewModel.generateWinnerAnnouncement();
            winnerText.textContent = announcement;
            winnerAnnouncement.classList.remove('hidden');
        }
    }
    hideWinnerAnnouncement() {
        const winnerAnnouncement = document.getElementById('winner-announcement');
        if (winnerAnnouncement) {
            winnerAnnouncement.classList.add('hidden');
        }
    }
    showNewRoundInputs() {
        const newRoundEl = document.getElementById('new-round');
        if (newRoundEl) {
            newRoundEl.classList.remove('hidden');
        }
    }
    hideNewRoundInputs() {
        const newRoundEl = document.getElementById('new-round');
        if (newRoundEl) {
            newRoundEl.classList.add('hidden');
        }
    }
    showModal(title, message) {
        const modal = document.getElementById('modal');
        const titleEl = document.getElementById('modal-title');
        const messageEl = document.getElementById('modal-message');
        const modalButtons = document.getElementById('modal-buttons');
        if (!modal || !titleEl || !messageEl)
            return;
        titleEl.textContent = title;
        messageEl.textContent = message;
        // Show standard buttons
        modalButtons === null || modalButtons === void 0 ? void 0 : modalButtons.classList.remove('hidden');
        modal.classList.remove('hidden');
    }
    showErrorModal(message) {
        const modal = document.getElementById('modal');
        const titleEl = document.getElementById('modal-title');
        const messageEl = document.getElementById('modal-message');
        const modalButtons = document.getElementById('modal-buttons');
        const modalConfirm = document.getElementById('modal-confirm');
        const modalCancel = document.getElementById('modal-cancel');
        if (!modal || !titleEl || !messageEl)
            return;
        titleEl.textContent = this.t('input_error_title');
        messageEl.textContent = message;
        modalButtons === null || modalButtons === void 0 ? void 0 : modalButtons.classList.remove('hidden');
        // Show only the confirm button (OK)
        if (modalConfirm && modalCancel) {
            modalConfirm.textContent = this.t('fix_it_button');
            modalCancel.style.display = 'none';
        }
        // Clear any existing callback and set error modal behavior
        this.viewModel.setModalConfirmCallback(() => {
            if (modalCancel)
                modalCancel.style.display = 'inline-block';
            if (modalConfirm)
                modalConfirm.textContent = this.t('aye_button');
        });
        modal.classList.remove('hidden');
    }
    hideModal() {
        const modal = document.getElementById('modal');
        modal === null || modal === void 0 ? void 0 : modal.classList.add('hidden');
    }
    showError(message) {
        this.showErrorModal(message);
    }
    getLanguageSpecificSpeechSettings(language) {
        const settings = {
            'en': {
                rate: 0.7, // Slower and more dramatic for English
                pitch: 0.7, // Lower pitch for gruff pirate voice
                volume: 1.0
            },
            'de': {
                rate: 0.65, // Slightly slower for German to sound more commanding
                pitch: 0.6, // Even lower pitch for authoritative German pirate
                volume: 1.0
            },
            'es': {
                rate: 0.75, // Slightly faster for Spanish passion
                pitch: 0.75, // Slightly higher pitch for Spanish expressiveness
                volume: 1.0
            }
        };
        return settings[language] || settings['en'];
    }
    readScores() {
        // Check if browser supports speech synthesis
        if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
            this.showErrorModal(this.t('browser_speech_error'));
            return;
        }
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        // Force refresh the view model's translation context before creating announcement
        const announcement = this.viewModel.createScoreAnnouncement();
        // Create and configure the utterance for maximum pirate effect
        const utterance = new SpeechSynthesisUtterance(announcement);
        // Get current language
        const currentLang = translationSystem.getCurrentLanguage();
        // Set the utterance language based on current selection
        utterance.lang = currentLang === 'de' ? 'de-DE' :
            currentLang === 'es' ? 'es-ES' : 'en-US';
        // Set language-specific speech parameters for pirate effect
        const speechSettings = this.getLanguageSpecificSpeechSettings(currentLang);
        utterance.rate = speechSettings.rate;
        utterance.pitch = speechSettings.pitch;
        utterance.volume = speechSettings.volume;
        // Function to set language-appropriate voice
        const setLanguageVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length === 0) {
                // Voices not loaded yet, try again in a moment
                setTimeout(setLanguageVoice, 100);
                return;
            }
            let pirateVoice = null;
            const voicePreferences = {
                'en': {
                    langCodes: ['en-US', 'en-GB', 'en-AU', 'en'],
                    preferredNames: ['daniel', 'david', 'alex', 'male', 'aaron', 'fred']
                },
                'de': {
                    langCodes: ['de-DE', 'de-AT', 'de-CH', 'de'],
                    preferredNames: ['male', 'markus', 'stefan', 'hans', 'dieter']
                },
                'es': {
                    langCodes: ['es-ES', 'es-MX', 'es-AR', 'es-US', 'es'],
                    preferredNames: ['male', 'carlos', 'diego', 'jorge', 'manuel', 'pablo']
                }
            };
            const prefs = voicePreferences[currentLang] || voicePreferences['en'];
            // Try to find the best voice for the current language
            for (const langCode of prefs.langCodes) {
                // First, try to find preferred male voices
                for (const preferredName of prefs.preferredNames) {
                    pirateVoice = voices.find(voice => voice.lang.toLowerCase().startsWith(langCode.toLowerCase()) &&
                        voice.name.toLowerCase().includes(preferredName.toLowerCase()));
                    if (pirateVoice)
                        break;
                }
                if (pirateVoice)
                    break;
                // If no preferred voice found, try any male voice for this language
                pirateVoice = voices.find(voice => voice.lang.toLowerCase().startsWith(langCode.toLowerCase()) &&
                    !voice.name.toLowerCase().includes('female'));
                if (pirateVoice)
                    break;
                // If still no voice, try any voice for this language
                pirateVoice = voices.find(voice => voice.lang.toLowerCase().startsWith(langCode.toLowerCase()));
                if (pirateVoice)
                    break;
            }
            // Fallback to any English voice if no voice found for selected language
            if (!pirateVoice) {
                pirateVoice = voices.find(voice => voice.lang.startsWith('en') &&
                    !voice.name.toLowerCase().includes('female')) || voices.find(voice => voice.lang.startsWith('en'));
            }
            if (pirateVoice) {
                utterance.voice = pirateVoice;
                utterance.lang = pirateVoice.lang; // Set the language explicitly
                console.log(`🗣️ Using voice: ${pirateVoice.name} (${pirateVoice.lang}) for language: ${currentLang}`);
            }
            else {
                console.warn(`⚠️ No suitable voice found for language: ${currentLang}`);
            }
            // Speak!
            window.speechSynthesis.speak(utterance);
        };
        // Set voice and speak
        setLanguageVoice();
    }
    updateRoundScoreInternal(playerName) {
        const bidInput = document.getElementById(`bid-${playerName}`);
        const actualInput = document.getElementById(`actual-${playerName}`);
        const bonusInput = document.getElementById(`bonus-${playerName}`);
        const scoreDisplay = document.getElementById(`score-${playerName}`);
        if (!bidInput || !actualInput || !bonusInput || !scoreDisplay)
            return;
        // Get input values
        const bidValue = bidInput.value.trim();
        const actualValue = actualInput.value.trim();
        const bonusValue = bonusInput.value.trim();
        // Only show score when both bid and actual have values (Option 1: Progressive Disclosure)
        if (!bidValue || !actualValue) {
            scoreDisplay.textContent = '-';
            scoreDisplay.className = 'computed-score';
            return;
        }
        // Parse values (bonus defaults to 0 if empty)
        const bid = parseInt(bidValue);
        const actual = parseInt(actualValue);
        const bonus = bonusValue ? parseInt(bonusValue) : 0;
        // Use the centralized validation
        const validationError = this.viewModel.validateSinglePlayerInput(bid, actual, bonus, playerName);
        if (validationError) {
            scoreDisplay.textContent = '-';
            scoreDisplay.className = 'computed-score invalid';
            return;
        }
        // Calculate score
        const currentRound = this.viewModel.getCurrentRoundNumber();
        const score = this.viewModel.testCalculateRoundScore(bid, actual, bonus, currentRound);
        // Display score with appropriate styling
        scoreDisplay.textContent = score > 0 ? `+${score}` : score.toString();
        scoreDisplay.className = `computed-score ${score > 0 ? 'positive' : score < 0 ? 'negative' : 'zero'}`;
    }
    updateRoundScoreInternalByIndex(playerIndex) {
        var _a;
        const bidInput = document.getElementById(`bid-player-${playerIndex}`);
        const actualInput = document.getElementById(`actual-player-${playerIndex}`);
        const bonusInput = document.getElementById(`bonus-player-${playerIndex}`);
        const scoreDisplay = document.getElementById(`score-player-${playerIndex}`);
        if (!bidInput || !actualInput || !bonusInput || !scoreDisplay)
            return;
        // Get input values
        const bidValue = bidInput.value.trim();
        const actualValue = actualInput.value.trim();
        const bonusValue = bonusInput.value.trim();
        // Only show score when both bid and actual have values (Option 1: Progressive Disclosure)
        if (!bidValue || !actualValue) {
            scoreDisplay.textContent = '-';
            scoreDisplay.className = 'computed-score';
            return;
        }
        // Parse values (bonus defaults to 0 if empty)
        const bid = parseInt(bidValue);
        const actual = parseInt(actualValue);
        const bonus = bonusValue ? parseInt(bonusValue) : 0;
        // Get player name for validation
        const players = this.viewModel.getPlayers();
        const playerName = ((_a = players[playerIndex]) === null || _a === void 0 ? void 0 : _a.name) || '';
        // Use the centralized validation
        const validationError = this.viewModel.validateSinglePlayerInput(bid, actual, bonus, playerName);
        if (validationError) {
            scoreDisplay.textContent = '-';
            scoreDisplay.className = 'computed-score invalid';
            return;
        }
        // Calculate score
        const currentRound = this.viewModel.getCurrentRoundNumber();
        const score = this.viewModel.testCalculateRoundScore(bid, actual, bonus, currentRound);
        // Display score with appropriate styling
        scoreDisplay.textContent = score > 0 ? `+${score}` : score.toString();
        scoreDisplay.className = `computed-score ${score > 0 ? 'positive' : score < 0 ? 'negative' : 'zero'}`;
    }
    // Public API for HTML event handlers
    updateTempPlayer(index, value) {
        this.viewModel.updateTempPlayer(index, value);
    }
    removePlayer(index) {
        this.viewModel.removeTempPlayer(index);
        this.updatePlayerInputs();
    }
    updateRoundScore(playerName) {
        this.updateRoundScoreInternal(playerName);
    }
    updateRoundScoreByIndex(playerIndex) {
        const players = this.viewModel.getPlayers();
        if (playerIndex >= 0 && playerIndex < players.length) {
            this.updateRoundScoreInternalByIndex(playerIndex);
        }
    }
    handleUpdateLastRound() {
        // Remove the last round and get its data for pre-filling
        const lastRoundData = this.viewModel.removeLastRound();
        if (!lastRoundData) {
            this.showError(this.t('no_rounds_to_edit_error'));
            return;
        }
        // Ensure the round inputs are visible for editing, even if game was complete
        this.showNewRoundInputs();
        // Update UI to reflect the new game state (with last round removed)
        this.updateUI();
        // Populate the inputs with the removed round's data for editing
        const players = this.viewModel.getPlayers();
        for (const [playerName, data] of Object.entries(lastRoundData)) {
            // Find player index by name
            const playerIndex = players.findIndex((p) => p.name === playerName);
            if (playerIndex === -1)
                continue;
            const bidInput = document.getElementById(`bid-player-${playerIndex}`);
            const actualInput = document.getElementById(`actual-player-${playerIndex}`);
            const bonusInput = document.getElementById(`bonus-player-${playerIndex}`);
            if (bidInput)
                bidInput.value = data.bid.toString();
            if (actualInput)
                actualInput.value = data.actual.toString();
            if (bonusInput)
                bonusInput.value = data.bonus.toString();
            // Update the computed score for this player
            this.updateRoundScoreInternalByIndex(playerIndex);
        }
        // Scroll to the round inputs section for editing
        const roundInputsSection = document.getElementById('new-round');
        if (roundInputsSection) {
            roundInputsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    // Translation Management
    initializeTranslations() {
        // Set initial language in selector
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = translationSystem.getCurrentLanguage();
        }
        // Listen for language change events
        window.addEventListener('languageChanged', () => {
            this.updateAllTranslations();
        });
        // Initial translation update
        this.updateAllTranslations();
    }
    handleLanguageChange(language) {
        translationSystem.setLanguage(language);
    }
    // Safe translation helper
    t(key, params) {
        return translationSystem.translate(key, params);
    }
    updateAllTranslations() {
        // Update meta tags
        this.updateMetaTags();
        // Update static content
        this.updateStaticContent();
        // Update dynamic content if game is active
        if (this.viewModel.isGameActive()) {
            // Update all round commentaries to current language
            this.viewModel.updateAllCommentariesToCurrentLanguage();
            this.updateUI();
            // Force refresh commentary with new language
            this.showCommentary();
        }
    }
    updateMetaTags() {
        // Update document title
        const title = document.getElementById('page-title');
        if (title)
            title.textContent = this.t('page_title');
        // Update meta description
        const description = document.querySelector('meta[name="description"]');
        if (description)
            description.content = this.t('page_description');
        // Update meta keywords
        const keywords = document.querySelector('meta[name="keywords"]');
        if (keywords)
            keywords.content = this.t('page_keywords');
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle)
            ogTitle.content = this.t('og_title');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription)
            ogDescription.content = this.t('og_description');
        // Update Twitter tags
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle)
            twitterTitle.content = this.t('og_title');
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription)
            twitterDescription.content = this.t('twitter_description');
        // Update app title
        const appTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
        if (appTitle)
            appTitle.content = this.t('app_title');
    }
    updateStaticContent() {
        // Header
        const headerTitle = document.getElementById('header-title');
        if (headerTitle)
            headerTitle.textContent = this.t('header_title');
        const headerTagline = document.getElementById('header-tagline');
        if (headerTagline)
            headerTagline.textContent = this.t('header_tagline');
        // Landing page
        const landingTitle = document.getElementById('landing-title');
        if (landingTitle)
            landingTitle.textContent = this.t('landing_title');
        const landingDescription = document.getElementById('landing-description');
        if (landingDescription)
            landingDescription.textContent = this.t('landing_description');
        const landingSubtitle = document.getElementById('landing-subtitle');
        if (landingSubtitle)
            landingSubtitle.textContent = this.t('landing_subtitle');
        // Features
        const featureMobile = document.getElementById('feature-mobile');
        if (featureMobile)
            featureMobile.innerHTML = this.t('feature_mobile');
        const featureCalculator = document.getElementById('feature-calculator');
        if (featureCalculator)
            featureCalculator.innerHTML = this.t('feature_calculator');
        const featureCommentary = document.getElementById('feature-commentary');
        if (featureCommentary)
            featureCommentary.innerHTML = this.t('feature_commentary');
        const featureAudio = document.getElementById('feature-audio');
        if (featureAudio)
            featureAudio.innerHTML = this.t('feature_audio');
        const featureSaving = document.getElementById('feature-saving');
        if (featureSaving)
            featureSaving.innerHTML = this.t('feature_saving');
        const whyChooseTitle = document.getElementById('why-choose-title');
        if (whyChooseTitle)
            whyChooseTitle.textContent = this.t('why_choose_title');
        const whyChooseDescription = document.getElementById('why-choose-description');
        if (whyChooseDescription)
            whyChooseDescription.textContent = this.t('why_choose_description');
        // Buttons
        const newGameBtn = document.getElementById('new-game-btn');
        if (newGameBtn)
            newGameBtn.textContent = this.t('start_button');
        const nameCrewTitle = document.getElementById('name-crew-title');
        if (nameCrewTitle)
            nameCrewTitle.textContent = this.t('name_crew_title');
        const addPlayerBtn = document.getElementById('add-player-btn');
        if (addPlayerBtn)
            addPlayerBtn.textContent = this.t('add_pirate_button');
        const startGameBtn = document.getElementById('start-game-btn');
        if (startGameBtn)
            startGameBtn.textContent = this.t('set_sail_button');
        // Scoring mode translations
        const scoringModeLabel = document.getElementById('scoring-mode-label');
        if (scoringModeLabel)
            scoringModeLabel.textContent = this.t('scoring_mode_label');
        const scoringModeNormal = document.getElementById('scoring-mode-normal');
        if (scoringModeNormal)
            scoringModeNormal.textContent = this.t('scoring_mode_normal');
        const scoringModeNormalDesc = document.getElementById('scoring-mode-normal-desc');
        if (scoringModeNormalDesc)
            scoringModeNormalDesc.textContent = this.t('scoring_mode_normal_desc');
        const scoringModeRascal = document.getElementById('scoring-mode-rascal');
        if (scoringModeRascal)
            scoringModeRascal.textContent = this.t('scoring_mode_rascal');
        const scoringModeRascalDesc = document.getElementById('scoring-mode-rascal-desc');
        if (scoringModeRascalDesc)
            scoringModeRascalDesc.textContent = this.t('scoring_mode_rascal_desc');
        const newGameIngameBtn = document.getElementById('new-game-ingame-btn');
        if (newGameIngameBtn)
            newGameIngameBtn.textContent = this.t('new_game_button');
        // Game section
        const currentBountyTitle = document.getElementById('current-bounty-title');
        if (currentBountyTitle)
            currentBountyTitle.textContent = this.t('current_bounty_title');
        const readScoresBtn = document.getElementById('read-scores-btn');
        if (readScoresBtn)
            readScoresBtn.innerHTML = `🔊 ${this.t('read_scores_button').replace('🔊 ', '')}`;
        const gameCompleteTitle = document.getElementById('game-complete-title');
        if (gameCompleteTitle)
            gameCompleteTitle.textContent = this.t('game_complete_title');
        const roundLabel = document.getElementById('round-label');
        if (roundLabel)
            roundLabel.textContent = this.t('round_label');
        const addRoundBtn = document.getElementById('add-round-btn');
        if (addRoundBtn)
            addRoundBtn.textContent = this.t('record_round_button');
        // Modal
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle)
            modalTitle.textContent = this.t('confirm_action_title');
        const keepNamesLabel = document.getElementById('keep-names-label');
        if (keepNamesLabel)
            keepNamesLabel.textContent = this.t('keep_names_label');
        const newPlayersBtn = document.getElementById('new-players-btn');
        if (newPlayersBtn)
            newPlayersBtn.textContent = this.t('new_players_button');
        const cancelNewGameBtn = document.getElementById('cancel-new-game-btn');
        if (cancelNewGameBtn)
            cancelNewGameBtn.textContent = this.t('cancel_button');
        const modalConfirm = document.getElementById('modal-confirm');
        if (modalConfirm)
            modalConfirm.textContent = this.t('aye_button');
        const modalCancel = document.getElementById('modal-cancel');
        if (modalCancel)
            modalCancel.textContent = this.t('nay_button');
        // Footer
        const disclaimerTitle = document.getElementById('disclaimer-title');
        if (disclaimerTitle)
            disclaimerTitle.textContent = this.t('disclaimer_title');
        const disclaimerText1 = document.getElementById('disclaimer-text-1');
        if (disclaimerText1)
            disclaimerText1.textContent = this.t('disclaimer_text_1');
        const disclaimerText2 = document.getElementById('disclaimer-text-2');
        if (disclaimerText2)
            disclaimerText2.textContent = this.t('disclaimer_text_2');
        const feedbackText = document.getElementById('feedback-text');
        if (feedbackText)
            feedbackText.textContent = this.t('feedback_text');
    }
    // PWA Install Functionality
    initializePWA() {
        // Guard for test environment
        if (typeof document === 'undefined')
            return;
        // Register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                    .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
            });
        }
        // Don't show install buttons if already in standalone mode (installed)
        if ((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
            window.navigator.standalone) {
            this.hideInstallButtons();
            return;
        }
        // Add event listeners to existing install buttons
        this.setupInstallButtons();
    }
    setupInstallButtons() {
        // Add event listener to the header install button
        const installBtnHeader = document.getElementById('install-app-btn-header');
        if (installBtnHeader) {
            installBtnHeader.addEventListener('click', () => this.showInstallInstructions());
        }
    }
    hideInstallButtons() {
        const installBtnHeader = document.getElementById('install-app-btn-header');
        if (installBtnHeader) {
            installBtnHeader.style.display = 'none';
        }
    }
    showInstallInstructions() {
        // Show instructions for manual installation
        let modal = document.getElementById('install-instructions-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'install-instructions-modal';
            modal.className = 'install-modal';
            modal.innerHTML = `
                <div class="install-modal-content">
                    <h3>${this.t('add_to_home_title')}</h3>
                    <div class="install-instructions">
                        <p><strong>${this.t('android_chrome_title')}</strong></p>
                        <ol>
                            <li>${this.t('android_step_1')}</li>
                            <li>${this.t('android_step_2')}</li>
                            <li>${this.t('android_step_3')}</li>
                        </ol>
                        <p><strong>${this.t('ios_safari_title')}</strong></p>
                        <ol>
                            <li>${this.t('ios_step_1')}</li>
                            <li>${this.t('ios_step_2')}</li>
                            <li>${this.t('ios_step_3')}</li>
                        </ol>
                    </div>
                    <button class="install-modal-close" onclick="this.parentElement.parentElement.style.display='none'">${this.t('close_button')}</button>
                </div>
            `;
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
    }
    // Public method for testing the scoring logic
    testCalculateRoundScore(bid, actual, bonus, roundNumber, playerCount) {
        return this.viewModel.testCalculateRoundScore(bid, actual, bonus, roundNumber, playerCount);
    }
    // Public method for validation testing
    testValidateSinglePlayerInput(bid, actual, bonus, playerName, roundNumber) {
        return this.viewModel.validateSinglePlayerInput(bid, actual, bonus, playerName, roundNumber);
    }
    // Public method for testing scoring modes
    getViewModel() {
        return this.viewModel;
    }
}
// Initialize game
const game = new SkullKingGame();
// Expose game instance and class globally
window.game = game;
window.SkullKingGame = SkullKingGame;
