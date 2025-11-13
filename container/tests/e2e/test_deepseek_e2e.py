"""
DeepSeek E2E tests
"""
import pytest
from unittest.mock import AsyncMock
from fastapi.testclient import TestClient

from mcp_server.main import app
from mcp_server.browser import BrowserManager


class TestDeepSeekE2E:
    """E2E tests specifically for DeepSeek AI website"""
    
    @pytest.mark.e2e
    def test_deepseek_ai_endpoint_validation(self):
        """Test DeepSeek specific AI functionality"""
        client = TestClient(app)
        
        # Test that DeepSeek is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "deepseek" in data["ais"]
        
        # Test DeepSeek-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=deepseek&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test DeepSeek-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=deepseek")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_deepseek_ai_url_accessibility(self):
        """Test DeepSeek URL is properly configured"""
        manager = BrowserManager()
        assert "deepseek" in manager.ai_urls
        assert manager.ai_urls["deepseek"] == "https://chat.deepseek.com"
    
    @pytest.mark.e2e
    def test_deepseek_is_default_ai(self):
        """Test that DeepSeek is the default AI service"""
        client = TestClient(app)
        
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert data["default"] == "deepseek"
    
    @pytest.mark.e2e
    def test_deepseek_handler_availability(self):
        """Test that DeepSeek handler is available and properly configured"""
        from mcp_server.handler_factory import create_ai_handler
        from mcp_server.handlers.deepseek_handler import DeepSeekHandler
        
        # Test handler creation
        mock_page = AsyncMock()
        handler = create_ai_handler("deepseek", mock_page)
        
        assert handler is not None
        assert isinstance(handler, DeepSeekHandler)
        
        # Test service configuration
        assert handler.service is not None
        assert handler.service.id == "deepseek"
        assert handler.service.name == "DeepSeek"
        assert handler.service.url == "https://chat.deepseek.com"
    
    @pytest.mark.e2e
    def test_deepseek_priority_in_list(self):
        """Test that DeepSeek appears first in the AI list (domestic priority)"""
        client = TestClient(app)
        
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        
        # DeepSeek should be one of the first AI services (domestic)
        assert "deepseek" in data["ais"]
        # It should appear before international services
        domestic_ais = ["deepseek", "doubao", "yuanbao", "qwen", "ernie", "kimi", 
                       "tongyi-wanxiang", "wenxin-yiyan"]
        if "deepseek" in data["ais"] and any(ai in data["ais"] for ai in domestic_ais):
            deepseek_index = data["ais"].index("deepseek")
            # Check that it's positioned correctly among domestic services
            assert deepseek_index <= 7