#!/usr/bin/env node
/**
 * Run visual tests with automatic dev server management
 */

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

// Parse command line arguments
const args = process.argv.slice(2);
let updateGolden = false;
const filteredArgs = [];

// Process arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--update-golden' || args[i] === '-u') {
    updateGolden = true;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
${colors.bright}Visual Test Runner - Skull King Score Keeper${colors.reset}

Usage: npm run test:visual [options]

Options:
  -t, --testNamePattern <pattern>  Run tests matching the pattern
  --update-golden, -u              Update golden images instead of comparing
  --help, -h                       Show this help message
  
  Additional Jest options are passed through

Examples:
  npm run test:visual -t landing_page
  npm run test:visual -t "game_round"              # Runs all game_round scenarios
  npm run test:visual --update-golden -t game_round_1
`);
    process.exit(0);
  } else {
    // Keep other arguments to pass to Jest
    filteredArgs.push(args[i]);
  }
}

console.log(`\n${colors.bright}${colors.blue}🏴‍☠️ Visual Test Runner - Skull King Score Keeper${colors.reset}`);
console.log('=' .repeat(50));

// Show mode
if (updateGolden) {
  console.log(`${colors.yellow}📸 Mode: UPDATE GOLDEN IMAGES${colors.reset}`);
} else {
  console.log(`${colors.green}🔍 Mode: COMPARE WITH GOLDEN IMAGES${colors.reset}`);
}

function checkServerRunning(callback) {
  http.get('http://localhost:8080', (res) => {
    callback(true);
  }).on('error', () => {
    callback(false);
  });
}

console.log(`\n${colors.bright}Checking for development server...${colors.reset}`);

checkServerRunning((isRunning) => {
  if (isRunning) {
    console.log(`${colors.red}❌ Port 8080 is already in use!${colors.reset}`);
    console.log(`\nPlease shut down the existing server and try again.`);
    console.log(`You can stop it by finding the process:`);
    console.log(`  ${colors.bright}ps aux | grep "python.*dev-server"${colors.reset}`);
    console.log(`  ${colors.bright}pkill -f "python.*dev-server"${colors.reset}\n`);
    process.exit(1);
  }

  console.log(`${colors.bright}Starting development server...${colors.reset}`);
  
  // Start the dev server without opening browser
  const serverPath = path.join(__dirname, 'dev-server.py');
  const server = spawn('python3', [serverPath, '--no-browser'], {
    stdio: 'inherit',  // Show server output directly
    detached: false,
    cwd: path.join(__dirname, '..')
  });

  server.on('error', (error) => {
    console.error(`${colors.red}❌ Failed to start dev server:${colors.reset}`, error.message);
    process.exit(1);
  });

  // Wait 2 seconds for server to start
  console.log(`${colors.yellow}Waiting for server to initialize...${colors.reset}`);
  
  setTimeout(() => {
    // Double-check server is running
    checkServerRunning((isNowRunning) => {
      if (!isNowRunning) {
        console.error(`${colors.red}❌ Server failed to start${colors.reset}`);
        server.kill();
        process.exit(1);
      }

      console.log(`${colors.green}✓ Development server ready at http://localhost:8080${colors.reset}`);
      console.log(`\n${colors.bright}Running visual tests...${colors.reset}\n`);
      
      // Run Jest visual tests
      const jestArgs = ['--selectProjects', 'visual'];
      
      // Add update golden flag as a Jest global if requested
      if (updateGolden) {
        jestArgs.push('--globals', JSON.stringify({ UPDATE_GOLDEN: true }));
      }
      
      jestArgs.push(...filteredArgs);
      
      const jest = spawn('npx', ['jest', ...jestArgs], {
        stdio: 'inherit',
        env: { ...process.env }
      });
      
      jest.on('close', (code) => {
        console.log(`\n${colors.bright}Shutting down development server...${colors.reset}`);
        server.kill('SIGTERM');
        
        // Give server time to shut down
        setTimeout(() => {
          process.exit(code);
        }, 500);
      });
    });
  }, 2000);

  // Handle script termination
  process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}Interrupted - shutting down...${colors.reset}`);
    server.kill('SIGTERM');
    setTimeout(() => process.exit(0), 500);
  });

  process.on('SIGTERM', () => {
    server.kill('SIGTERM');
    setTimeout(() => process.exit(0), 500);
  });
});