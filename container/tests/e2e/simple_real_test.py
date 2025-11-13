"""
Simple Real Test - Actually connects to Chrome and tests basic functionality
"""
import asyncio
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from mcp_server.browser import BrowserManager


async def simple_real_test():
    """Simple real test that actually connects to Chrome"""
    print("🚀 SIMPLE REAL TEST - Chrome Connection")
    print("=" * 40)
    print()
    
    manager = BrowserManager()
    
    try:
        print("1. Connecting to Chrome browser on port 9222...")
        await manager.connect(debug_port=9222)
        
        if not manager.is_connected() or manager.page is None:
            print("❌ Failed to connect to browser")
            return False
        
        print("✅ Successfully connected to Chrome!")
        print(f"   Browser type: {type(manager.browser)}")
        print(f"   Page object: {type(manager.page)}")
        
        print("\n2. Navigating to DeepSeek...")
        await manager.page.goto("https://chat.deepseek.com")
        await asyncio.sleep(3)
        
        current_url = manager.page.url
        print(f"✅ Navigated to: {current_url}")
        
        # Get page title
        title = await manager.page.title()
        print(f"   Page title: {title[:50]}...")
        
        print("\n3. Testing page elements...")
        # Try to find some elements
        textareas = await manager.page.query_selector_all("textarea")
        buttons = await manager.page.query_selector_all("button")
        
        print(f"   Found {len(textareas)} textareas")
        print(f"   Found {len(buttons)} buttons")
        
        if len(textareas) > 0:
            print("✅ Page structure looks correct")
        else:
            print("⚠ No textareas found (may be normal)")
        
        await manager.close()
        print("\n✅ Simple real test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Simple real test failed: {e}")
        await manager.close()
        return False


if __name__ == "__main__":
    success = asyncio.run(simple_real_test())
    sys.exit(0 if success else 1)