"""
Unit tests for Wenxin Yiyan AI handler
"""
import pytest
from unittest.mock import AsyncMock
from mcp_server.handlers.wenxin_yiyan_handler import WenxinYiyanHandler
from mcp_server.ai_handler_base import AIHandler


class TestWenxinYiyanHandler:
    """Test cases for WenxinYiyanHandler"""
    
    def test_handler_instantiation(self):
        """Test WenxinYiyanHandler instantiation"""
        mock_page = AsyncMock()
        handler = WenxinYiyanHandler(mock_page)
        
        assert handler is not None
        assert isinstance(handler, WenxinYiyanHandler)
        assert isinstance(handler, AIHandler)
        assert handler.page == mock_page
    
    def test_navigate_to_service_method_exists(self):
        """Test that navigate_to_service method exists and is callable"""
        mock_page = AsyncMock()
        handler = WenxinYiyanHandler(mock_page)
        
        assert hasattr(handler, 'navigate_to_service')
        assert callable(handler.navigate_to_service)
    
    def test_ask_question_method_exists(self):
        """Test that ask_question method exists and is callable"""
        mock_page = AsyncMock()
        handler = WenxinYiyanHandler(mock_page)
        
        assert hasattr(handler, 'ask_question')
        assert callable(handler.ask_question)
    
    def test_service_attribute_loaded(self):
        """Test that service attribute is loaded from configuration"""
        mock_page = AsyncMock()
        handler = WenxinYiyanHandler(mock_page)
        
        assert hasattr(handler, 'service')
        # Service should be loaded from configuration
        assert handler.service is not None