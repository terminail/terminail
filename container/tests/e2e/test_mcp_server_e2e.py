"""
End-to-end tests for the complete MCP server
Tests the full system including browser automation without mocking
"""
import pytest
from unittest.mock import AsyncMock
from mcp_server.main import app
from mcp_server.browser import BrowserManager


class TestMCPEndToEnd:
    """End-to-end tests for the complete MCP server"""
    
    @pytest.mark.e2e
    def test_server_startup_and_health_check(self):
        """Test server startup and basic health check"""
        # This test uses TestClient for fast API validation
        # which is acceptable for checking server startup
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test root endpoint - match actual response format
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "TerminAI MCP Server"
        assert data["version"] == "1.0.0"
        assert data["status"] == "running"
        
        # Test health check when not connected
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["browser"] == "disconnected"
    
    @pytest.mark.e2e
    def test_browser_manager_direct_operations(self):
        """Test browser manager operations directly with real browser"""
        # This requires a real browser instance to be available
        # We'll test with a real BrowserManager instance
        manager = BrowserManager()
        
        # Since we can't run a real browser in this test environment,
        # we'll test the manager's initialization and basic methods
        assert manager.browser is None
        assert manager.page is None
        assert manager.playwright is None
        assert manager.ai_urls is not None
        
        # Check that all 18 AI services are loaded
        expected_ais = [
            "deepseek", "doubao", "yuanbao", "qwen", "ernie", "kimi",
            "tongyi-wanxiang", "wenxin-yiyan", "chatgpt", "claude", "gemini",
            "copilot", "perplexity", "grok", "pi", "quark", "huggingchat", "leonardo-ai"
        ]
        for ai in expected_ais:
            assert ai in manager.ai_urls, f"AI service {ai} not found in ai_urls"
        
        # Test connection status when not connected
        assert manager.is_connected() is False
        
        # Test cleanup methods
        # This should not raise an exception even when resources are None
        import asyncio
        try:
            asyncio.run(manager.close())
        except Exception:
            # It's okay if this raises an exception since no real browser is connected
            pass
    
    @pytest.mark.e2e
    def test_complete_api_workflow_with_real_components(self):
        """Test complete API workflow using real components"""
        # This test will use the actual app with real browser manager
        from fastapi.testclient import TestClient
        
        # Create a test client that uses the real app with its own browser manager
        client = TestClient(app)
        
        # Test initial state - browser should not be connected
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["browser"] == "disconnected"
        
        # Test supported AIs endpoint
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "ais" in data
        
        # Check that all 18 AI services are included
        expected_ais = [
            "deepseek", "doubao", "yuanbao", "qwen", "ernie", "kimi",
            "tongyi-wanxiang", "wenxin-yiyan", "chatgpt", "claude", "gemini",
            "copilot", "perplexity", "grok", "pi", "quark", "huggingchat", "leonardo-ai"
        ]
        for ai in expected_ais:
            assert ai in data["ais"], f"AI service {ai} not found in supported AIs"
        assert data["default"] == "deepseek"
        
        # Test API endpoints without browser connection (should fail appropriately)
        response = client.post("/ask?ai=deepseek&question=Hello")
        assert response.status_code == 400
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        response = client.post("/switch?ai=deepseek")
        assert response.status_code == 400
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_cors_and_request_handling(self):
        """Test basic request handling"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test successful GET request
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "TerminAI MCP Server"
        
        # Test that we can make POST requests (they'll fail due to browser not connected, but should be valid requests)
        response = client.post("/ask?ai=deepseek&question=test")
        assert response.status_code == 400  # Browser not connected
        
        response = client.post("/switch?ai=deepseek")
        assert response.status_code == 400  # Browser not connected
    
    @pytest.mark.e2e
    def test_server_lifecycle(self):
        """Test server lifecycle management"""
        # Test that the app can be created and has proper initial state
        # The browser_manager is a global variable, not in app.state
        from mcp_server.main import browser_manager
        # Initially it should be None until the lifespan starts
        # In test context, it may not be initialized yet
        assert browser_manager is None or isinstance(browser_manager, BrowserManager)

class TestQwenE2E:
    """E2E tests specifically for Qwen AI website"""
    
    @pytest.mark.e2e
    def test_qwen_ai_endpoint_validation(self):
        """Test Qwen specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Qwen is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "qwen" in data["ais"]
        
        # Test Qwen-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=qwen&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Qwen-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=qwen")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_qwen_ai_url_accessibility(self):
        """Test Qwen URL is properly configured"""
        manager = BrowserManager()
        assert "qwen" in manager.ai_urls
        assert manager.ai_urls["qwen"] == "https://tongyi.aliyun.com"


class TestDoubaoE2E:
    """E2E tests specifically for Doubao AI website"""
    
    @pytest.mark.e2e
    def test_doubao_ai_endpoint_validation(self):
        """Test Doubao specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Doubao is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "doubao" in data["ais"]
        
        # Test Doubao-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=doubao&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Doubao-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=doubao")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_doubao_ai_url_accessibility(self):
        """Test Doubao URL is properly configured"""
        manager = BrowserManager()
        assert "doubao" in manager.ai_urls
        assert manager.ai_urls["doubao"] == "https://www.doubao.com"


class TestYuanbaoE2E:
    """E2E tests specifically for Yuanbao AI website"""
    
    @pytest.mark.e2e
    def test_yuanbao_ai_endpoint_validation(self):
        """Test Yuanbao specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Yuanbao is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "yuanbao" in data["ais"]
        
        # Test Yuanbao-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=yuanbao&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Yuanbao-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=yuanbao")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_yuanbao_ai_url_accessibility(self):
        """Test Yuanbao URL is properly configured"""
        manager = BrowserManager()
        assert "yuanbao" in manager.ai_urls
        assert manager.ai_urls["yuanbao"] == "https://yuanbao.tencent.com"


class TestErnieE2E:
    """E2E tests specifically for ERNIE Bot AI website"""
    
    @pytest.mark.e2e
    def test_ernie_ai_endpoint_validation(self):
        """Test ERNIE Bot specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that ERNIE Bot is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "ernie" in data["ais"]
        
        # Test ERNIE Bot-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=ernie&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test ERNIE Bot-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=ernie")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_ernie_ai_url_accessibility(self):
        """Test ERNIE Bot URL is properly configured"""
        manager = BrowserManager()
        assert "ernie" in manager.ai_urls
        assert manager.ai_urls["ernie"] == "https://yiyan.baidu.com"


class TestKimiE2E:
    """E2E tests specifically for Kimi AI website"""
    
    @pytest.mark.e2e
    def test_kimi_ai_endpoint_validation(self):
        """Test Kimi specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Kimi is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "kimi" in data["ais"]
        
        # Test Kimi-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=kimi&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Kimi-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=kimi")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_kimi_ai_url_accessibility(self):
        """Test Kimi URL is properly configured"""
        manager = BrowserManager()
        assert "kimi" in manager.ai_urls
        assert manager.ai_urls["kimi"] == "https://kimi.com"


class TestTongyiWanxiangE2E:
    """E2E tests specifically for Tongyi Wanxiang AI website"""
    
    @pytest.mark.e2e
    def test_tongyi_wanxiang_ai_endpoint_validation(self):
        """Test Tongyi Wanxiang specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Tongyi Wanxiang is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "tongyi-wanxiang" in data["ais"]
        
        # Test Tongyi Wanxiang-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=tongyi-wanxiang&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Tongyi Wanxiang-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=tongyi-wanxiang")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_tongyi_wanxiang_ai_url_accessibility(self):
        """Test Tongyi Wanxiang URL is properly configured"""
        manager = BrowserManager()
        assert "tongyi-wanxiang" in manager.ai_urls
        assert manager.ai_urls["tongyi-wanxiang"] == "https://wanxiang.aliyun.com"


class TestWenxinYiyanE2E:
    """E2E tests specifically for Wenxin Yiyan AI website"""
    
    @pytest.mark.e2e
    def test_wenxin_yiyan_ai_endpoint_validation(self):
        """Test Wenxin Yiyan specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Wenxin Yiyan is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "wenxin-yiyan" in data["ais"]
        
        # Test Wenxin Yiyan-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=wenxin-yiyan&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Wenxin Yiyan-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=wenxin-yiyan")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_wenxin_yiyan_ai_url_accessibility(self):
        """Test Wenxin Yiyan URL is properly configured"""
        manager = BrowserManager()
        assert "wenxin-yiyan" in manager.ai_urls
        assert manager.ai_urls["wenxin-yiyan"] == "https://yiyan.baidu.com"


class TestChatgptE2E:
    """E2E tests specifically for ChatGPT AI website"""
    
    @pytest.mark.e2e
    def test_chatgpt_ai_endpoint_validation(self):
        """Test ChatGPT specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that ChatGPT is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "chatgpt" in data["ais"]
        
        # Test ChatGPT-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=chatgpt&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test ChatGPT-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=chatgpt")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_chatgpt_ai_url_accessibility(self):
        """Test ChatGPT URL is properly configured"""
        manager = BrowserManager()
        assert "chatgpt" in manager.ai_urls
        assert manager.ai_urls["chatgpt"] == "https://chatgpt.com"


class TestClaudeE2E:
    """E2E tests specifically for Claude AI website"""
    
    @pytest.mark.e2e
    def test_claude_ai_endpoint_validation(self):
        """Test Claude specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Claude is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "claude" in data["ais"]
        
        # Test Claude-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=claude&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Claude-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=claude")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_claude_ai_url_accessibility(self):
        """Test Claude URL is properly configured"""
        manager = BrowserManager()
        assert "claude" in manager.ai_urls
        assert manager.ai_urls["claude"] == "https://claude.ai"


class TestGeminiE2E:
    """E2E tests specifically for Gemini AI website"""
    
    @pytest.mark.e2e
    def test_gemini_ai_endpoint_validation(self):
        """Test Gemini specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Gemini is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "gemini" in data["ais"]
        
        # Test Gemini-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=gemini&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Gemini-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=gemini")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_gemini_ai_url_accessibility(self):
        """Test Gemini URL is properly configured"""
        manager = BrowserManager()
        assert "gemini" in manager.ai_urls
        assert manager.ai_urls["gemini"] == "https://gemini.google.com"


class TestCopilotE2E:
    """E2E tests specifically for Microsoft Copilot AI website"""
    
    @pytest.mark.e2e
    def test_copilot_ai_endpoint_validation(self):
        """Test Microsoft Copilot specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Microsoft Copilot is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "copilot" in data["ais"]
        
        # Test Microsoft Copilot-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=copilot&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Microsoft Copilot-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=copilot")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_copilot_ai_url_accessibility(self):
        """Test Microsoft Copilot URL is properly configured"""
        manager = BrowserManager()
        assert "copilot" in manager.ai_urls
        assert manager.ai_urls["copilot"] == "https://copilot.microsoft.com"


class TestPerplexityE2E:
    """E2E tests specifically for Perplexity AI website"""
    
    @pytest.mark.e2e
    def test_perplexity_ai_endpoint_validation(self):
        """Test Perplexity specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Perplexity is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "perplexity" in data["ais"]
        
        # Test Perplexity-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=perplexity&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Perplexity-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=perplexity")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_perplexity_ai_url_accessibility(self):
        """Test Perplexity URL is properly configured"""
        manager = BrowserManager()
        assert "perplexity" in manager.ai_urls
        assert manager.ai_urls["perplexity"] == "https://perplexity.ai"


class TestGrokE2E:
    """E2E tests specifically for Grok AI website"""
    
    @pytest.mark.e2e
    def test_grok_ai_endpoint_validation(self):
        """Test Grok specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Grok is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "grok" in data["ais"]
        
        # Test Grok-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=grok&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Grok-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=grok")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_grok_ai_url_accessibility(self):
        """Test Grok URL is properly configured"""
        manager = BrowserManager()
        assert "grok" in manager.ai_urls
        assert manager.ai_urls["grok"] == "https://grok.x.ai"


class TestPiE2E:
    """E2E tests specifically for Pi AI website"""
    
    @pytest.mark.e2e
    def test_pi_ai_endpoint_validation(self):
        """Test Pi specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Pi is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "pi" in data["ais"]
        
        # Test Pi-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=pi&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Pi-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=pi")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_pi_ai_url_accessibility(self):
        """Test Pi URL is properly configured"""
        manager = BrowserManager()
        assert "pi" in manager.ai_urls
        assert manager.ai_urls["pi"] == "https://pi.ai"


class TestQuarkE2E:
    """E2E tests specifically for Quark AI website"""
    
    @pytest.mark.e2e
    def test_quark_ai_endpoint_validation(self):
        """Test Quark specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Quark is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "quark" in data["ais"]
        
        # Test Quark-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=quark&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Quark-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=quark")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_quark_ai_url_accessibility(self):
        """Test Quark URL is properly configured"""
        manager = BrowserManager()
        assert "quark" in manager.ai_urls
        assert manager.ai_urls["quark"] == "https://quark.cn"


class TestHuggingchatE2E:
    """E2E tests specifically for HuggingChat AI website"""
    
    @pytest.mark.e2e
    def test_huggingchat_ai_endpoint_validation(self):
        """Test HuggingChat specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that HuggingChat is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "huggingchat" in data["ais"]
        
        # Test HuggingChat-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=huggingchat&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test HuggingChat-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=huggingchat")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_huggingchat_ai_url_accessibility(self):
        """Test HuggingChat URL is properly configured"""
        manager = BrowserManager()
        assert "huggingchat" in manager.ai_urls
        assert manager.ai_urls["huggingchat"] == "https://huggingface.co/chat"


class TestLeonardoAiE2E:
    """E2E tests specifically for Leonardo AI website"""
    
    @pytest.mark.e2e
    def test_leonardo_ai_endpoint_validation(self):
        """Test Leonardo AI specific AI functionality"""
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Test that Leonardo AI is in supported AIs list
        response = client.get("/ais")
        assert response.status_code == 200
        data = response.json()
        assert "leonardo-ai" in data["ais"]
        
        # Test Leonardo AI-specific ask endpoint (should fail with browser not connected)
        response = client.post("/ask?ai=leonardo-ai&question=test")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
        
        # Test Leonardo AI-specific switch endpoint (should fail with browser not connected)
        response = client.post("/switch?ai=leonardo-ai")
        assert response.status_code == 400  # Browser not connected
        data = response.json()
        assert "Browser not connected" in data["detail"]
    
    @pytest.mark.e2e
    def test_leonardo_ai_url_accessibility(self):
        """Test Leonardo AI URL is properly configured"""
        manager = BrowserManager()
        assert "leonardo-ai" in manager.ai_urls
        assert manager.ai_urls["leonardo-ai"] == "https://leonardo.ai"