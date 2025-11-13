"""
Unit tests for handler factory
"""
import pytest
from mcp_server.handler_factory import create_ai_handler
from mcp_server.ai_handler_base import AIHandler
from unittest.mock import AsyncMock


class TestHandlerFactory:
    """Test cases for handler factory"""
    
    def test_create_all_ai_handlers(self):
        """Test that all 18 AI handlers can be created"""
        # Mock page object
        mock_page = AsyncMock()
        
        # Test all 18 AI services
        expected_ais = [
            "deepseek", "doubao", "yuanbao", "qwen", "ernie", "kimi",
            "tongyi-wanxiang", "wenxin-yiyan", "chatgpt", "claude", "gemini",
            "copilot", "perplexity", "grok", "pi", "quark", "huggingchat", "leonardo-ai"
        ]
        
        for ai in expected_ais:
            handler = create_ai_handler(ai, mock_page)
            assert handler is not None, f"Handler for {ai} should not be None"
            assert isinstance(handler, AIHandler), f"Handler for {ai} should be an instance of AIHandler"
    
    def test_create_handler_with_invalid_ai(self):
        """Test that invalid AI service returns None"""
        mock_page = AsyncMock()
        handler = create_ai_handler("invalid-ai", mock_page)
        assert handler is None, "Handler for invalid AI should be None"
    
    def test_create_handler_case_insensitive(self):
        """Test that AI service names are case insensitive"""
        mock_page = AsyncMock()
        
        # Test with different cases
        handler1 = create_ai_handler("DEEPSEEK", mock_page)
        handler2 = create_ai_handler("DeepSeek", mock_page)
        handler3 = create_ai_handler("deepseek", mock_page)
        
        assert handler1 is not None, "Handler for uppercase DEEPSEEK should not be None"
        assert handler2 is not None, "Handler for mixed case DeepSeek should not be None"
        assert handler3 is not None, "Handler for lowercase deepseek should not be None"
        assert isinstance(handler1, type(handler2)), "Handlers should be of the same type"
        assert isinstance(handler2, type(handler3)), "Handlers should be of the same type"