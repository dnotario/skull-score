# ⚓ Skull King Score Keeper ☠️

A pirate-themed web application for tracking scores in the Skull King card game, complete with snarky commentary and authentic nautical atmosphere.

## 🎮 Features

### Core Functionality
- **Score Tracking**: Keep track of player scores across all 10 rounds
- **Round Management**: Input bids, actual tricks won, and bonus points for each player
- **Scoring Modes**: Both Traditional (Classic) and Rascal scoring systems
- **Score Calculation**: Automatic scoring based on official Skull King rules
- **Data Persistence**: Game state saved to local storage
- **Mobile Responsive**: Optimized for both desktop and mobile play

### Expansion Pack Support
- **9-Player Mode**: Enable expansion pack to support up to 9 players
- **Graybeard Mode**: Automatic ghost player for 2-player games
- **Sea Monster Tracking**: Track Kraken, White Whale, and Spotted Stingray plays
- **Expansion Bonuses**: 7s (-5), 8s (+5), First Mate Con (+30), Davy Jones sea monsters (+20 each)
- **Trick Discarding**: Handle Whale/Stingray tricks with no winner
- **Dynamic Card Limits**: Automatic adjustment based on player count and expansion mode

### Pirate Experience
- **Authentic Theme**: Complete pirate aesthetic with parchment backgrounds and nautical styling
- **Intelligent Commentary System**: Dynamic pirate commentary with 100+ unique variants that analyzes gameplay
- **Audio Score Readouts**: Built-in text-to-speech announces current scores with a "Read Scores" button
- **Animated Elements**: Bobbing parrot icon, glowing golden borders, and smooth transitions

### Game Management
- **Player Setup**: Add 2-8 players with custom names (2-9 with expansion)
- **Round Validation**: Input validation with helpful error messages
- **Score History**: View all previous rounds with detailed breakdowns
- **New Game Options**: Start fresh while optionally keeping player names
- **Round Deletion**: Remove the last round if needed
- **Bonus Calculator**: Interactive popup modal for calculating complex bonus points (including expansion bonuses)

## 🚀 Getting Started

### Quick Start
1. Visit the live site: 
   - **Production**: [www.skullkingscorekeeper.com](https://www.skullkingscorekeeper.com)
   - **Staging**: [skull-score-staging.github.io](https://dnotario.github.io/skull-score-staging)
2. Click "Start New Game"
3. Add player names (2-8 players)
4. Begin entering round data!

### Local Development
```bash
# Clone the repository
git clone https://github.com/dnotario/skull-score.git

# Navigate to the project
cd skull-score

# Install dependencies
npm install

# Run tests
npm test

# Build TypeScript (outputs to build/runFiles/)
npm run build

# Serve locally from build directory
cd build/runFiles && python -m http.server 8000
# or
npx serve build/runFiles
```

## 🚀 Deployment Workflow

This project uses a professional deployment pipeline with separate staging and production environments.

### Repository Structure
- **`skull-score`** (main): Development repository with source code, tests, and workflows
- **`skull-score-prod`**: Production deployment repository (clean files only)
- **`skull-score-staging`**: Staging deployment repository (clean files only)

### Branch Strategy
- **`main`** → Active development (no auto-deploy)
- **`staging`** → Staging deployment → `dnotario.github.io/skull-score-staging`
- **`prod`** → Production deployment → `www.skullkingscorekeeper.com`

### Development Workflow

#### 1. Feature Development
```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Develop your feature
# ... make changes ...
npm test  # Ensure tests pass
npm run build  # Ensure build works

# Commit changes
git add .
git commit -m "Add your feature description"
git push origin feature/your-feature-name
```

#### 2. Merge to Main
```bash
# Merge feature to main branch
git checkout main
git merge feature/your-feature-name
git push origin main

# No deployment happens - main is for development only
```

#### 3. Deploy to Staging
```bash
# IMPORTANT: Always merge from main to staging
git checkout staging
git merge main
git push origin staging

# 🚀 This automatically triggers deployment to staging!
# View at: https://dnotario.github.io/skull-score-staging/
```

#### 4. Deploy to Production
```bash
# After testing staging, merge to prod branch
git checkout prod
git merge staging
git push origin prod

# 🚀 This automatically triggers deployment to production!
# View at: https://www.skullkingscorekeeper.com
```

### Automated Deployment

- **Tests Required**: All tests must pass before deployment
- **Clean Deployment**: Only `index.html`, `game.js`, `styles.css` are deployed
- **No Dev Files**: Tests, configs, and source files stay in development repo
- **Custom Domain**: Production automatically includes CNAME for custom domain
- **Safe Development**: Changes to `main` don't trigger production deployments

### Claude Code Custom Commands

For developers using [Claude Code](https://claude.ai/code), custom deployment commands are available:

```bash
# Deploy to staging
/project:push_staging

# Deploy to production  
/project:push_prod
```

These commands automatically follow the deployment workflow above and are defined in `.claude/commands/`.

### Monitoring Deployments

```bash
# Check deployment status
gh run list --repo dnotario/skull-score

# View deployment repositories
gh repo view dnotario/skull-score-prod
gh repo view dnotario/skull-score-staging
```

## 🎯 How to Play Skull King

Skull King is a trick-taking game where players bid on how many tricks they'll win each round.

### Basic Rules
1. **Rounds**: 10 rounds, with cards dealt increasing from 1 to 10
2. **Bidding**: Players predict how many tricks they'll win
3. **Scoring Modes**:
   - **Traditional (Classic)**:
     - Exact bid: 20 × tricks taken
     - Failed bid: -10 × difference
     - Zero bid successful: 10 × cards dealt
     - Zero bid failed: -10 × cards dealt
   - **Rascal Scoring**:
     - Direct hit (exact): 100% of potential points (10 × cards dealt)
     - Glancing blow (off by 1): 50% of potential points
     - Complete miss (off by 2+): 0 points
4. **Bonus Points**: Manually enter points for special cards (14s, Mermaids, Pirates, Skull King)
   - **Important**: Bonus points only count when bid = actual
   - The app validates this rule and prevents saving rounds with invalid bonuses

## 🏴‍☠️ Commentary & Audio Features

### Intelligent Commentary System
The game features a sophisticated commentary system that provides contextual pirate banter:

- **Performance-Based Analysis**: Reacts to perfect rounds, disasters, and big scores
  - *"Blimey! Every scallywag nailed their bid! The sea gods smile upon ye all!"* (perfect round)
  - *"Avast! [Player] be sinkin' faster than a ship with no hull!"* (disaster)
  - *"Pieces of eight! Multiple pirates be strikin' gold this round!"* (big scores)

- **Game State Awareness**: Comments on game progression and player standings
  - *"This be a tight race! Any one of ye bilge rats could claim the crown!"* (close game)
  - *"[Player] be dominatin' these waters while [Player] be drownin' in their own wake!"* (runaway leader)
  - *"The final rounds approach! Time to separate the captains from the cabin boys!"* (late game)

- **Strategic Commentary**: Analyzes bidding patterns and zero-bid strategies
  - *"A crafty pirate played it safe with zero bids and lived to tell the tale!"* (successful zero)
  - *"Some cowardly sea dogs tried to avoid all tricks but failed!"* (failed zero attempt)

- **Never Repetitive**: 5+ unique variants for each scenario type, totaling 100+ different comments
- **Authentic Pirate Voice**: Written in proper pirate vernacular with nautical terms

### Audio Score Readouts
- **Text-to-Speech Integration**: Built-in browser TTS announces scores
- **One-Click Accessibility**: "🔊 Read Scores" button for instant audio feedback
- **Perfect for Groups**: Great for keeping all players informed without crowding around the screen
- **Voice Selection**: Automatically selects English voice when available

## 🛠️ Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, TypeScript
- **Styling**: Custom CSS with pirate theme and animations
- **Storage**: Local Storage for game persistence
- **Testing**: Jest with comprehensive unit tests (125+ tests)
- **Build**: TypeScript compiler with automated builds to `build/runFiles/`
- **Analytics**: Google Analytics 4 integration
- **Architecture**: Pure function scoring logic for testability

### Code Quality
- **Pre-commit Hooks**: Automated testing before every commit
- **TypeScript**: Type-safe code with proper interfaces
- **Unit Tests**: Comprehensive test coverage
- **Responsive Design**: Mobile-first approach

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Android Chrome)
- Local Storage support required

## 📱 Mobile Experience

Optimized for mobile gameplay:
- Touch-friendly input fields
- Responsive grid layouts
- Readable fonts and proper spacing
- Swipe-friendly navigation
- Portrait and landscape support

## 📝 Scope & Limitations

This app is a **score keeper**, not a full digital implementation of Skull King:

### What's Included
- Complete scoring calculation for both Traditional and Rascal modes
- Full expansion pack support (9 players, Graybeard, expansion bonuses)
- Sea monster tracking (Kraken, White Whale, Spotted Stingray)
- Interactive bonus calculator with all bonus types including expansion
- Manual bonus point entry with validation
- Full round and game state management
- Input validation ensuring game rules are followed

### What's NOT Included
- Card tracking or automatic bonus calculation
- Optional scoring variants (Cannonball/Grapeshot for Rascal mode)
- Alternative round structures (only standard 10-round games)
- Pirate abilities tracking (special powers from expansion)

Players use the bonus calculator to tally points for:
- Number 14 cards (+10 for standard suits, +20 for black)
- Mermaid captures (+20 for Pirates, +40 for Skull King)
- Skull King captures (+30 for Pirates)
- Expansion bonuses: 7s (-5), 8s (+5), First Mate Con (+30), Davy Jones (+20 per sea monster)

## 🎨 Design Philosophy

**Pirate Aesthetic**: Every element designed to feel like authentic pirate treasure maps and ship logs
**Usability First**: Complex game state made simple with clear visual hierarchy
**Performance**: Lightweight and fast, works offline after first load
**Accessibility**: High contrast, readable fonts, and clear interactive elements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow existing TypeScript patterns
- Add tests for new features
- Maintain pirate theme consistency
- Test on mobile devices
- Keep commentary family-friendly but snarky

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Skull King**: Created by Brent Beck, published by Grandpa Beck's Games
- **Pirate Commentary**: Inspired by classic pirate literature and films
- **Design**: Influenced by historical nautical maps and pirate aesthetics

## 🐛 Support

Found a bug or have a feature request?
- Open an issue on GitHub
- Include browser and device information
- Provide steps to reproduce

---

*May fair winds fill your sails and your bids be ever true! ⚓*