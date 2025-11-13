"""
Integration tests for DeepSeek AI service
"""
import pytest
from unittest.mock import AsyncMock, patch
from mcp_server.handlers.deepseek_handler import DeepSeekHandler
from mcp_server.ai_handler_base import AIHandler


class TestDeepSeekIntegration:
    """Integration tests for DeepSeek AI service"""
    
    @pytest.mark.integration
    def test_deepseek_handler_creation(self):
        """Test DeepSeek handler creation"""
        mock_page = AsyncMock()
        handler = DeepSeekHandler(mock_page)
        
        assert handler is not None
        assert isinstance(handler, DeepSeekHandler)
        assert isinstance(handler, AIHandler)
    
    @pytest.mark.integration
    def test_deepseek_service_configuration(self):
        """Test DeepSeek service configuration loading"""
        mock_page = AsyncMock()
        handler = DeepSeekHandler(mock_page)
        
        # Check that service is loaded
        assert handler.service is not None
        
        # Check that service has required attributes
        assert hasattr(handler.service, 'id')
        assert hasattr(handler.service, 'name')
        assert hasattr(handler.service, 'url')
        assert hasattr(handler.service, 'category')
        
        # Check specific values
        assert handler.service.id == "deepseek"
        assert handler.service.name == "DeepSeek"
        assert handler.service.url == "https://chat.deepseek.com"
        assert handler.service.category == "domestic"
    
    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_deepseek_navigate_to_service(self):
        """Test DeepSeek navigation to service"""
        mock_page = AsyncMock()
        handler = DeepSeekHandler(mock_page)
        
        # Mock the service URL
        if handler.service:
            original_url = handler.service.url
            handler.service.url = "https://chat.deepseek.com"
        
        await handler.navigate_to_service()
        
        # Verify navigation
        mock_page.goto.assert_called_once_with("https://chat.deepseek.com")
        mock_page.wait_for_timeout.assert_called_once_with(3000)
    
    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_deepseek_ask_question_structure(self):
        """Test DeepSeek ask question method structure"""
        mock_page = AsyncMock()
        handler = DeepSeekHandler(mock_page)
        
        # Mock the page elements that would be used
        mock_input_elements = [AsyncMock()]
        mock_page.query_selector_all.return_value = mock_input_elements
        
        mock_button = AsyncMock()
        mock_answer_element = AsyncMock()
        mock_answer_element.text_content = AsyncMock(return_value="Test response")
        
        # Mock selector responses
        def selector_side_effect(selector):
            if "button" in selector.lower() or "submit" in selector.lower():
                return mock_button
            elif "answer" in selector.lower() or "response" in selector.lower() or "text-base" in selector.lower():
                return mock_answer_element
            return None
        
        mock_page.query_selector.side_effect = selector_side_effect
        
        # Call the method
        result = await handler.ask_question("Test question")
        
        # Verify results
        assert result is not None
        assert isinstance(result, str)
    
    @pytest.mark.integration
    def test_deepseek_handler_in_factory(self):
        """Test that DeepSeek handler is available in factory"""
        from mcp_server.handler_factory import create_ai_handler
        
        mock_page = AsyncMock()
        handler = create_ai_handler("deepseek", mock_page)
        
        assert handler is not None
        assert isinstance(handler, DeepSeekHandler)
    
    @pytest.mark.integration
    def test_deepseek_handler_case_insensitive(self):
        """Test that DeepSeek handler creation is case insensitive"""
        from mcp_server.handler_factory import create_ai_handler
        
        mock_page = AsyncMock()
        
        # Test different cases
        handler1 = create_ai_handler("DEEPSEEK", mock_page)
        handler2 = create_ai_handler("DeepSeek", mock_page)
        handler3 = create_ai_handler("deepseek", mock_page)
        
        assert handler1 is not None
        assert handler2 is not None
        assert handler3 is not None
        
        assert isinstance(handler1, DeepSeekHandler)
        assert isinstance(handler2, DeepSeekHandler)
        assert isinstance(handler3, DeepSeekHandler)