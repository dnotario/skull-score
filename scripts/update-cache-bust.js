const fs = require('fs');
const path = require('path');

// Generate version string from current timestamp
const version = new Date().toISOString().replace(/[-:]/g, '').replace('T', '').split('.')[0];

// Read index.html from build directory
const buildIndexPath = path.join(__dirname, '..', 'build', 'runFiles', 'index.html');

// Check if build file exists
if (fs.existsSync(buildIndexPath)) {
    let indexContent = fs.readFileSync(buildIndexPath, 'utf8');
    
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
    
    // Write back to build directory only
    fs.writeFileSync(buildIndexPath, indexContent);
    
    console.log(`Cache bust version updated in build artifact to: ${version}`);
} else {
    console.error('Build file not found. Make sure build:copy runs before build:cache-bust');
}