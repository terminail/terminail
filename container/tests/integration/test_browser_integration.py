"""
Integration tests for browser automation
"""
import pytest
import asyncio
from unittest.mock import patch, AsyncMock
from mcp_server.browser import BrowserManager


class TestBrowserIntegration:
    """Integration tests for browser automation"""
    
    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_browser_connection_flow(self):
        """Test complete browser connection flow"""
        manager = BrowserManager()
        
        # Mock the complete playwright setup
        mock_playwright = AsyncMock()
        mock_browser = AsyncMock()
        mock_context = AsyncMock()
        mock_page = AsyncMock()
        
        # Setup mock chain
        mock_playwright.chromium.connect_over_cdp.return_value = mock_browser
        mock_browser.contexts = [mock_context]
        mock_context.pages = [mock_page]
        mock_browser.is_connected.return_value = True
        
        with patch('mcp_server.browser.async_playwright') as mock_async_playwright:
            # Mock the async context manager for async_playwright()
            mock_context_manager = AsyncMock()
            mock_context_manager.__aenter__ = AsyncMock(return_value=mock_playwright)
            mock_context_manager.__aexit__ = AsyncMock(return_value=None)
            mock_async_playwright.return_value = mock_context_manager
            
            # Mock the start method to return the playwright instance
            mock_playwright.start = AsyncMock(return_value=mock_playwright)
            
            # Test connection
            await manager.connect(debug_port=9222)
            
            # Verify connection
            assert manager.is_connected() is True
            assert manager.browser == mock_browser
            assert manager.page == mock_page
            
            # Test AI switching for a few representative services
            test_ais = ["qwen", "chatgpt", "claude"]
            for ai in test_ais:
                await manager.switch_ai(ai)
                expected_url = manager.ai_urls[ai]
                mock_page.goto.assert_called_with(expected_url)
                mock_page.goto.reset_mock()
            
            # Test asking question
            mock_input = AsyncMock()
            mock_button = AsyncMock()
            mock_answer = AsyncMock()
            
            mock_page.query_selector_all.return_value = [mock_input]
            mock_page.query_selector.side_effect = [mock_button, mock_answer]
            mock_answer.text_content.return_value = "Integration test answer"
            
            answer = await manager.ask_ai("qwen", "Integration test question")
            
            assert answer == "Integration test answer"
            mock_input.fill.assert_called_once_with("Integration test question")
            mock_button.click.assert_called_once()
            
            # Test cleanup
            await manager.close()
            assert manager.is_connected() is False
    
    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_multiple_ai_switching(self):
        """Test switching between multiple AIs"""
        manager = BrowserManager()
        
        # Mock setup
        mock_playwright = AsyncMock()
        mock_browser = AsyncMock()
        mock_context = AsyncMock()
        mock_page = AsyncMock()
        
        mock_playwright.chromium.connect_over_cdp.return_value = mock_browser
        mock_browser.contexts = [mock_context]
        mock_context.pages = [mock_page]
        
        with patch('mcp_server.browser.async_playwright') as mock_async_playwright:
            # Mock the async context manager for async_playwright()
            mock_context_manager = AsyncMock()
            mock_context_manager.__aenter__ = AsyncMock(return_value=mock_playwright)
            mock_context_manager.__aexit__ = AsyncMock(return_value=None)
            mock_async_playwright.return_value = mock_context_manager
            
            # Mock the start method to return the playwright instance
            mock_playwright.start = AsyncMock(return_value=mock_playwright)
            
            await manager.connect(debug_port=9222)
            
            # Test switching through all supported AIs
            for ai in ["deepseek", "qwen", "doubao", "chatgpt", "claude"]:
                await manager.switch_ai(ai)
                
                # Verify correct URL was called
                expected_url = manager.ai_urls[ai]
                mock_page.goto.assert_called_with(expected_url)
                
                # Reset mock for next iteration
                mock_page.goto.reset_mock()
    
    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_error_handling_integration(self):
        """Test error handling in integration scenarios"""
        manager = BrowserManager()
        
        # Test connection failure
        with patch('mcp_server.browser.async_playwright') as mock_async_playwright:
            # Mock the async context manager for async_playwright()
            mock_context_manager = AsyncMock()
            mock_context_manager.__aenter__ = AsyncMock(side_effect=Exception("Network error"))
            mock_context_manager.__aexit__ = AsyncMock(return_value=None)
            mock_async_playwright.return_value = mock_context_manager
            
            with pytest.raises(Exception, match="Network error"):
                await manager.connect(debug_port=9222)
            
            # Verify cleanup after failure
            assert manager.browser is None
            assert manager.page is None
            assert manager.playwright is None
        
        # Test successful connection after failure
        mock_playwright = AsyncMock()
        mock_browser = AsyncMock()
        mock_context = AsyncMock()
        mock_page = AsyncMock()
        
        mock_playwright.chromium.connect_over_cdp.return_value = mock_browser
        mock_browser.contexts = [mock_context]
        mock_context.pages = [mock_page]
        
        with patch('mcp_server.browser.async_playwright') as mock_async_playwright:
            mock_async_playwright.return_value.__aenter__.return_value = mock_playwright
            
            await manager.connect(debug_port=9222)
            
            # Verify successful connection
            assert manager.is_connected() is True
    
    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_browser_reconnection_scenario(self):
        """Test browser reconnection scenario"""
        manager = BrowserManager()
        
        # First connection
        mock_playwright1 = AsyncMock()
        mock_browser1 = AsyncMock()
        mock_context1 = AsyncMock()
        mock_page1 = AsyncMock()
        
        mock_playwright1.chromium.connect_over_cdp.return_value = mock_browser1
        mock_browser1.contexts = [mock_context1]
        mock_context1.pages = [mock_page1]
        
        with patch('mcp_server.browser.async_playwright') as mock_async_playwright:
            # Mock the async context manager for async_playwright()
            mock_context_manager = AsyncMock()
            mock_context_manager.__aenter__ = AsyncMock(return_value=mock_playwright1)
            mock_context_manager.__aexit__ = AsyncMock(return_value=None)
            mock_async_playwright.return_value = mock_context_manager
            
            # Mock the start method to return the playwright instance
            mock_playwright1.start = AsyncMock(return_value=mock_playwright1)
            
            await manager.connect(debug_port=9222)
            
            # Close connection
            await manager.close()
            
            # Reconnect with different port
            mock_playwright2 = AsyncMock()
            mock_browser2 = AsyncMock()
            mock_context2 = AsyncMock()
            mock_page2 = AsyncMock()
            
            mock_playwright2.chromium.connect_over_cdp.return_value = mock_browser2
            mock_browser2.contexts = [mock_context2]
            mock_context2.pages = [mock_page2]
            
            # Mock the async context manager for async_playwright()
            mock_context_manager.__aenter__ = AsyncMock(return_value=mock_playwright2)
            
            # Mock the start method to return the playwright instance
            mock_playwright2.start = AsyncMock(return_value=mock_playwright2)
            
            await manager.connect(debug_port=9333)
            
            # Verify new connection
            assert manager.browser == mock_browser2
            assert manager.page == mock_page2
            mock_playwright2.chromium.connect_over_cdp.assert_called_once_with("http://localhost:9333")
    
    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_concurrent_operations(self):
        """Test handling of concurrent operations"""
        manager = BrowserManager()
        
        # Mock setup
        mock_playwright = AsyncMock()
        mock_browser = AsyncMock()
        mock_context = AsyncMock()
        mock_page = AsyncMock()
        
        mock_playwright.chromium.connect_over_cdp.return_value = mock_browser
        mock_browser.contexts = [mock_context]
        mock_context.pages = [mock_page]
        
        with patch('mcp_server.browser.async_playwright') as mock_async_playwright:
            # Mock the async context manager for async_playwright()
            mock_context_manager = AsyncMock()
            mock_context_manager.__aenter__ = AsyncMock(return_value=mock_playwright)
            mock_context_manager.__aexit__ = AsyncMock(return_value=None)
            mock_async_playwright.return_value = mock_context_manager
            
            # Mock the start method to return the playwright instance
            mock_playwright.start = AsyncMock(return_value=mock_playwright)
            
            await manager.connect(debug_port=9222)
            
            # Mock input elements for concurrent operations
            mock_input = AsyncMock()
            mock_button = AsyncMock()
            mock_answer = AsyncMock()
            
            mock_page.query_selector_all.return_value = [mock_input]
            mock_page.query_selector.side_effect = [mock_button, mock_answer]
            mock_answer.text_content.return_value = "Concurrent answer"
            
            # Create multiple concurrent operations
            tasks = []
            for i in range(3):
                task = manager.ask_ai("deepseek", f"Question {i}")
                tasks.append(task)
            
            # Execute concurrently
            results = await asyncio.gather(*tasks)
            
            # Verify all operations completed
            assert len(results) == 3
            assert all(result == "Concurrent answer" for result in results)
            
            # Verify correct number of calls
            assert mock_input.fill.call_count == 3
            assert mock_button.click.call_count == 3