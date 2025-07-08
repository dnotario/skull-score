#!/usr/bin/env node
/**
 * Generates a static HTML file to view visual test differences
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Visual Diff HTML Generator

Usage: 
  node scripts/generate-visual-diff.js <image-name> [pixels] [total]
  
  image-name: The name of the failed test image (e.g., iPhone_SE_game_complete.png)
  pixels:     Number of pixels different (optional)
  total:      Total number of pixels (optional)

This generates a static HTML file in build/visual-tests/diff-<image-name>.html

Examples:
  node scripts/generate-visual-diff.js iPhone_SE_game_complete.png
  node scripts/generate-visual-diff.js iPhone_SE_game_complete.png 874873 1000500
`);
  process.exit(0);
}

const imageName = args[0];
const pixels = args[1] || '';
const total = args[2] || '';

// Calculate relative paths from build/visual-tests/ to the images
const goldenPath = `../../tests/visual/goldens/${imageName}`;
const currentPath = `current/${imageName}`;
const diffPath = `diffs/${imageName}`;

// Generate pixel info if available
let pixelInfo = '';
if (pixels && total) {
  const percentage = ((parseInt(pixels) / parseInt(total)) * 100).toFixed(2);
  pixelInfo = `<div class="pixel-info">Pixels different: ${pixels} of ${total} (${percentage}%)</div>`;
}

// Generate the HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Diff: ${imageName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
        }
        .pixel-info {
            text-align: center;
            color: #d73a49;
            font-size: 18px;
            margin-bottom: 30px;
            font-weight: 500;
        }
        .container {
            max-width: 1800px;
            margin: 0 auto;
        }
        .images {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 20px;
        }
        .image-box {
            background: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .image-box h3 {
            margin: 0 0 15px 0;
            text-align: center;
            font-size: 18px;
        }
        .image-box.golden h3 { color: #b08d57; }
        .image-box.current h3 { color: #0366d6; }
        .image-box.diff h3 { color: #d73a49; }
        .image-box img {
            width: 100%;
            height: auto;
            border: 1px solid #e1e4e8;
            display: block;
            background: white;
        }
        .image-link {
            display: block;
            text-align: center;
            margin-top: 10px;
            color: #0366d6;
            text-decoration: none;
            font-size: 14px;
        }
        .image-link:hover {
            text-decoration: underline;
        }
        .info {
            background: #f6f8fa;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            padding: 16px;
            margin: 20px 0;
        }
        .info h4 {
            margin: 0 0 8px 0;
            color: #24292e;
        }
        .info p {
            margin: 4px 0;
            color: #586069;
            font-size: 14px;
        }
        .timestamp {
            text-align: center;
            color: #586069;
            font-size: 12px;
            margin-top: 20px;
        }
        @media (max-width: 1200px) {
            .images { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <h1>Visual Test Diff: ${imageName}</h1>
    ${pixelInfo}
    
    <div class="container">
        <div class="images">
            <div class="image-box golden">
                <h3>✓ Golden (Expected)</h3>
                <img src="${goldenPath}" alt="Golden image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg=='">
                <a href="${goldenPath}" class="image-link" target="_blank">Open in new tab</a>
            </div>
            <div class="image-box current">
                <h3>⚡ Current (Actual)</h3>
                <img src="${currentPath}" alt="Current image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg=='">
                <a href="${currentPath}" class="image-link" target="_blank">Open in new tab</a>
            </div>
            <div class="image-box diff">
                <h3>❌ Difference</h3>
                <img src="${diffPath}" alt="Diff image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg=='">
                <a href="${diffPath}" class="image-link" target="_blank">Open in new tab</a>
            </div>
        </div>
        
        <div class="info">
            <h4>How to read this diff:</h4>
            <p>• <strong>Golden:</strong> The expected image from tests/visual/goldens/</p>
            <p>• <strong>Current:</strong> What the test captured during this run</p>
            <p>• <strong>Difference:</strong> Red pixels show where the images differ</p>
            <p style="margin-top: 12px;">To approve this change, run: <code style="background: #f6f8fa; padding: 2px 6px; border-radius: 3px;">cp build/visual-tests/current/${imageName} tests/visual/goldens/${imageName}</code></p>
        </div>
        
        <div class="timestamp">Generated: ${new Date().toLocaleString()}</div>
    </div>
</body>
</html>`;

// Write the HTML file
const outputDir = path.join(__dirname, '..', 'build', 'visual-tests');
const outputFile = path.join(outputDir, `diff-${imageName}.html`);

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, html);

console.log(`\n✅ Visual diff HTML generated: ${outputFile}`);
console.log(`\nOpen in browser:`);
console.log(`  open ${outputFile}  # macOS`);
console.log(`  start ${outputFile} # Windows`);
console.log(`  xdg-open ${outputFile} # Linux\n`);

// Open in browser
const { spawn } = require('child_process');
const platform = process.platform;

let command;
if (platform === 'darwin') {
  command = 'open';
} else if (platform === 'win32') {
  command = 'start';
} else {
  command = 'xdg-open';
}

spawn(command, [outputFile], { 
  shell: true,
  detached: true,
  stdio: 'ignore'
}).unref();