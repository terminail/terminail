"""
Navigate to DeepSeek website
"""
import asyncio
from mcp_server.browser import BrowserManager


async def navigate_to_deepseek():
    """Navigate to DeepSeek website"""
    print("Navigating to DeepSeek...")
    
    manager = BrowserManager()
    
    try:
        # Connect to the browser
        await manager.connect(debug_port=9222)
        
        # Check if page is available
        if manager.page is None:
            print("Failed to get page")
            return
        
        # Navigate to DeepSeek
        await manager.page.goto('https://chat.deepseek.com')
        await asyncio.sleep(3)
        print("✓ Navigated to DeepSeek")
        
        await manager.close()
        
    except Exception as e:
        print(f"Navigation failed: {e}")
        await manager.close()


if __name__ == "__main__":
    asyncio.run(navigate_to_deepseek())