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
const VISUAL_TESTS_DIR = path.join(__dirname, '../../../visual-tests');
const GOLDEN_DIR = path.join(__dirname, '../goldens');
const CURRENT_DIR = path.join(VISUAL_TESTS_DIR, 'current');
const DIFFS_DIR = path.join(VISUAL_TESTS_DIR, 'diffs');

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
  let context: BrowserContext | null = null;
  let page: Page | null = null;
  
  try {
    // Create browser context with device settings
    context = await browser.newContext({
      viewport: device.viewport,
      deviceScaleFactor: device.deviceScaleFactor,
      isMobile: device.isMobile,
      hasTouch: device.hasTouch,
      userAgent: device.userAgent
    });
    
    page = await context.newPage();
    
    // Clear storage before navigating
    await context.clearCookies();
    await context.clearPermissions();
    
    // Navigate to base URL
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    
    // Execute scenario steps
    await scenario.execute(page);
    
    // Wait a short time for any final animations
    await page.waitForTimeout(200);
    
    // Capture screenshot
    const screenshot = await page.screenshot({
      fullPage: false,
      animations: 'disabled'
    });
    
    // Save to current directory for debugging
    await ensureDirectories();
    const currentPath = path.join(CURRENT_DIR, `${device.name}_${scenario.name}.png`);
    await writeFile(currentPath, screenshot);
    
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