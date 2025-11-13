"""
Unit tests for AI handlers
"""
import pytest
from mcp_server.handler_factory import create_ai_handler
from mcp_server.ai_handler_base import AIHandler
from unittest.mock import AsyncMock


class TestAIHandlers:
    """Test cases for AI handlers"""
    
    def test_all_handlers_implement_required_methods(self):
        """Test that all AI handlers implement required methods"""
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
            
            # Check that handler implements required methods
            assert hasattr(handler, 'navigate_to_service'), f"Handler for {ai} should have navigate_to_service method"
            assert hasattr(handler, 'ask_question'), f"Handler for {ai} should have ask_question method"
            
            # Check that methods are callable
            assert callable(handler.navigate_to_service), f"navigate_to_service for {ai} should be callable"
            assert callable(handler.ask_question), f"ask_question for {ai} should be callable"
    
    def test_handlers_inherit_from_base_class(self):
        """Test that all handlers inherit from the base class"""
        mock_page = AsyncMock()
        
        # Test a few representative handlers
        test_ais = ["deepseek", "qwen", "chatgpt", "claude"]
        
        for ai in test_ais:
            handler = create_ai_handler(ai, mock_page)
            assert handler is not None, f"Handler for {ai} should not be None"
            assert isinstance(handler, AIHandler), f"Handler for {ai} should inherit from AIHandler"
    
    def test_handlers_have_page_attribute(self):
        """Test that handlers have page attribute"""
        mock_page = AsyncMock()
        
        # Test a few representative handlers
        test_ais = ["deepseek", "qwen", "chatgpt", "claude"]
        
        for ai in test_ais:
            handler = create_ai_handler(ai, mock_page)
            assert handler is not None, f"Handler for {ai} should not be None"
            assert hasattr(handler, 'page'), f"Handler for {ai} should have page attribute"
            assert handler.page is not None, f"Page attribute for {ai} should not be None"