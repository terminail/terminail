"""
Unit tests for DeepSeek AI handler
"""
import pytest
from unittest.mock import AsyncMock, patch
from mcp_server.handlers.deepseek_handler import DeepSeekHandler
from mcp_server.ai_handler_base import AIHandler


class TestDeepSeekHandler:
    """Test cases for DeepSeekHandler"""
    
    def test_handler_instantiation(self):
        """Test DeepSeekHandler instantiation"""
        mock_page = AsyncMock()
        handler = DeepSeekHandler(mock_page)
        
        assert handler is not None
        assert isinstance(handler, DeepSeekHandler)
        assert isinstance(handler, AIHandler)
        assert handler.page == mock_page
    
    def test_navigate_to_service_method_exists(self):
        """Test that navigate_to_service method exists and is callable"""
        mock_page = AsyncMock()
        handler = DeepSeekHandler(mock_page)
        
        assert hasattr(handler, 'navigate_to_service')
        assert callable(handler.navigate_to_service)
    
    def test_ask_question_method_exists(self):
        """Test that ask_question method exists and is callable"""
        mock_page = AsyncMock()
        handler = DeepSeekHandler(mock_page)
        
        assert hasattr(handler, 'ask_question')
        assert callable(handler.ask_question)
    
    def test_service_attribute_loaded(self):
        """Test that service attribute is loaded from configuration"""
        mock_page = AsyncMock()
        handler = DeepSeekHandler(mock_page)
        
        assert hasattr(handler, 'service')
        # Service should be loaded from configuration
        assert handler.service is not None
    
    @pytest.mark.asyncio
    async def test_navigate_to_service_calls_goto(self):
        """Test that navigate_to_service calls page.goto with correct URL"""
        mock_page = AsyncMock()
        handler = DeepSeekHandler(mock_page)
        
        # Mock the service URL
        if handler.service:
            handler.service.url = "https://chat.deepseek.com"
        else:
            # Fallback if service is not loaded
            with patch.object(handler, 'service', None):
                pass
        
        await handler.navigate_to_service()
        
        # Verify that page.goto was called with the correct URL
        mock_page.goto.assert_called_once_with("https://chat.deepseek.com")
    
    @pytest.mark.asyncio
    async def test_navigate_to_service_with_config_url(self):
        """Test that navigate_to_service uses URL from configuration"""
        mock_page = AsyncMock()
        handler = DeepSeekHandler(mock_page)
        
        # Mock the service with a specific URL
        mock_service = AsyncMock()
        mock_service.url = "https://custom.deepseek.com"
        handler.service = mock_service
        
        await handler.navigate_to_service()
        
        # Verify that page.goto was called with the configured URL
        mock_page.goto.assert_called_once_with("https://custom.deepseek.com")
    
    @pytest.mark.asyncio
    async def test_ask_question_method_structure(self):
        """Test that ask_question method has the correct structure"""
        mock_page = AsyncMock()
        handler = DeepSeekHandler(mock_page)
        
        # Mock the page methods that would be called
        mock_input_element = AsyncMock()
        mock_page.query_selector_all.return_value = [mock_input_element]
        
        mock_button = AsyncMock()
        mock_page.query_selector.return_value = mock_button
        
        mock_answer_element = AsyncMock()
        mock_answer_element.text_content = AsyncMock(return_value="Test response")
        # Mock the answer selector
        mock_page.query_selector.side_effect = [mock_button, mock_answer_element]
        
        # Call the method
        result = await handler.ask_question("Test question")
        
        # Verify the method was called and returned a result
        assert result is not None
        assert isinstance(result, str)
    
    def test_handler_has_required_attributes(self):
        """Test that handler has all required attributes"""
        mock_page = AsyncMock()
        handler = DeepSeekHandler(mock_page)
        
        # Check required attributes
        assert hasattr(handler, 'page')
        assert hasattr(handler, 'service')
        
        # Check that page is set correctly
        assert handler.page == mock_page