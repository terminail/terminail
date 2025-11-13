"""
Browser management module
Handles connection to browser and automation operations
"""

import asyncio
import logging
from typing import Optional

from playwright.async_api import async_playwright, Browser, Page, Playwright

from .utils import load_ai_urls
from .handler_factory import create_ai_handler
from .chrome_manager import ChromeManager

logger = logging.getLogger("terminai-mcp-browser")

class BrowserManager:
    """Browser manager"""
    
    def __init__(self):
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None
        self.playwright: Optional[Playwright] = None
        self.chrome_manager: Optional[ChromeManager] = None
        self.ai_urls = load_ai_urls()
        self.debug_port: Optional[int] = None
    
    async def start_chrome_automatically(self, headless: bool = False) -> bool:
        """Start Chrome automatically with debug port"""
        try:
            self.chrome_manager = ChromeManager()
            return self.chrome_manager.start_chrome(headless)
        except Exception as e:
            logger.error(f"Failed to start Chrome automatically: {e}")
            return False
    
    async def connect(self, debug_port: int = 9222):
        """Connect to the running browser instance"""
        try:
            # Initialize playwright without context manager to keep it alive
            self.playwright = await async_playwright().start()
            
            # Connect to the running browser
            self.browser = await self.playwright.chromium.connect_over_cdp(
                f"http://localhost:{debug_port}"
            )
            
            # Get or create page
            contexts = self.browser.contexts
            if contexts and contexts[0].pages:
                self.page = contexts[0].pages[0]
            else:
                self.page = contexts[0].new_page() if contexts else await self.browser.new_page()
            
            # Store the debug port for status reporting
            self.debug_port = debug_port
            
            logger.info(f"Connected to browser on port {debug_port}")
        
        except Exception as e:
            logger.error(f"Failed to connect to browser: {e}")
            await self.close()
            raise
    
    async def ask_ai(self, ai: str, question: str) -> str:
        """Ask the specified AI and get the response"""
        if not self.page:
            raise RuntimeError("Browser page not available")
        
        # Get AI-specific handler
        handler = create_ai_handler(ai, self.page)
        if not handler:
            # Fallback to generic approach for unsupported AI services
            return await self._ask_ai_generic(ai, question)
        
        # Navigate to the AI service
        await handler.navigate_to_service()
        
        # Ask the question using AI-specific handler
        return await handler.ask_question(question)
    
    async def _ask_ai_generic(self, ai: str, question: str) -> str:
        """Generic fallback method for unsupported AI services"""
        if not self.page:
            raise RuntimeError("Browser page not available")
            
        # Navigate to the corresponding AI website
        url = self.ai_urls.get(ai)
        if not url:
            raise ValueError(f"Unsupported AI: {ai}")
        
        await self.page.goto(url)
        await self.page.wait_for_timeout(3000)
        
        # The selectors need to be adjusted according to specific websites
        # The following are general examples, actual use needs to be adjusted for each website
        
        # Find input box and input question
        input_selectors = [
            "textarea",
            "input[type='text']",
            "[contenteditable='true']",
            ".chat-input",
            "#prompt-textarea"
        ]
        
        input_element = None
        for selector in input_selectors:
            elements = await self.page.query_selector_all(selector)
            if elements:
                # Select the last one (usually the latest input box)
                input_element = elements[-1]
                break
        
        if not input_element:
            raise RuntimeError("Could not find input element")
        
        await input_element.fill(question)
        await self.page.wait_for_timeout(1000)
        
        # Find and click the send button
        button_selectors = [
            "button[type='submit']",
            "button:has-text('发送')",  # 'Send' button in Chinese
            "button:has-text('Send')",
            ".send-button",
            "[data-testid='send-button']"
        ]
        
        for selector in button_selectors:
            button = await self.page.query_selector(selector)
            if button:
                await button.click()
                break
        
        # Wait for response generation (need to adjust wait time and selectors according to actual situation)
        await self.page.wait_for_timeout(10000)
        
        # Extract response content
        answer_selectors = [
            ".message:last-child",
            ".response:last-child",
            ".answer:last-child",
            "[data-testid='message-answer']:last-child"
        ]
        
        for selector in answer_selectors:
            answer_element = await self.page.query_selector(selector)
            if answer_element:
                answer = await answer_element.text_content()
                if answer and answer.strip():
                    return answer.strip()
        
        return "No answer found - please check the website structure and selectors"
    
    async def switch_ai(self, ai: str):
        """Switch to the specified AI website"""
        if not self.page:
            raise RuntimeError("Browser page not available")
        
        url = self.ai_urls.get(ai)
        if not url:
            raise ValueError(f"Unsupported AI: {ai}")
        
        await self.page.goto(url)
        await self.page.wait_for_timeout(2000)
    
    def is_connected(self) -> bool:
        """Check if browser is connected"""
        if self.browser is None:
            return False
        # Handle both sync and async is_connected methods
        is_connected = self.browser.is_connected
        # If it's a coroutine, we can't properly check it in a sync method
        # In this case, we assume it's connected if we have a browser instance
        import inspect
        if inspect.iscoroutinefunction(is_connected) or inspect.iscoroutine(is_connected):
            return True
        elif callable(is_connected):
            return is_connected()
        else:
            return is_connected
    
    async def close(self):
        """Close browser connection"""
        if self.browser:
            try:
                await self.browser.close()
            except Exception as e:
                logger.warning(f"Error closing browser: {e}")
        
        if self.playwright:
            try:
                await self.playwright.stop()
            except Exception as e:
                logger.warning(f"Error stopping playwright: {e}")
        
        # Stop Chrome if we started it
        if self.chrome_manager:
            self.chrome_manager.stop_chrome()
        
        self.browser = None
        self.page = None
        self.playwright = None
        self.chrome_manager = None
        logger.info("Browser connection closed")