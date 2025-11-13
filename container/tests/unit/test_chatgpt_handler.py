"""
Unit tests for ChatGPT AI handler
"""
import pytest
from unittest.mock import AsyncMock
from mcp_server.handlers.chatgpt_handler import ChatgptHandler
from mcp_server.ai_handler_base import AIHandler


class TestChatgptHandler:
    """Test cases for ChatgptHandler"""
    
    def test_handler_instantiation(self):
        """Test ChatgptHandler instantiation"""
        mock_page = AsyncMock()
        handler = ChatgptHandler(mock_page)
        
        assert handler is not None
        assert isinstance(handler, ChatgptHandler)
        assert isinstance(handler, AIHandler)
        assert handler.page == mock_page
    
    def test_navigate_to_service_method_exists(self):
        """Test that navigate_to_service method exists and is callable"""
        mock_page = AsyncMock()
        handler = ChatgptHandler(mock_page)
        
        assert hasattr(handler, 'navigate_to_service')
        assert callable(handler.navigate_to_service)
    
    def test_ask_question_method_exists(self):
        """Test that ask_question method exists and is callable"""
        mock_page = AsyncMock()
        handler = ChatgptHandler(mock_page)
        
        assert hasattr(handler, 'ask_question')
        assert callable(handler.ask_question)
    
    def test_service_attribute_loaded(self):
        """Test that service attribute is loaded from configuration"""
        mock_page = AsyncMock()
        handler = ChatgptHandler(mock_page)
        
        assert hasattr(handler, 'service')
        # Service should be loaded from configuration
        assert handler.service is not None