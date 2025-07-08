#!/usr/bin/env node
/**
 * Opens the visual diff viewer for a failed test
 */

const { spawn } = require('child_process');

// Forward all arguments to the HTML generator
const args = process.argv.slice(2);

const generator = spawn('node', [__dirname + '/generate-visual-diff.js', ...args], {
  stdio: 'inherit'
});