"""
Integration tests for all AI handlers
"""
import pytest
from mcp_server.handler_factory import create_ai_handler
from mcp_server.ai_handler_base import AIHandler
from unittest.mock import AsyncMock


class TestAllAIHandlers:
    """Integration tests for all AI handlers"""
    
    @pytest.mark.integration
    def test_all_handlers_can_be_created(self):
        """Test that all 18 AI handlers can be created"""
        mock_page = AsyncMock()
        
        # Test all 18 AI services
        expected_ais = [
            "deepseek", "doubao", "yuanbao", "qwen", "ernie", "kimi",
            "tongyi-wanxiang", "wenxin-yiyan", "chatgpt", "claude", "gemini",
            "copilot", "perplexity", "grok", "pi", "quark", "huggingchat", "leonardo-ai"
        ]
        
        created_handlers = []
        for ai in expected_ais:
            handler = create_ai_handler(ai, mock_page)
            assert handler is not None, f"Handler for {ai} should not be None"
            assert isinstance(handler, AIHandler), f"Handler for {ai} should be an instance of AIHandler"
            created_handlers.append((ai, handler))
        
        # Verify we created handlers for all expected AIs
        assert len(created_handlers) == len(expected_ais), f"Expected {len(expected_ais)} handlers, got {len(created_handlers)}"
    
    @pytest.mark.integration
    def test_handlers_have_correct_type_names(self):
        """Test that handlers have correct type names"""
        mock_page = AsyncMock()
        
        # Test a few representative handlers
        test_cases = [
            ("deepseek", "DeepSeekHandler"),
            ("qwen", "QwenHandler"),
            ("doubao", "DoubaoHandler"),
            ("chatgpt", "ChatgptHandler"),
            ("claude", "ClaudeHandler")
        ]
        
        for ai, expected_type_name in test_cases:
            handler = create_ai_handler(ai, mock_page)
            assert handler is not None, f"Handler for {ai} should not be None"
            assert expected_type_name in str(type(handler)), f"Handler for {ai} should be of type {expected_type_name}"
    
    @pytest.mark.integration
    def test_handlers_support_method_signatures(self):
        """Test that handlers support the expected method signatures"""
        mock_page = AsyncMock()
        
        # Test a few representative handlers
        test_ais = ["deepseek", "qwen", "chatgpt"]
        
        for ai in test_ais:
            handler = create_ai_handler(ai, mock_page)
            assert handler is not None, f"Handler for {ai} should not be None"
            
            # Check that methods exist and are callable
            assert hasattr(handler, 'navigate_to_service')
            assert hasattr(handler, 'ask_question')
            assert callable(handler.navigate_to_service)
            assert callable(handler.ask_question)