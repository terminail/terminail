"""
Unit tests for BrowserManager class
"""
import pytest
from unittest.mock import AsyncMock, patch
from mcp_server.browser import BrowserManager


@pytest.fixture
def mock_page():
    """Mock page fixture"""
    return AsyncMock()


@pytest.fixture
def mock_browser():
    """Mock browser fixture"""
    return AsyncMock()


@pytest.fixture
def mock_playwright():
    """Mock playwright fixture"""
    return AsyncMock()


class TestBrowserManager:
    """Test cases for BrowserManager class"""
    
    def test_initialization(self):
        """Test BrowserManager initialization"""
        manager = BrowserManager()
        
        assert manager.browser is None
        assert manager.page is None
        assert manager.playwright is None
        # Check that all 18 AI services are loaded
        ai_urls = manager.ai_urls
        expected_ais = [
            "deepseek", "doubao", "yuanbao", "qwen", "ernie", "kimi",
            "tongyi-wanxiang", "wenxin-yiyan", "chatgpt", "claude", "gemini",
            "copilot", "perplexity", "grok", "pi", "quark", "huggingchat", "leonardo-ai"
        ]
        for ai in expected_ais:
            assert ai in ai_urls, f"AI service {ai} not found in ai_urls"
    
    @pytest.mark.asyncio
    async def test_connect_success(self):
        """Test successful browser connection"""
        manager = BrowserManager()
        
        # Mock browser objects
        mock_browser = AsyncMock()
        mock_context = AsyncMock()
        mock_page = AsyncMock()
        
        # Setup mock chain
        mock_browser.contexts = [mock_context]
        mock_context.pages = [mock_page]
        mock_browser.is_connected.return_value = True
        
        # Mock the playwright.chromium.connect_over_cdp method directly
        with patch('mcp_server.browser.async_playwright') as mock_async_playwright:
            # Create a simple mock that returns a playwright instance with our mocked browser
            mock_playwright_instance = AsyncMock()
            mock_playwright_instance.chromium.connect_over_cdp.return_value = mock_browser
            
            # Create a simple async context manager mock
            mock_context_manager = AsyncMock()
            mock_context_manager.__aenter__ = AsyncMock(return_value=mock_playwright_instance)
            mock_context_manager.__aexit__ = AsyncMock(return_value=None)
            mock_async_playwright.return_value = mock_context_manager
            
            await manager.connect(debug_port=9222)
            
            # Verify connection
            mock_browser.is_connected.return_value = True
            assert manager.is_connected() is True
            assert manager.browser is not None
            assert manager.page is not None
    
    @pytest.mark.asyncio
    async def test_connect_failure(self):
        """Test browser connection failure"""
        manager = BrowserManager()
        
        with patch('mcp_server.browser.async_playwright') as mock_async_playwright:
            mock_async_playwright.return_value.__aenter__.side_effect = Exception("Connection failed")
            
            # Use a more flexible exception check
            with pytest.raises(Exception):
                await manager.connect(debug_port=9222)
            
            # Ensure resources are cleaned up
            assert manager.browser is None
            assert manager.page is None
            assert manager.playwright is None
    
    @pytest.mark.asyncio
    async def test_ask_ai_success(self, mock_page):
        """Test successful AI question asking"""
        manager = BrowserManager()
        manager.page = mock_page
        manager.browser = AsyncMock()
        manager.browser.is_connected.return_value = True
        
        # Mock input element
        mock_input = AsyncMock()
        mock_input.fill = AsyncMock()
        mock_page.query_selector_all.return_value = [mock_input]
        
        # Mock button element
        mock_button = AsyncMock()
        mock_button.click = AsyncMock()
        
        # Mock answer element
        mock_answer = AsyncMock()
        mock_answer.text_content = AsyncMock(return_value="Test answer")
        
        # Setup mock query_selector to return different elements based on selector
        def query_selector_side_effect(selector):
            if "button" in selector:
                return mock_button
            elif "answer" in selector or "response" in selector:
                return mock_answer
            return None
        
        mock_page.query_selector.side_effect = query_selector_side_effect
        
        result = await manager.ask_ai("deepseek", "Test question")
        
        # Assertions
        assert result == "Test answer"
        mock_page.goto.assert_called_once_with("https://chat.deepseek.com")
        mock_input.fill.assert_called_once_with("Test question")
        mock_button.click.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_ask_ai_no_page(self):
        """Test asking AI without a page"""
        manager = BrowserManager()
        
        with pytest.raises(RuntimeError, match="Browser page not available"):
            await manager.ask_ai("deepseek", "Test question")
    
    @pytest.mark.asyncio
    async def test_ask_ai_unsupported_ai(self, mock_page):
        """Test asking unsupported AI"""
        manager = BrowserManager()
        manager.page = mock_page
        
        with pytest.raises(ValueError, match="Unsupported AI: unknown"):
            await manager.ask_ai("unknown", "Test question")
    
    @pytest.mark.asyncio
    async def test_ask_ai_no_input_element(self, mock_page):
        """Test asking AI when no input element is found"""
        manager = BrowserManager()
        manager.page = mock_page
        
        mock_page.query_selector_all.return_value = []
        
        with pytest.raises(RuntimeError, match="Could not find input element"):
            await manager.ask_ai("deepseek", "Test question")
    
    @pytest.mark.asyncio
    async def test_switch_ai_success(self, mock_page):
        """Test successful AI switching"""
        manager = BrowserManager()
        manager.page = mock_page
        
        await manager.switch_ai("qwen")
        
        mock_page.goto.assert_called_once_with("https://tongyi.aliyun.com")
    
    @pytest.mark.asyncio
    async def test_switch_ai_unsupported(self, mock_page):
        """Test switching to unsupported AI"""
        manager = BrowserManager()
        manager.page = mock_page
        
        with pytest.raises(ValueError, match="Unsupported AI: unknown"):
            await manager.switch_ai("unknown")
    
    @pytest.mark.asyncio
    async def test_switch_ai_no_page(self):
        """Test switching AI without a page"""
        manager = BrowserManager()
        
        with pytest.raises(RuntimeError, match="Browser page not available"):
            await manager.switch_ai("deepseek")
    
    def test_is_connected_false(self):
        """Test is_connected when browser is not connected"""
        manager = BrowserManager()
        assert not manager.is_connected()
    
    def test_is_connected_true(self, mock_browser):
        """Test is_connected when browser is connected"""
        manager = BrowserManager()
        manager.browser = mock_browser
        mock_browser.is_connected.return_value = True
        
        assert manager.is_connected()
    
    @pytest.mark.asyncio
    async def test_close_with_resources(self, mock_playwright, mock_browser):
        """Test closing browser with resources"""
        manager = BrowserManager()
        manager.playwright = mock_playwright
        manager.browser = mock_browser
        manager.page = AsyncMock()
        
        await manager.close()
        
        mock_browser.close.assert_called_once()
        # playwright.stop() is not called since it's handled by async context manager
        assert manager.browser is None
        assert manager.page is None
        assert manager.playwright is None
    
    @pytest.mark.asyncio
    async def test_close_without_resources(self):
        """Test closing browser without resources"""
        manager = BrowserManager()
        
        # Should not raise any exceptions
        await manager.close()
        
        assert manager.browser is None
        assert manager.page is None
        assert manager.playwright is None