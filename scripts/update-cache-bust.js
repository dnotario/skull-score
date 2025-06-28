const fs = require('fs');
const path = require('path');

// Generate version string from current timestamp
const version = new Date().toISOString().replace(/[-:]/g, '').replace('T', '').split('.')[0];

// Read index.html
const indexPath = path.join(__dirname, '..', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Update CSS version
indexContent = indexContent.replace(
    /href="styles\.css(\?v=\d+)?"/g,
    `href="styles.css?v=${version}"`
);

// Update JS version
indexContent = indexContent.replace(
    /src="game\.js(\?v=\d+)?"/g,
    `src="game.js?v=${version}"`
);

// Write back
fs.writeFileSync(indexPath, indexContent);

console.log(`Cache bust version updated to: ${version}`);