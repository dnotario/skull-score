#!/usr/bin/env python3
"""
Mobile preview tool that captures screenshots of the bonus popup on different devices
"""
import asyncio
import os
import sys
from datetime import datetime

# Check if playwright is installed
try:
    from playwright.async_api import async_playwright
except ImportError:
    print("Installing playwright... This may take a moment.")
    os.system(f"{sys.executable} -m pip install playwright")
    os.system("playwright install chromium")
    from playwright.async_api import async_playwright

async def capture_mobile_preview():
    """Capture screenshots of the bonus popup on mobile devices"""
    
    # Device configurations
    devices = [
        {"name": "iPhone_12", "viewport": {"width": 390, "height": 844}},
        {"name": "iPhone_SE", "viewport": {"width": 375, "height": 667}},
        {"name": "Pixel_5", "viewport": {"width": 393, "height": 851}},
    ]
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # Create screenshots directory
        screenshots_dir = "scripts/screenshots"
        os.makedirs(screenshots_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        for device in devices:
            # Create a new context with device viewport
            context = await browser.new_context(
                viewport=device["viewport"],
                device_scale_factor=2,
                is_mobile=True,
                has_touch=True
            )
            
            page = await context.new_page()
            
            # Navigate to the local server
            await page.goto("http://localhost:8080")
            
            # Wait for page to load
            await page.wait_for_load_state("networkidle")
            
            # Start a game to access the bonus popup
            # Click "Set Sail" to start with default players
            await page.click("#start-game-btn")
            
            # Wait for game section to be visible
            await page.wait_for_selector("#game-section", state="visible")
            
            # Find and click a bonus input to trigger the popup
            # First, we need to enter some bid/actual values
            await page.fill('input[placeholder="Bid"]', "3")
            await page.fill('input[placeholder="Got"]', "3")
            
            # Click the calculator button (should be enabled now)
            await page.click(".bonus-calculator-btn")
            
            # Wait for modal to be visible
            await page.wait_for_selector(".modal-overlay.active", state="visible")
            
            # Add some bonus values for better visualization
            await page.click('button[onclick="game.updateBonusCounter(\'standard14\', 1)"]')
            await page.click('button[onclick="game.updateBonusCounter(\'standard14\', 1)"]')
            await page.click('button[onclick="game.updateBonusCounter(\'mermaidPirate\', 1)"]')
            
            # Take screenshot of the bonus popup
            screenshot_path = os.path.join(screenshots_dir, f"bonus_popup_{device['name']}_{timestamp}.png")
            await page.screenshot(path=screenshot_path, full_page=False)
            
            print(f"✅ Captured {device['name']} - {device['viewport']['width']}x{device['viewport']['height']}")
            print(f"   Saved to: {screenshot_path}")
            
            # Also capture just the modal
            modal_element = await page.query_selector(".bonus-modal")
            if modal_element:
                modal_screenshot_path = os.path.join(screenshots_dir, f"bonus_modal_only_{device['name']}_{timestamp}.png")
                await modal_element.screenshot(path=modal_screenshot_path)
                print(f"   Modal only: {modal_screenshot_path}")
            
            await context.close()
        
        await browser.close()
        
        print(f"\n📸 All screenshots saved to: {os.path.abspath(screenshots_dir)}")
        print("\n💡 You can now review the screenshots to see how the bonus popup looks on different mobile devices!")

if __name__ == "__main__":
    print("🏴‍☠️ Mobile Preview Tool for Skull King Score Keeper")
    print("=" * 50)
    print("⚠️  Make sure the development server is running on port 8080!")
    print("   Run: python scripts/dev-server.py")
    print("=" * 50 + "\n")
    
    asyncio.run(capture_mobile_preview())