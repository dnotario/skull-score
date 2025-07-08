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
let devices = null;
const filteredArgs = [];

// Process arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--devices' || args[i] === '-d') {
    // Get the next argument as the device list
    if (i + 1 < args.length) {
      devices = args[++i];
    }
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
${colors.bright}Visual Test Runner - Skull King Score Keeper${colors.reset}

Usage: npm run test:visual [options]

Options:
  -t, --testNamePattern <pattern>  Run tests matching the pattern
  -d, --devices <devices>          Run tests on specific devices (comma-separated)
  --help, -h                       Show this help message
  
  Additional Jest options are passed through

Available devices:
  iPhone_12_Pro, iPhone_SE, Desktop_HD

Examples:
  npm run test:visual -t landing_page
  npm run test:visual -t "game_round"              # Runs all game_round scenarios
  npm run test:visual -d iPhone_SE -t game_complete
  npm run test:visual -d "iPhone_SE,Desktop_HD" -t game_complete
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
console.log(`${colors.green}🔍 Mode: COMPARE WITH GOLDEN IMAGES${colors.reset}`);

// Show devices if specified
if (devices) {
  console.log(`${colors.bright}📱 Devices: ${devices}${colors.reset}`);
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
    detached: process.platform !== 'win32',  // Detach on Unix for better process group handling
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
      
      jestArgs.push(...filteredArgs);
      
      // Set up environment variables
      const testEnv = { ...process.env };
      if (devices) {
        testEnv.VISUAL_DEVICES = devices;
      }
      
      const jest = spawn('npx', ['jest', ...jestArgs], {
        stdio: 'inherit',
        env: testEnv
      });
      
      jest.on('close', (code) => {
        console.log(`\n${colors.bright}Shutting down development server...${colors.reset}`);
        
        // Kill the entire process group on Unix
        if (process.platform !== 'win32') {
          try {
            process.kill(-server.pid, 'SIGTERM');
          } catch (e) {
            // Fallback to regular kill
            server.kill('SIGTERM');
          }
        } else {
          server.kill('SIGTERM');
        }
        
        // Force kill after 1 second if still running
        const forceKillTimeout = setTimeout(() => {
          try {
            if (process.platform !== 'win32') {
              process.kill(-server.pid, 'SIGKILL');
            } else {
              server.kill('SIGKILL');
            }
          } catch (e) {
            // Process already dead
          }
        }, 1000);
        
        // Check if server actually stopped
        const checkInterval = setInterval(() => {
          checkServerRunning((isRunning) => {
            if (!isRunning) {
              clearInterval(checkInterval);
              clearTimeout(forceKillTimeout);
              process.exit(code);
            }
          });
        }, 100);
        
        // Ultimate timeout - exit anyway after 2 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          clearTimeout(forceKillTimeout);
          process.exit(code);
        }, 2000);
      });
    });
  }, 2000);

  // Handle script termination
  let cleanupDone = false;
  const cleanup = (exitCode = 0) => {
    if (cleanupDone) return;
    cleanupDone = true;
    
    console.log(`\n${colors.yellow}Interrupted - shutting down...${colors.reset}`);
    
    // Kill the entire process group on Unix
    if (process.platform !== 'win32') {
      try {
        process.kill(-server.pid, 'SIGKILL'); // Use SIGKILL for immediate termination
      } catch (e) {
        // Fallback to regular kill
        server.kill('SIGKILL');
      }
    } else {
      server.kill('SIGKILL');
    }
    
    // Exit immediately if not already exiting
    if (typeof exitCode === 'number') {
      process.exit(exitCode);
    }
  };
  
  process.on('SIGINT', () => cleanup(0));
  process.on('SIGTERM', () => cleanup(0));
  process.on('exit', cleanup);
  
  // Also handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error(`${colors.red}Uncaught exception:${colors.reset}`, err);
    cleanup(1);
  });
});