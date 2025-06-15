# ⚓ Skull King Score Keeper ☠️

A pirate-themed web application for tracking scores in the Skull King card game, complete with snarky commentary and authentic nautical atmosphere.

## 🎮 Features

### Core Functionality
- **Score Tracking**: Keep track of player scores across all 10 rounds
- **Round Management**: Input bids, actual tricks won, and bonus points for each player
- **Score Calculation**: Automatic scoring based on Skull King rules
- **Data Persistence**: Game state saved to local storage
- **Mobile Responsive**: Optimized for both desktop and mobile play

### Pirate Experience
- **Authentic Theme**: Complete pirate aesthetic with parchment backgrounds and nautical styling
- **Intelligent Commentary System**: Dynamic pirate commentary with 100+ unique variants that analyzes gameplay
- **Audio Score Readouts**: Built-in text-to-speech announces current scores with a "Read Scores" button
- **Animated Elements**: Bobbing parrot icon, glowing golden borders, and smooth transitions

### Game Management
- **Player Setup**: Add 2-8 players with custom names
- **Round Validation**: Input validation with helpful error messages
- **Score History**: View all previous rounds with detailed breakdowns
- **New Game Options**: Start fresh while optionally keeping player names
- **Round Deletion**: Remove the last round if needed

## 🚀 Getting Started

### Quick Start
1. Visit the live site: 
   - **Production**: [skull-score-deploy.github.io](https://dnotario.github.io/skull-score-deploy)
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

# Build TypeScript
npm run build

# Serve locally (any static server)
python -m http.server 8000
# or
npx serve .
```

## 🚀 Deployment Workflow

This project uses a professional deployment pipeline with separate staging and production environments.

### Repository Structure
- **`skull-score`** (main): Development repository with source code, tests, and workflows
- **`skull-score-deploy`**: Production deployment repository (clean files only)
- **`skull-score-staging`**: Staging deployment repository (clean files only)

### Branch Strategy
- **`main`** → Production deployment → `www.skullkingscorekeeper.com`
- **`staging`** → Staging deployment → `dnotario.github.io/skull-score-staging`

### Development Workflow

#### 1. Feature Development
```bash
# Create feature branch from staging
git checkout staging
git pull origin staging
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

#### 2. Deploy to Staging
```bash
# Merge feature to staging branch
git checkout staging
git merge feature/your-feature-name
git push origin staging

# 🚀 This automatically triggers deployment to staging!
# View at: https://dnotario.github.io/skull-score-staging/
```

#### 3. Deploy to Production
```bash
# After testing staging, merge to main
git checkout main
git merge staging
git push origin main

# 🚀 This automatically triggers deployment to production!
# View at: https://www.skullkingscorekeeper.com
```

### Automated Deployment

- **Tests Required**: All tests must pass before deployment
- **Clean Deployment**: Only `index.html`, `game.js`, `styles.css` are deployed
- **No Dev Files**: Tests, configs, and source files stay in development repo
- **Custom Domain**: Production automatically includes CNAME for custom domain

### Monitoring Deployments

```bash
# Check deployment status
gh run list --repo dnotario/skull-score

# View deployment repositories
gh repo view dnotario/skull-score-deploy
gh repo view dnotario/skull-score-staging
```

## 🎯 How to Play Skull King

Skull King is a trick-taking game where players bid on how many tricks they'll win each round.

### Basic Rules
1. **Rounds**: 10 rounds, with tricks increasing from 1 to 10
2. **Bidding**: Players predict how many tricks they'll win
3. **Scoring**: 
   - Correct bid: 20 + (10 × bid) points
   - Incorrect bid: -10 × bid points
   - Zero bid: 10 × round number (if successful)
4. **Bonus Points**: Earned for special cards and achievements

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
- **Testing**: Jest with comprehensive unit tests
- **Build**: TypeScript compiler with automated builds
- **Analytics**: Google Analytics 4 integration

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