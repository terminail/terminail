"""
Handler for DeepSeek AI
"""

from playwright.async_api import Page
from ..ai_handler_base import AIHandler
from ..utils import get_ai_service_by_id

class DeepSeekHandler(AIHandler):
    """Handler for DeepSeek AI"""
    
    def __init__(self, page: Page):
        super().__init__(page)
        self.service = get_ai_service_by_id("deepseek")
    
    async def navigate_to_service(self) -> None:
        """Navigate to DeepSeek website"""
        if not self.page:
            raise RuntimeError("Browser page not available")
        
        # Get URL from configuration
        url = self.service.url if self.service else "https://chat.deepseek.com"
        await self.page.goto(url)
        await self.page.wait_for_timeout(3000)
    
    async def ask_question(self, question: str) -> str:
        """Ask a question to DeepSeek and return the response"""
        if not self.page:
            raise RuntimeError("Browser page not available")
            
        # Find input box and input question
        input_selectors = [
            "textarea",
            "#chat-input",
            "#prompt-textarea",
            ".chat-textarea",
            "[contenteditable='true']",
            "input[type='text']"
        ]
        
        input_element = None
        for selector in input_selectors:
            elements = await self.page.query_selector_all(selector)
            if elements:
                # Select the last one (usually the latest input box)
                input_element = elements[-1]
                break
        
        if not input_element:
            raise RuntimeError("Could not find input element for DeepSeek")
        
        await input_element.fill(question)
        await self.page.wait_for_timeout(1000)
        
        # Find and click the send button
        button_selectors = [
            "button[type='submit']",
            ".send-button",
            "[data-testid='send-button']",
            ".chat-send-button",
            ".submit-button",
            "button:has(> .ds-icon-button__hover-bg)",
            "button"
        ]
        
        # Try pressing Enter in the input field first (more reliable)
        await input_element.press("Enter")
        button_clicked = True
        
        # If Enter doesn't work, try clicking the send button
        if not button_clicked:
            for selector in button_selectors:
                button = await self.page.query_selector(selector)
                if button:
                    try:
                        await button.click()
                        button_clicked = True
                        break
                    except Exception:
                        # If click fails, continue to next selector
                        continue
        
        if not button_clicked:
            # Final fallback: try pressing Enter again
            await input_element.press("Enter")
        
        # Wait for response generation
        await self.page.wait_for_timeout(10000)
        
        # Extract response content
        answer_selectors = [
            ".message:last-child .markdown",
            ".message:last-child",
            ".response:last-child",
            "[data-testid='message-answer']:last-child",
            ".chat-message:last-child",
            ".answer-content:last-child",
            ".ds-scroll-area:last-child"
        ]
        
        for selector in answer_selectors:
            answer_element = await self.page.query_selector(selector)
            if answer_element:
                answer = await answer_element.text_content()
                if answer and answer.strip():
                    return answer.strip()
        
        return "No answer found from DeepSeek - please check the website structure"