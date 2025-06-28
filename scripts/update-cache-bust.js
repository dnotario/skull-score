const fs = require('fs');
const path = require('path');

// Generate version string from current timestamp
const version = new Date().toISOString().replace(/[-:]/g, '').replace('T', '').split('.')[0];

// Read index.html from build directory
const buildIndexPath = path.join(__dirname, '..', 'build', 'runFiles', 'index.html');

// Check if build file exists
if (fs.existsSync(buildIndexPath)) {
    let indexContent = fs.readFileSync(buildIndexPath, 'utf8');
    
    // Replace {{BUILD_TIMESTAMP}} placeholder with version
    indexContent = indexContent.replace(/{{BUILD_TIMESTAMP}}/g, version);
    
    // Write back to build directory only
    fs.writeFileSync(buildIndexPath, indexContent);
    
    console.log(`Cache bust version updated in build artifact to: ${version}`);
} else {
    console.error('Build file not found. Make sure build:copy runs before build:cache-bust');
}

// Update service worker timestamp
const swPath = path.join(__dirname, '..', 'build', 'runFiles', 'sw.js');
if (fs.existsSync(swPath)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let swContent = fs.readFileSync(swPath, 'utf8');
    
    // Replace timestamp placeholders
    swContent = swContent.replace(/{{BUILD_TIMESTAMP}}/g, timestamp);
    
    // Write back to build directory
    fs.writeFileSync(swPath, swContent);
    
    console.log(`Service worker timestamp updated to: ${timestamp}`);
}