"""
Handler for Perplexity AI
"""

from playwright.async_api import Page
from ..ai_handler_base import AIHandler
from ..utils import get_ai_service_by_id

class PerplexityHandler(AIHandler):
    """Handler for Perplexity AI"""
    
    def __init__(self, page: Page):
        super().__init__(page)
        self.service = get_ai_service_by_id("perplexity")
    
    async def navigate_to_service(self) -> None:
        """Navigate to Perplexity website"""
        if not self.page:
            raise RuntimeError("Browser page not available")
        
        # Get URL from configuration
        url = self.service.url if self.service else "https://perplexity.ai"
        await self.page.goto(url)
        await self.page.wait_for_timeout(3000)
    
    async def ask_question(self, question: str) -> str:
        """Ask a question to Perplexity and return the response"""
        if not self.page:
            raise RuntimeError("Browser page not available")
            
        # Find input box and input question
        input_selectors = [
            "textarea[placeholder*='Ask anything']",
            ".textarea-container textarea",
            ".input-textarea",
            "textarea"
        ]
        
        input_element = None
        for selector in input_selectors:
            elements = await self.page.query_selector_all(selector)
            if elements:
                # Select the last one (usually the latest input box)
                input_element = elements[-1]
                break
        
        if not input_element:
            raise RuntimeError("Could not find input element for Perplexity")
        
        await input_element.fill(question)
        await self.page.wait_for_timeout(1000)
        
        # Find and click the send button
        button_selectors = [
            "button[type='submit']",
            ".send-button",
            "button[aria-label*='Submit']",
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
            # Try pressing Enter in the input field
            await input_element.press("Enter")
        
        # Wait for response generation
        await self.page.wait_for_timeout(10000)
        
        # Extract response content
        answer_selectors = [
            ".response-content",
            ".answer-text",
            ".perplexity-response",
            ".markdown"
        ]
        
        for selector in answer_selectors:
            answer_elements = await self.page.query_selector_all(selector)
            if answer_elements:
                answers = []
                for element in answer_elements:
                    answer = await element.text_content()
                    if answer and answer.strip():
                        answers.append(answer.strip())
                if answers:
                    return "\n".join(answers)
        
        return "No answer found from Perplexity - please check the website structure"