# Visual Testing with Jest

This directory contains visual regression tests for the Skull King Score Keeper app, fully integrated with Jest.

## Architecture

```
tests/visual/
├── visual.test.ts      # Main Jest test file
└── helpers/
    ├── actions.ts      # Page actions (setupGame, fillRound, etc.)
    ├── devices.ts      # Device configurations
    ├── scenarios.ts    # Test scenario definitions  
    ├── screenshot.ts   # Screenshot capture and comparison
    └── matchers.ts     # Jest custom matchers
```

## Current Status

### Working Scenarios (12 tests)
These scenarios have golden images and pass consistently:
- `landing_page` - Home page with game description
- `player_setup_empty` - New game screen with empty inputs
- `player_setup_filled` - Player setup with 4 players (no names)
- `scoring_mode_rascal` - Player setup with Rascal mode selected

### Scenarios with Issues
These scenarios involve form input and gameplay, which have timing issues:
- `player_setup_8_players` - Maximum players
- `game_round_*` - Gameplay scenarios
- `bonus_calculator_*` - Bonus calculation modals
- `error_modal` - Error handling
- `new_game_modal` - Confirmation dialogs

### Known Limitations
1. **Form Input Issues**: Playwright's `page.fill()` method sometimes hangs when trying to fill inputs in the game
2. **Dev Server**: Automatically opens browser (disabled with --no-browser flag)
3. **Parallel Execution**: Tests run in parallel with isolated contexts (no shared localStorage)

## Quick Start

```bash
# Run all tests (unit + visual)
npm test

# Run only visual tests (automatically starts dev server)
npm run test:visual

# Golden images are updated manually using cp commands
# (shown in test failure messages)
```

**Note**: The visual test commands automatically start and stop the development server. You'll see clear messages about server startup before tests run.

## Perfect Pixel Matching

This visual test system uses **zero-tolerance image comparison**:
- ANY pixel difference = test failure
- No thresholds or percentages
- Explicit approval required for all changes

## Workflow

### 1. Normal Development

```bash
# Make your changes
# Run visual tests
npm run test:visual
```

### 2. When Tests Fail

If visual tests fail, you'll see:
- ❌ Visual snapshot does not match
- Number of pixels different
- Diff image location: `visual-tests/diffs/`
- Current image location: `visual-tests/current/`

### 3. Review Changes

1. Check the diff images in `visual-tests/diffs/`
2. Compare with golden images in `visual-tests/golden/`
3. Decide if changes are intentional

### 4. Approve Changes

If changes are intentional, the test output will show the exact `cp` command to run:

```bash
# Example from test output:
cp build/visual-tests/current/iPhone_SE_game_complete.png tests/visual/goldens/iPhone_SE_game_complete.png
```

This directly copies the current test output to become the new golden image.

## Running Specific Tests

Visual tests use Jest's standard test filtering options:

```bash
# Run tests matching pattern
npm run test:visual -- -t landing_page
npm run test:visual -- -t "game_round"  # Runs all game_round scenarios
npm run test:visual -- -t "iPhone"      # Runs all iPhone device tests

# Run tests on specific devices
npm run test:visual -- -d iPhone_SE -t game_complete
npm run test:visual -- -d "iPhone_SE,Desktop_HD" -t game_complete

# Run in watch mode
npm run test:watch -- --selectProjects visual

# Note: The --update-golden flag is planned but not yet implemented
# To update golden images, use the cp command shown in test failure messages
```

## Command Line Options

- `-t <pattern>` - Run tests matching the pattern (Jest's testNamePattern)
- `-d, --devices <devices>` - Run tests on specific devices (comma-separated)
- `--update-golden` - (Planned feature, not yet implemented)

Available devices: `iPhone_12_Pro`, `iPhone_SE`, `Desktop_HD`

## Environment Variables

- `VISUAL_BASE_URL` - Base URL for testing (default: http://localhost:8080)
- `VISUAL_DEVICES` - Comma-separated list of devices (can be overridden by `-d` flag)

## Adding New Tests

### 1. Add a New Device

Edit `helpers/devices.ts`:

```typescript
export const devices: Record<string, Device> = {
  // ... existing devices ...
  
  My_Device: {
    name: 'My_Device',
    viewport: { width: 400, height: 800 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  }
};
```

### 2. Add a New Scenario

Edit `helpers/scenarios.ts`:

```typescript
export const scenarios: Record<string, Scenario> = {
  // ... existing scenarios ...
  
  my_scenario: {
    name: 'my_scenario',
    description: 'Test description',
    execute: async (page: Page) => {
      await actions.setupGame(page, 4);
      // Add your test steps
    },
    tags: ['mytag']
  }
};
```

## CI/CD Integration

```yaml
# GitHub Actions example
- name: Run Tests
  run: |
    npm run build
    npm test
```

## Debugging Tips

1. **View current screenshots**: Check `visual-tests/current/`
2. **View diff images**: Check `visual-tests/diffs/`
3. **Run with headed browser**: Modify `visual.test.ts` to use `headless: false`
4. **Increase timeouts**: Tests have 30s timeout by default

## Directory Structure

- `visual-tests/golden/` - Baseline images (in version control)
- `visual-tests/current/` - Latest captured screenshots
- `visual-tests/diffs/` - Difference images when tests fail

## Benefits of Jest Integration

- **Single test command**: `npm test` runs unit tests only (visual tests separate)
- **Better IDE support**: Click to run individual tests
- **Watch mode**: Auto-rerun on changes
- **Parallel execution**: Tests run with 4 workers by default
- **Unified reporting**: Same reporters for all tests
- **Test filtering**: Use Jest's powerful filtering options
- **Isolated contexts**: Each test gets its own browser context