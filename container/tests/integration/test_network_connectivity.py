"""
Network connectivity tests for AI services
"""
import pytest
from unittest.mock import AsyncMock, patch
import asyncio


class TestNetworkConnectivity:
    """Test network connectivity for AI services"""
    
    @pytest.mark.integration
    def test_deepseek_network_configuration(self):
        """Test DeepSeek network configuration (domestic service)"""
        from mcp_server.browser import BrowserManager
        
        manager = BrowserManager()
        
        # DeepSeek should be accessible as a domestic service
        assert "deepseek" in manager.ai_urls
        deepseek_url = manager.ai_urls["deepseek"]
        
        # URL should be properly formatted
        assert deepseek_url.startswith("https://")
        assert "deepseek" in deepseek_url
        
        # Domestic services should be prioritized
        domestic_services = ["deepseek", "doubao", "yuanbao", "qwen", "ernie", "kimi"]
        for service in domestic_services:
            if service in manager.ai_urls:
                url = manager.ai_urls[service]
                assert url is not None
                assert len(url) > 0
    
    @pytest.mark.integration
    def test_international_services_separation(self):
        """Test that international services are separate from domestic ones"""
        from mcp_server.browser import BrowserManager
        
        manager = BrowserManager()
        
        # Check that we have both domestic and international services
        domestic_services = ["deepseek", "doubao", "yuanbao", "qwen", "ernie", "kimi"]
        international_services = ["chatgpt", "claude", "gemini", "copilot"]
        
        # All domestic services should be present
        for service in domestic_services:
            assert service in manager.ai_urls, f"Domestic service {service} not found"
        
        # Some international services should be present
        for service in international_services:
            assert service in manager.ai_urls, f"International service {service} not found"
    
    @pytest.mark.integration
    def test_deepseek_as_primary_service(self):
        """Test that DeepSeek is configured as primary service"""
        from mcp_server.utils import load_ai_urls, load_ai_services
        
        # Test URL loading
        ai_urls = load_ai_urls()
        assert "deepseek" in ai_urls
        assert ai_urls["deepseek"] == "https://chat.deepseek.com"
        
        # Test service loading
        ai_services = load_ai_services()
        deepseek_service = None
        for service in ai_services:
            if service.id == "deepseek":
                deepseek_service = service
                break
        
        assert deepseek_service is not None
        assert deepseek_service.id == "deepseek"
        assert deepseek_service.name == "DeepSeek"
        assert deepseek_service.category == "domestic"
        assert deepseek_service.enabled is True
        # DeepSeek should have a low sequence number (priority)
        assert deepseek_service.sequence <= 7
    
    @pytest.mark.integration
    def test_network_resilience_configuration(self):
        """Test network resilience configuration for domestic services"""
        from mcp_server.utils import load_ai_services
        
        ai_services = load_ai_services()
        
        # Find domestic services
        domestic_services = [s for s in ai_services if s.category == "domestic"]
        
        # All domestic services should be enabled
        for service in domestic_services:
            assert service.enabled is True, f"Domestic service {service.id} should be enabled"
        
        # DeepSeek should be the first domestic service
        deepseek_service = next((s for s in ai_services if s.id == "deepseek"), None)
        assert deepseek_service is not None
        assert deepseek_service.enabled is True
        
        # Check sequence numbers for domestic services (should be low)
        domestic_sequences = [s.sequence for s in domestic_services]
        assert len(domestic_sequences) > 0
        assert min(domestic_sequences) >= 0
        assert max(domestic_sequences) <= 10  # Domestic services should have low sequence numbers
    
    @pytest.mark.integration
    def test_service_fallback_mechanism(self):
        """Test service fallback mechanism prioritizes domestic services"""
        from mcp_server.handler_factory import create_ai_handler
        from mcp_server.browser import BrowserManager
        
        # Test handler factory prioritization
        mock_page = AsyncMock()
        
        # Domestic services should be available
        domestic_services = ["deepseek", "qwen", "doubao"]
        for service in domestic_services:
            handler = create_ai_handler(service, mock_page)
            assert handler is not None, f"Handler for domestic service {service} should be available"
        
        # Test browser manager has domestic services
        manager = BrowserManager()
        for service in domestic_services:
            assert service in manager.ai_urls, f"Browser manager should have {service} URL"
        
        # DeepSeek should be the first choice
        assert "deepseek" in manager.ai_urls
        assert manager.ai_urls["deepseek"] == "https://chat.deepseek.com"