# Skull King Score Keeper - Development Notes

This is a complete HTML+TypeScript-based scored website for the Skull King card game. The project has evolved into a full-featured application with professional deployment workflows.

## Current Structure

The application is fully implemented and deployed across multiple environments:
- **Production**: https://www.skullkingscorekeeper.com
- **Staging**: https://dnotario.github.io/skull-score-staging

## Key Features Implemented

✅ **Core Game Functionality**
- Single-page pirate-themed application with authentic Republic of Pirates aesthetic
- Local storage for state persistence (no server backend)
- 2-8 player support with custom names
- Complete 10-round score tracking with bid/actual/bonus input
- Real-time score calculation and validation
- Round editing and deletion capabilities
- Mobile-responsive design optimized for phones

✅ **Advanced Features**
- Intelligent pirate commentary system with 100+ unique variants
- Audio score readouts with text-to-speech integration
- Comprehensive input validation and error handling
- Game state management with optional player name retention
- Animated UI elements (bobbing parrot, glowing borders)

✅ **Technical Implementation**
- TypeScript with proper type safety and interfaces
- Jest testing framework with comprehensive test coverage
- Professional deployment pipeline with staging/production branches
- Pre-commit hooks and automated builds
- Google Analytics integration

## Project Architecture

See **README.md** for complete technical details including:
- Deployment workflow and branch strategy
- Development setup and testing procedures
- Feature specifications and game rules
- Mobile optimization and browser support
- Code quality standards and contribution guidelines

## Development Guidelines

- Always refer to README.md for current deployment procedures
- Use `/project:push_staging` and `/project:push_prod` commands for deployments
- Run `npm test` and `npm run build` before any deployments
- Maintain pirate theme consistency in all UI changes
- Test thoroughly on mobile devices before deploying
- Always ask me before committing or pushing
- Please do not commit and push to staging unless I say so