"""
Pytest configuration and fixtures for TerminAI MCP Server tests
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient

from mcp_server.main import app
from mcp_server.browser import BrowserManager


@pytest.fixture
def browser_manager():
    """Fixture for browser manager"""
    return BrowserManager()


@pytest.fixture
def mock_browser_manager():
    """Fixture for mocked browser manager"""
    mock = AsyncMock(spec=BrowserManager)
    mock.is_connected.return_value = False
    return mock


@pytest.fixture
def test_client():
    """Fixture for test client with mocked browser manager"""
    # Create a fresh mock for each test
    mock_browser_manager = AsyncMock(spec=BrowserManager)
    mock_browser_manager.is_connected.return_value = False
    
    # Set the browser manager in the app state
    app.state.browser_manager = mock_browser_manager
    
    with TestClient(app) as client:
        yield client
    
    # Cleanup
    app.state.browser_manager = None


@pytest.fixture
def event_loop():
    """Create an instance of the default event loop for each test case"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def mock_page():
    """Mock Playwright page for testing"""
    mock_page = AsyncMock()
    mock_page.goto = AsyncMock()
    mock_page.wait_for_timeout = AsyncMock()
    mock_page.query_selector_all = AsyncMock(return_value=[])
    mock_page.query_selector = AsyncMock(return_value=None)
    return mock_page


@pytest.fixture
def mock_browser():
    """Mock Playwright browser for testing"""
    mock_browser = AsyncMock()
    mock_browser.is_connected.return_value = True
    mock_browser.contexts = [AsyncMock()]
    mock_browser.contexts[0].pages = []
    return mock_browser


@pytest.fixture
def mock_playwright():
    """Mock Playwright instance for testing"""
    mock_playwright = AsyncMock()
    mock_playwright.chromium = AsyncMock()
    mock_playwright.chromium.connect_over_cdp = AsyncMock()
    return mock_playwright