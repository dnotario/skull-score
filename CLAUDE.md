# Skull King Score Keeper - Development Notes

This is a complete HTML+TypeScript-based score tracking application for the Skull King card game. The project has evolved into a full-featured application with professional deployment workflows.

## Current Structure

The application is fully implemented and deployed across multiple environments:
- **Production**: https://www.skullkingscorekeeper.com
- **Staging**: https://dnotario.github.io/skull-score-staging

## Key Features Implemented

✅ **Core Game Functionality**
- Single-page pirate-themed application with authentic Republic of Pirates aesthetic
- Local storage for state persistence (no server backend)
- 2-8 player support with custom names (2-9 with expansion pack)
- Complete 10-round score tracking with bid/actual/bonus input
- Traditional (Classic) and Rascal scoring modes
- Real-time score calculation and validation
- Round editing and deletion capabilities
- Mobile-responsive design optimized for phones

✅ **Scoring Systems**
- **Traditional Scoring**: 20 points × tricks taken for exact bid, -10 × difference for failed bid
- **Rascal Scoring**: Variable points based on accuracy (100% exact, 50% off-by-one, 0% otherwise)
- **Zero Bid Scoring**: Special scoring for zero bids in both modes
- **Bonus Points**: Manual entry with validation (only allowed when bid = actual)

✅ **Expansion Pack Support** (December 2025)
- **9-Player Support**: Expansion mode allows up to 9 players with extended card deck
- **Graybeard Mode**: 2-player ghost player for two-player games
- **Expansion Bonus Calculator**: 7s (-5 penalty), 8s (+5), First Mate Con (+30), Davy Jones (+20 per sea monster)
- **Sea Monster Tracking**: Kraken, White Whale, and Spotted Stingray destroy tricks
- **Trick Discarded**: Whale/Stingray can discard tricks with no winner
- **Dynamic Card Limits**: Adjusts max cards per round based on player count and expansion mode

✅ **Input Validation**
- Prevents bids/actual exceeding available tricks per round
- Ensures total tricks won equals cards dealt (accounting for Kraken/discarded tricks)
- Bonus points only allowed for correct predictions
- Integer-only inputs with reasonable limits
- Comprehensive error messages in pirate dialect

✅ **Advanced Features**
- Interactive bonus calculator modal with visual counters for all bonus types
- Intelligent pirate commentary system with 100+ unique variants
- Audio score readouts with text-to-speech integration
- Comprehensive input validation and error handling
- Game state management with optional player name retention
- Animated UI elements (bobbing parrot, glowing borders)

✅ **Technical Implementation**
- TypeScript with proper type safety and interfaces
- Jest testing framework with comprehensive test coverage (125+ tests)
- Professional deployment pipeline with staging/production branches
- Pre-commit hooks and automated builds
- Google Analytics integration
- Pure function architecture for scoring logic

## Project Architecture

See **README.md** for complete technical details including:
- Deployment workflow and branch strategy
- Development setup and testing procedures
- Feature specifications and game rules
- Mobile optimization and browser support
- Code quality standards and contribution guidelines

## Recent Updates

### Expansion Pack Support (December 2025)
- Full expansion pack support with 9-player mode
- Graybeard ghost player for 2-player games
- Expansion bonus calculator (7s, 8s, First Mate Con, Davy Jones sea monsters)
- Sea monster tracking (Kraken, White Whale, Spotted Stingray)
- Trick discarded option for Whale/Stingray with no winner
- Dynamic card limits based on player count and expansion mode
- 125+ unit tests covering all expansion features

### Build System Refactoring (June 2025)
- Separated source and built files - TypeScript output now goes to `build/runFiles/`
- Updated deployment pipeline to use new build directory structure
- All runtime files (HTML, CSS, JS, images) are copied to `build/runFiles/` during build

### Scoring Bug Fix (June 2025)
- Fixed critical bug where Traditional scoring was using cards dealt instead of tricks taken
- Refactored `calculateRoundScore` to be a pure function with all dependencies as parameters
- Added comprehensive tests to verify correct scoring behavior

### Rules Compliance
- Extracted official game rules from PDF rulebook to RULES.md
- Validated bonus point restrictions (only allowed when bid = actual)
- Added tests to ensure rounds with invalid bonus points are rejected

### UI Improvements
- Standardized font sizes and spacing in bonus calculator popup to match main page design
- Improved mobile experience with better touch targets and consistent sizing
- Enhanced visual hierarchy for better readability across all modals

## What's NOT Implemented

The app functions as a **score keeper**, not a full game implementation:
- No card tracking or automatic determination of which bonuses were earned
- No optional scoring variants (Cannonball/Grapeshot for Rascal mode)
- No variable round structures (only standard 10-round games)
- No pirate abilities tracking (special powers from expansion)

Note: While we don't track cards, we do provide an interactive bonus calculator UI where players can easily tally their bonus points using visual counters for each bonus type (including expansion bonuses like 7s, 8s, First Mate Con, and Davy Jones sea monsters).

## Development Guidelines

- TODO.md is a source of tasks to be done. When commanded, take tasks from there, ask for permission before committing
  and tag them as DONE.
- Always refer to README.md for current deployment procedures
- Use `/project:push_staging` and `/project:push_prod` commands for deployments
- Run `npm test` and `npm run build` before any deployments
- Build outputs to `build/runFiles/` - never commit this directory
- Maintain pirate theme consistency in all UI changes
- Test thoroughly on mobile devices before deploying
- Always ask me before committing or pushing
- Please do not commit and push to staging unless I say so
- Build after you make code changes