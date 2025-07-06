# Visual Testing System

This directory contains the visual regression testing system for the Skull King Score Keeper app.

## Overview

The visual testing system captures screenshots of the app in different states across multiple device configurations and compares them against golden (baseline) images to detect unintended visual changes.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
python scripts/dev-server.py
```

### 3. Capture Screenshots
```bash
npm run visual:capture
```

### 4. Create Initial Golden Images
```bash
npm run visual:approve
```

### 5. Run Visual Tests
```bash
npm run visual:test
```

### 6. View Results
```bash
npm run visual:viewer
```
Then open http://localhost:8080/visual-tests/viewer.html

## Commands

- **`npm run visual:capture`** - Capture screenshots for all device/scenario combinations
- **`npm run visual:diff`** - Compare current screenshots with golden images
- **`npm run visual:test`** - Run capture and diff in sequence
- **`npm run visual:approve`** - Update all golden images with current screenshots
- **`npm run visual:approve:filter <filter>`** - Update specific golden images (e.g., `iPhone_12`)
- **`npm run visual:list`** - List all golden images
- **`npm run visual:clean`** - Remove all golden images (creates backup)
- **`npm run visual:viewer`** - Launch the visual diff viewer

## Configuration

Edit `config.json` to:
- Add new devices
- Add new test scenarios
- Adjust diff threshold
- Change other settings

### Adding a New Device

```json
{
  "name": "Samsung_Galaxy_S21",
  "viewport": { "width": 360, "height": 800 },
  "deviceScaleFactor": 3,
  "isMobile": true,
  "hasTouch": true,
  "userAgent": "Mozilla/5.0 (Linux; Android 11; Samsung Galaxy S21)..."
}
```

### Adding a New Scenario

```json
{
  "name": "custom_scenario",
  "description": "Description of what this tests",
  "steps": [
    { "action": "click", "selector": "#button-id" },
    { "action": "fill", "selector": "#input-id", "value": "test" },
    { "action": "wait", "value": 500 }
  ]
}
```

## Directory Structure

```
visual-tests/
├── config.json          # Configuration for devices and scenarios
├── golden/             # Baseline images (version controlled)
├── current/            # Latest captured screenshots
├── diffs/              # Difference images and report
├── golden-backup/      # Backups of golden images
└── viewer.html         # Interactive diff viewer
```

## Workflow

### Regular Development
1. Make your changes
2. Run `npm run visual:test` to check for visual regressions
3. If changes are intentional, run `npm run visual:approve` to update golden images
4. Commit the updated golden images

### Reviewing Changes
1. Run `npm run visual:viewer` to open the interactive viewer
2. Filter by device, scenario, or status
3. Click on any test to see detailed comparison
4. Use the slider to compare golden vs current images

### CI Integration
```bash
# In your CI pipeline
npm run visual:test || exit 1
```

## Best Practices

1. **Review Before Approving**: Always review visual changes before updating golden images
2. **Commit Golden Images**: Version control golden images to track visual changes over time
3. **Clean Captures**: Ensure animations are disabled and the page is fully loaded
4. **Consistent Environment**: Run captures in the same environment for consistency
5. **Meaningful Scenarios**: Create scenarios that test real user workflows

## Troubleshooting

### "No golden image" errors
- Run `npm run visual:approve` to create initial golden images

### Inconsistent results
- Check that the dev server is running on the correct port
- Ensure no animations or dynamic content affect captures
- Verify network requests complete before capture

### High diff percentages
- Review the diff images in the viewer
- Check for timing issues in scenario steps
- Consider increasing wait times for dynamic content

## Advanced Usage

### Custom Scenarios
You can create complex scenarios using the special actions:
- `setupGame`: Automatically set up a game with specified players
- `playRounds`: Play multiple rounds with random valid data
- `fillRound`: Fill a specific round with provided data

### Filtering Updates
Update only specific golden images:
```bash
npm run visual:approve:filter iPhone  # Update only iPhone images
npm run visual:approve:filter modal   # Update only modal scenarios
```

### Debugging
- Check `visual-tests/diffs/report.json` for detailed comparison data
- View diff images directly in `visual-tests/diffs/`
- Use the viewer's interactive slider for pixel-level comparison