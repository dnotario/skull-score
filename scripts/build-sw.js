#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Generate timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

// Read template
const templatePath = path.join(__dirname, '..', 'sw.template.js');
const template = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders
const serviceWorker = template.replace(/{{BUILD_TIMESTAMP}}/g, timestamp);

// Write to sw.js
const outputPath = path.join(__dirname, '..', 'sw.js');
fs.writeFileSync(outputPath, serviceWorker, 'utf8');

// Also write to build directory if it exists
const buildOutputPath = path.join(__dirname, '..', 'build', 'runFiles', 'sw.js');
if (fs.existsSync(path.dirname(buildOutputPath))) {
  fs.writeFileSync(buildOutputPath, serviceWorker, 'utf8');
}

console.log(`Service worker generated with timestamp: ${timestamp}`);