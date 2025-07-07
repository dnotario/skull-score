/**
 * Jest custom matchers for visual regression testing
 */

import { compareImages, updateGoldenImage, goldenImageExists, getGoldenPath } from './screenshot';

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchVisualSnapshot(imageName: string): R;
    }
  }
}

expect.extend({
  async toMatchVisualSnapshot(
    received: Buffer,
    imageName: string
  ): Promise<jest.CustomMatcherResult> {
    const goldenPath = getGoldenPath(imageName);
    
    // Check if golden image exists
    const goldenExists = await goldenImageExists(imageName);
    
    // If golden doesn't exist, fail the test
    if (!goldenExists) {
      return {
        pass: false,
        message: () => 
          `❌ Golden image does not exist: ${imageName}\n` +
          `   To create it, run:\n` +
          `   cp build/visual-tests/current/${imageName} tests/visual/goldens/${imageName}`
      };
    }
    
    // Compare images with perfect match requirement
    const { match, diffPixels, totalPixels } = await compareImages(received, goldenPath);
    
    if (match) {
      return {
        pass: true,
        message: () => `✅ Visual snapshot matches perfectly: ${imageName}`
      };
    } else {
      const percentage = ((diffPixels / totalPixels) * 100).toFixed(4);
      
      return {
        pass: false,
        message: () => 
          `❌ Visual snapshot does not match: ${imageName}\n` +
          `   Pixels different: ${diffPixels} of ${totalPixels} (${percentage}%)\n` +
          `   Diff image saved to: build/visual-tests/diffs/${imageName}\n` +
          `   Current image saved to: build/visual-tests/current/${imageName}\n` +
          `   \n` +
          `   To view the differences:\n` +
          `   node scripts/open-visual-diff.js ${imageName} ${diffPixels} ${totalPixels}\n` +
          `   \n` +
          `   To approve this change, run:\n` +
          `   cp build/visual-tests/current/${imageName} tests/visual/goldens/${imageName}`
      };
    }
  }
});

export {};