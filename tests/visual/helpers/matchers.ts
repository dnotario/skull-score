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
    // Check for update flag in globals (from command line) or environment (legacy)
    const updateGolden = (global as any).UPDATE_GOLDEN === true || process.env.UPDATE_GOLDEN === 'true';
    
    // Check if golden image exists
    const goldenExists = await goldenImageExists(imageName);
    
    // If UPDATE_GOLDEN is set, update the golden image
    if (updateGolden) {
      await updateGoldenImage(received, imageName);
      
      return {
        pass: true,
        message: () => goldenExists 
          ? `✅ Updated golden image: ${imageName}`
          : `✅ Created new golden image: ${imageName}`
      };
    }
    
    // If golden doesn't exist and we're not updating, fail the test
    if (!goldenExists) {
      return {
        pass: false,
        message: () => 
          `❌ Golden image does not exist: ${imageName}\n` +
          `   Run with --update-golden to create it.`
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
          `   To approve this change, run:\n` +
          `   npm run test:visual --update-golden -t "${imageName}"`
      };
    }
  }
});

export {};