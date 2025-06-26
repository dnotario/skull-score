# Development Tools

This directory contains development tools for testing and previewing the Skull King Score Keeper app.

## 🚀 Quick Start

### 1. Development Server
Start a local server with automatic browser opening:
```bash
python scripts/dev-server.py
```
- Opens at http://localhost:8080
- Shows network URL for mobile testing
- No caching for easy development

### 2. Device Preview (Recommended)
View the app on multiple mobile device sizes simultaneously:
```bash
# Start the dev server first
python scripts/dev-server.py

# Then open the device preview in another terminal or browser
# Navigate to: http://localhost:8080/scripts/device-preview.html
```

Features:
- Live preview on iPhone 12, iPhone SE, and Pixel 5 screens
- "Show Bonus Popup" button to test the popup on all devices at once
- Refresh button to reload all frames

### 3. Automated Screenshots
Capture screenshots of the bonus popup on different devices:
```bash
# Make sure dev server is running first
python scripts/mobile-preview.py
```
- Requires playwright (auto-installs if needed)
- Saves screenshots to `scripts/screenshots/`
- Captures full view and modal-only shots

## 📱 Testing the Compact Bonus Popup

The bonus popup has been optimized for mobile with:
- Smaller padding and margins (1rem → 0.5rem)
- Compact font sizes (1.8rem → 1.25rem for headers)
- Smaller buttons (32px → 24px)
- Reduced spacing between elements
- Optimized for 375px+ width screens

To test:
1. Start the dev server
2. Open device preview or use your phone
3. Start a game and enter bid/actual values
4. Click the calculator button to see the compact popup