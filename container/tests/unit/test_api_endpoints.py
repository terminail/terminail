"""
Unit tests for FastAPI endpoints
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

from mcp_server.main import app
from mcp_server.browser import BrowserManager


class TestAPIEndpoints:
    """Test cases for FastAPI endpoints"""
    
    def test_root_endpoint(self, test_client):
        """Test root endpoint"""
        response = test_client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "TerminAI MCP Server"
        assert data["version"] == "1.0.0"
        assert data["status"] == "running"
    
    def test_health_check_connected(self, test_client):
        """Test health check when browser is connected"""
        # Mock browser manager as connected
        mock_browser_manager = AsyncMock()
        mock_browser_manager.is_connected.return_value = True
        
        with patch('mcp_server.main.browser_manager', mock_browser_manager):
            response = test_client.get("/health")
            
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
            assert data["browser"] == "connected"
            assert "timestamp" in data
    
    def test_health_check_disconnected(self, test_client):
        """Test health check when browser is disconnected"""
        # Mock browser_manager as None
        with patch('mcp_server.main.browser_manager', None):
            response = test_client.get("/health")
            
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
            assert data["browser"] == "disconnected"
    
    def test_init_browser_success(self, test_client):
        """Test successful browser initialization"""
        mock_browser_manager = AsyncMock()
        
        with patch('mcp_server.main.browser_manager', mock_browser_manager):
            response = test_client.post("/init?debug_port=9222")
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["message"] == "Browser connected successfully"
            mock_browser_manager.connect.assert_called_once_with(9222)
    
    def test_init_browser_failure(self, test_client):
        """Test browser initialization failure"""
        mock_browser_manager = AsyncMock()
        mock_browser_manager.connect.side_effect = Exception("Connection failed")
        
        with patch('mcp_server.main.browser_manager', mock_browser_manager):
            response = test_client.post("/init?debug_port=9222")
            
            assert response.status_code == 500
            data = response.json()
            assert "detail" in data
            assert "Connection failed" in data["detail"]
    
    def test_ask_question_success(self, test_client):
        """Test successful question asking"""
        mock_browser_manager = AsyncMock()
        mock_browser_manager.is_connected.return_value = True
        mock_browser_manager.ask_ai.return_value = "Mocked AI response"
        
        with patch('mcp_server.main.browser_manager', mock_browser_manager):
            response = test_client.post("/ask?ai=deepseek&question=Hello")
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["answer"] == "Mocked AI response"
            mock_browser_manager.ask_ai.assert_called_once_with("deepseek", "Hello")
    
    def test_ask_question_browser_not_connected(self, test_client):
        """Test asking question when browser is not connected"""
        # Mock browser_manager as None
        with patch('mcp_server.main.browser_manager', None):
            response = test_client.post("/ask?ai=deepseek&question=Hello")
            
            assert response.status_code == 400
            data = response.json()
            assert "detail" in data
            assert "Browser not connected" in data["detail"]
    
    def test_ask_question_failure(self, test_client):
        """Test question asking failure"""
        mock_browser_manager = AsyncMock()
        mock_browser_manager.is_connected.return_value = True
        mock_browser_manager.ask_ai.side_effect = Exception("AI service error")
        
        with patch('mcp_server.main.browser_manager', mock_browser_manager):
            response = test_client.post("/ask?ai=deepseek&question=Hello")
            
            assert response.status_code == 500
            data = response.json()
            assert "detail" in data
            assert "AI service error" in data["detail"]
    
    def test_get_supported_ais(self, test_client):
        """Test getting supported AI list"""
        response = test_client.get("/ais")
        
        assert response.status_code == 200
        data = response.json()
        assert "ais" in data
        assert "default" in data
        # Check that all 18 AI services are included
        expected_ais = [
            "deepseek", "doubao", "yuanbao", "qwen", "ernie", "kimi",
            "tongyi-wanxiang", "wenxin-yiyan", "chatgpt", "claude", "gemini",
            "copilot", "perplexity", "grok", "pi", "quark", "huggingchat", "leonardo-ai"
        ]
        for ai in expected_ais:
            assert ai in data["ais"], f"AI service {ai} not found in supported AIs"
        assert data["default"] == "deepseek"
    
    def test_switch_ai_success(self, test_client):
        """Test successful AI switching"""
        mock_browser_manager = AsyncMock()
        mock_browser_manager.is_connected.return_value = True
        
        with patch('mcp_server.main.browser_manager', mock_browser_manager):
            response = test_client.post("/switch?ai=qwen")
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["message"] == "Switched to qwen"
            mock_browser_manager.switch_ai.assert_called_once_with("qwen")
    
    def test_switch_ai_browser_not_connected(self, test_client):
        """Test switching AI when browser is not connected"""
        # Mock browser_manager as None
        with patch('mcp_server.main.browser_manager', None):
            response = test_client.post("/switch?ai=qwen")
            
            assert response.status_code == 400
            data = response.json()
            assert "detail" in data
            assert "Browser not connected" in data["detail"]
    
    def test_switch_ai_failure(self, test_client):
        """Test AI switching failure"""
        mock_browser_manager = AsyncMock()
        mock_browser_manager.is_connected.return_value = True
        mock_browser_manager.switch_ai.side_effect = Exception("Switch failed")
        
        with patch('mcp_server.main.browser_manager', mock_browser_manager):
            response = test_client.post("/switch?ai=qwen")
            
            assert response.status_code == 500
            data = response.json()
            assert "detail" in data
            assert "Switch failed" in data["detail"]
    
    def test_cors_middleware(self, test_client):
        """Test CORS middleware configuration"""
        # Test CORS headers on actual POST request with Origin header
        response = test_client.post("/ask?ai=deepseek&question=test", headers={"Origin": "http://localhost:3000"})
        
        # CORS headers should be present on cross-origin requests
        assert "access-control-allow-origin" in response.headers
        assert response.headers["access-control-allow-origin"] == "*"
        
        # Test CORS headers on GET request with Origin header
        response = test_client.get("/", headers={"Origin": "http://localhost:3000"})
        assert "access-control-allow-origin" in response.headers
        assert response.headers["access-control-allow-origin"] == "*"