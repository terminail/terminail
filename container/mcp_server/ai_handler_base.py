"""
Base class for AI-specific handlers
"""

from abc import ABC, abstractmethod
from typing import Optional
from playwright.async_api import Page

class AIHandler(ABC):
    """Base class for AI-specific handlers"""
    
    def __init__(self, page: Page):
        self.page = page
    
    @abstractmethod
    async def ask_question(self, question: str) -> str:
        """Ask a question to the AI service and return the response"""
        pass
    
    @abstractmethod
    async def navigate_to_service(self) -> None:
        """Navigate to the AI service website"""
        pass