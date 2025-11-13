"""
DeepSeek Browser E2E tests - True end-to-end tests with browser automation
"""
import pytest
import asyncio
import subprocess
import time
import requests
from unittest.mock import AsyncMock

from mcp_server.browser import BrowserManager
from mcp_server.handlers.deepseek_handler import DeepSeekHandler


class TestDeepSeekBrowserE2E:
    """True E2E tests for DeepSeek AI with browser automation"""
    
    @classmethod
    def setup_class(cls):
        """Start Chrome with debug port before running tests"""
        # Start Chrome with remote debugging port
        cls.chrome_process = subprocess.Popen([
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            "--remote-debugging-port=9222",
            "--no-first-run",
            "--no-default-browser-check",
            "--disable-web-security",
            "--disable-extensions",
            "--disable-plugins",
            "--user-data-dir=C:\\temp\\chrome_debug_user_data"
        ])
        
        # Wait for Chrome to start
        time.sleep(5)
        
        # Verify Chrome is running
        try:
            response = requests.get("http://localhost:9222/json/version", timeout=10)
            assert response.status_code == 200
            print("Chrome successfully started with debug port 9222")
        except Exception as e:
            pytest.skip(f"Chrome failed to start: {e}")
    
    @classmethod
    def teardown_class(cls):
        """Close Chrome after running tests"""
        if hasattr(cls, 'chrome_process'):
            cls.chrome_process.terminate()
            cls.chrome_process.wait()
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_deepseek_browser_connection(self):
        """Test connecting to Chrome browser and navigating to DeepSeek"""
        manager = BrowserManager()
        
        try:
            # Connect to the browser
            await manager.connect(debug_port=9222)
            
            # Verify connection
            assert manager.is_connected() is True
            assert manager.browser is not None
            assert manager.page is not None
            
            # Test navigation to DeepSeek
            await manager.switch_ai("deepseek")
            
            # Verify we're on the DeepSeek website
            current_url = manager.page.url
            assert "deepseek" in current_url.lower()
            
            await manager.close()
            
        except Exception as e:
            # Clean up on failure
            if manager.browser is not None:
                await manager.close()
            pytest.fail(f"Browser connection test failed: {e}")
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_deepseek_handler_browser_automation(self):
        """Test DeepSeek handler with actual browser automation"""
        manager = BrowserManager()
        
        try:
            # Connect to the browser
            await manager.connect(debug_port=9222)
            
            # Verify we have a page
            assert manager.page is not None
            
            # Create DeepSeek handler
            handler = DeepSeekHandler(manager.page)
            
            # Navigate to DeepSeek
            await handler.navigate_to_service()
            
            # Verify we're on the DeepSeek website
            current_url = manager.page.url
            assert "deepseek" in current_url.lower()
            
            # Test that the handler has the required methods
            assert hasattr(handler, 'navigate_to_service')
            assert hasattr(handler, 'ask_question')
            assert handler.service is not None
            assert handler.service.id == "deepseek"
            
            await manager.close()
            
        except Exception as e:
            # Clean up on failure
            await manager.close()
            pytest.fail(f"DeepSeek handler browser automation test failed: {e}")
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_complete_deepseek_workflow(self):
        """Test complete DeepSeek workflow with browser automation"""
        manager = BrowserManager()
        
        try:
            # Connect to the browser
            await manager.connect(debug_port=9222)
            
            # Verify we have a page
            assert manager.page is not None
            
            # Switch to DeepSeek
            await manager.switch_ai("deepseek")
            
            # Verify we're on the DeepSeek website
            current_url = manager.page.url
            assert "deepseek" in current_url.lower()
            
            # Test that the page has loaded (basic check)
            title = await manager.page.title()
            assert len(title) > 0
            
            await manager.close()
            
        except Exception as e:
            # Clean up on failure
            await manager.close()
            pytest.fail(f"Complete DeepSeek workflow test failed: {e}")