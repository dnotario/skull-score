/**
 * Screenshot capture and comparison helpers
 */

import { Browser, BrowserContext, Page } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Device } from './devices';
import { Scenario } from './scenarios';
import { clearState } from './actions';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Paths for visual test artifacts
const BUILD_DIR = path.join(__dirname, '../../../build/visual-tests');
const GOLDEN_DIR = path.join(__dirname, '../goldens');
const CURRENT_DIR = path.join(BUILD_DIR, 'current');
const DIFFS_DIR = path.join(BUILD_DIR, 'diffs');

// Base URL from environment or default
const BASE_URL = process.env.VISUAL_BASE_URL || 'http://localhost:8080';

/**
 * Ensure all necessary directories exist
 */
async function ensureDirectories() {
  for (const dir of [GOLDEN_DIR, CURRENT_DIR, DIFFS_DIR]) {
    await mkdir(dir, { recursive: true });
  }
}

/**
 * Capture a screenshot for a device/scenario combination
 */
export async function captureScreenshot(
  browser: Browser, 
  device: Device, 
  scenario: Scenario
): Promise<Buffer> {
  const timings: Record<string, number> = {};
  const startTime = Date.now();
  
  let context: BrowserContext | null = null;
  let page: Page | null = null;
  
  try {
    // Create browser context with device settings
    const contextStart = Date.now();
    context = await browser.newContext({
      viewport: device.viewport,
      deviceScaleFactor: device.deviceScaleFactor,
      isMobile: device.isMobile,
      hasTouch: device.hasTouch,
      userAgent: device.userAgent
    });
    
    page = await context.newPage();
    timings.context = Date.now() - contextStart;
    
    // Mock Math.random for deterministic output in tests
    // MUST be done before navigation to ensure all scripts use the mock
    await page.addInitScript(() => {
      // Simple linear congruential generator for deterministic "random" numbers
      let seed = 12345;
      let callCount = 0;
      
      Math.random = () => {
        callCount++;
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };
      
      // Also override any use of crypto.getRandomValues if it exists
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues = (array: any) => {
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
          }
          return array;
        };
      }
    });
    
    // Add CSS to disable all transitions and animations for faster tests
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          transition: none !important;
          animation: none !important;
          animation-duration: 0s !important;
          transition-duration: 0s !important;
          scroll-behavior: auto !important;
        }
      `
    });
    
    // Clear storage before navigating
    await context.clearCookies();
    await context.clearPermissions();
    
    // Navigate to base URL
    const navStart = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    timings.navigation = Date.now() - navStart;
    
    // Execute scenario steps
    const execStart = Date.now();
    await scenario.execute(page);
    timings.execution = Date.now() - execStart;
    
    // Wait 250ms before taking screenshot to ensure stable rendering
    await page.waitForTimeout(250);
    
    // Capture screenshot immediately - animations are already disabled
    const screenshotStart = Date.now();
    const screenshot = await page.screenshot({
      fullPage: false,
      animations: 'disabled'
    });
    timings.screenshot = Date.now() - screenshotStart;
    
    // Save to current directory for debugging
    const saveStart = Date.now();
    await ensureDirectories();
    const currentPath = path.join(CURRENT_DIR, `${device.name}_${scenario.name}.png`);
    await writeFile(currentPath, screenshot);
    timings.save = Date.now() - saveStart;
    
    // Log timing breakdown for game_complete scenario (only in debug mode)
    if (scenario.name === 'game_complete' && process.env.DEBUG_TIMING) {
      console.log('\n📊 Timing breakdown for game_complete:');
      console.log(`  Context creation: ${timings.context}ms`);
      console.log(`  Navigation: ${timings.navigation}ms`);
      console.log(`  Scenario execution: ${timings.execution}ms`);
      console.log(`  Screenshot capture: ${timings.screenshot}ms`);
      console.log(`  Save to disk: ${timings.save}ms`);
      console.log(`  Total: ${Date.now() - startTime}ms\n`);
    }
    
    return screenshot;
    
  } finally {
    if (context) {
      await context.close();
    }
  }
}

/**
 * Compare two images with zero tolerance (perfect match)
 */
export async function compareImages(
  currentBuffer: Buffer,
  goldenPath: string
): Promise<{ match: boolean; diffPixels: number; totalPixels: number }> {
  try {
    const goldenBuffer = await readFile(goldenPath);
    
    const currentPng = PNG.sync.read(currentBuffer);
    const goldenPng = PNG.sync.read(goldenBuffer);
    
    // Check dimensions
    if (currentPng.width !== goldenPng.width || currentPng.height !== goldenPng.height) {
      return {
        match: false,
        diffPixels: currentPng.width * currentPng.height,
        totalPixels: currentPng.width * currentPng.height
      };
    }
    
    // Create diff image
    const diffPng = new PNG({ width: goldenPng.width, height: goldenPng.height });
    
    // Compare with zero threshold (perfect match)
    const diffPixels = pixelmatch(
      goldenPng.data,
      currentPng.data,
      diffPng.data,
      goldenPng.width,
      goldenPng.height,
      { threshold: 0, includeAA: false } // Zero tolerance
    );
    
    const totalPixels = goldenPng.width * goldenPng.height;
    
    // Save diff image if there are differences
    if (diffPixels > 0) {
      const imageName = path.basename(goldenPath);
      const diffPath = path.join(DIFFS_DIR, imageName);
      const diffBuffer = PNG.sync.write(diffPng);
      await writeFile(diffPath, diffBuffer);
    }
    
    return {
      match: diffPixels === 0, // Perfect match required
      diffPixels,
      totalPixels
    };
    
  } catch (error) {
    // Golden image doesn't exist
    return { match: false, diffPixels: -1, totalPixels: -1 };
  }
}

/**
 * Update or create golden image
 */
export async function updateGoldenImage(
  buffer: Buffer,
  imageName: string
): Promise<void> {
  await ensureDirectories();
  const goldenPath = path.join(GOLDEN_DIR, imageName);
  await writeFile(goldenPath, buffer);
}

/**
 * Get the path for a golden image
 */
export function getGoldenPath(imageName: string): string {
  return path.join(GOLDEN_DIR, imageName);
}

/**
 * Check if golden image exists
 */
export async function goldenImageExists(imageName: string): Promise<boolean> {
  try {
    await readFile(path.join(GOLDEN_DIR, imageName));
    return true;
  } catch {
    return false;
  }
}