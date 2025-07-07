/**
 * Visual Regression Tests using Jest
 */

import { chromium, Browser } from 'playwright';
import { devices, deviceGroups } from './helpers/devices';
import { scenarios, getAllScenarioNames, getScenariosByTags } from './helpers/scenarios';
import { captureScreenshot } from './helpers/screenshot';
import './helpers/matchers';

describe('Visual Regression Tests', () => {
  let browser: Browser;
  
  beforeAll(async () => {
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }, 30000);
  
  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  }, 30000);
  
  // Get devices and scenarios to test based on environment variables
  const selectedDevices = process.env.VISUAL_DEVICES 
    ? process.env.VISUAL_DEVICES.split(',').map(name => devices[name.trim()]).filter(Boolean)
    : deviceGroups.essential.map(name => devices[name]);
    
  const selectedScenarioNames = process.env.VISUAL_SCENARIOS
    ? process.env.VISUAL_SCENARIOS.includes(',') 
      ? process.env.VISUAL_SCENARIOS.split(',').map(s => s.trim())
      : getScenariosByTags([process.env.VISUAL_SCENARIOS]).length > 0
        ? getScenariosByTags([process.env.VISUAL_SCENARIOS])
        : [process.env.VISUAL_SCENARIOS]
    : getAllScenarioNames();
  
  const selectedScenarios = selectedScenarioNames
    .map(name => scenarios[name])
    .filter(Boolean);
  
  // Generate test cases
  selectedDevices.forEach(device => {
    describe(`Device: ${device.name}`, () => {
      selectedScenarios.forEach(scenario => {
        test(`Scenario: ${scenario.name}`, async () => {
          // Capture screenshot
          const screenshot = await captureScreenshot(browser, device, scenario);
          const imageName = `${device.name}_${scenario.name}.png`;
          
          // Compare with golden image (perfect match required)
          await expect(screenshot).toMatchVisualSnapshot(imageName);
        }, 30000); // 30 second timeout per test
      });
    });
  });
});