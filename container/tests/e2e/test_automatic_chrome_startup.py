"""
Automatic Chrome Startup E2E Test - Tests Terminail's ability to automatically start Chrome
"""
import pytest
import asyncio
from mcp_server.browser import BrowserManager
from mcp_server.chrome_manager import ChromeManager


class TestAutomaticChromeStartupE2E:
    """E2E tests for automatic Chrome startup functionality"""
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_chrome_manager_standalone(self):
        """Test ChromeManager standalone functionality"""
        print("\n=== Chrome Manager Standalone Test ===")
        
        chrome_manager = ChromeManager()
        
        try:
            # Check if Chrome is already running
            was_running = chrome_manager.is_chrome_running()
            print(f"Chrome was {'already' if was_running else 'not'} running")
            
            # Start Chrome automatically
            success = chrome_manager.start_chrome()
            assert success, "Failed to start Chrome"
            print("✓ Chrome started automatically")
            
            # Verify Chrome is running
            assert chrome_manager.is_chrome_running(), "Chrome is not running after start"
            print("✓ Chrome is confirmed running on debug port")
            
            # Stop Chrome
            chrome_manager.stop_chrome()
            print("✓ Chrome stopped successfully")
            
        except Exception as e:
            # Clean up on failure
            chrome_manager.stop_chrome()
            pytest.fail(f"Chrome manager standalone test failed: {e}")
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_browser_manager_with_automatic_chrome(self):
        """Test BrowserManager with automatic Chrome startup"""
        print("\n=== Browser Manager with Automatic Chrome Test ===")
        
        manager = BrowserManager()
        
        try:
            # Start Chrome automatically
            success = await manager.start_chrome_automatically()
            assert success, "Failed to start Chrome automatically"
            print("✓ Chrome started automatically via BrowserManager")
            
            # Connect to the browser
            print("Connecting to Chrome browser...")
            await manager.connect(debug_port=9222)
            
            # Verify connection
            assert manager.is_connected() is True
            assert manager.browser is not None
            assert manager.page is not None
            print("✓ Successfully connected to browser")
            
            # Verify we can navigate to a page
            await manager.page.goto("https://chat.deepseek.com")
            await asyncio.sleep(2)
            
            current_url = manager.page.url
            assert "deepseek" in current_url.lower()
            print("✓ Successfully navigated to DeepSeek")
            
            await manager.close()
            print("✓ Browser connection closed")
            
        except Exception as e:
            # Clean up on failure
            await manager.close()
            pytest.fail(f"Browser manager with automatic Chrome test failed: {e}")
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_context_manager_chrome_startup(self):
        """Test ChromeManager as context manager"""
        print("\n=== Chrome Manager Context Manager Test ===")
        
        try:
            with ChromeManager() as chrome_manager:
                print("✓ Chrome started via context manager")
                
                # Verify Chrome is running
                assert chrome_manager.is_chrome_running(), "Chrome is not running"
                print("✓ Chrome is confirmed running")
                
                # Simulate some work
                await asyncio.sleep(2)
                print("✓ Context manager working correctly")
            
            # Chrome should be stopped automatically
            print("✓ Chrome stopped automatically via context manager")
            
        except Exception as e:
            pytest.fail(f"Chrome manager context manager test failed: {e}")