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
    const updateGolden = process.env.UPDATE_GOLDEN === 'true';
    
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
          `   Run with UPDATE_GOLDEN=true to create it.`
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
          `   Diff image saved to: visual-tests/diffs/${imageName}\n` +
          `   Current image saved to: visual-tests/current/${imageName}\n` +
          `   \n` +
          `   To approve this change, run:\n` +
          `   UPDATE_GOLDEN=true npm test -- --testNamePattern="${imageName}"`
      };
    }
  }
});

export {};