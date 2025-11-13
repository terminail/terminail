"""
Handler for Kimi AI
"""

from playwright.async_api import Page
from ..ai_handler_base import AIHandler
from ..utils import get_ai_service_by_id

class KimiHandler(AIHandler):
    """Handler for Kimi AI"""
    
    def __init__(self, page: Page):
        super().__init__(page)
        self.service = get_ai_service_by_id("kimi")
    
    async def navigate_to_service(self) -> None:
        """Navigate to Kimi website"""
        if not self.page:
            raise RuntimeError("Browser page not available")
        
        # Get URL from configuration
        url = self.service.url if self.service else "https://kimi.com"
        await self.page.goto(url)
        await self.page.wait_for_timeout(3000)
    
    async def ask_question(self, question: str) -> str:
        """Ask a question to Kimi and return the response"""
        if not self.page:
            raise RuntimeError("Browser page not available")
            
        # Find input box and input question
        input_selectors = [
            ".chat-input textarea",
            "#chat-input",
            "textarea[placeholder*='请输入']",
            "textarea"
        ]
        
        input_element = None
        for selector in input_selectors:
            elements = await self.page.query_selector_all(selector)
            if elements:
                input_element = elements[-1]
                break
        
        if not input_element:
            raise RuntimeError("Could not find input element for Kimi")
        
        await input_element.fill(question)
        await self.page.wait_for_timeout(1000)
        
        # Find and click the send button
        button_selectors = [
            ".send-btn",
            "button[type='submit']",
            ".chat-send",
            ".submit-button"
        ]
        
        button_clicked = False
        for selector in button_selectors:
            button = await self.page.query_selector(selector)
            if button:
                await button.click()
                button_clicked = True
                break
        
        if not button_clicked:
            await input_element.press("Enter")
        
        # Wait for response generation
        await self.page.wait_for_timeout(10000)
        
        # Extract response content
        answer_selectors = [
            ".answer-content:last-child",
            ".message-answer:last-child",
            ".chat-response:last-child .content",
            ".response-text:last-child"
        ]
        
        for selector in answer_selectors:
            answer_element = await self.page.query_selector(selector)
            if answer_element:
                answer = await answer_element.text_content()
                if answer and answer.strip():
                    return answer.strip()
        
        return "No answer found from Kimi - please check the website structure"