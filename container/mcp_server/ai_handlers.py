"""
AI-specific handlers for different AI services
Each AI service has its own DOM structure and selectors
"""

# This file is now deprecated. Please use the individual handler files in the handlers/ directory
# and the handler_factory.py for creating handlers.

from .ai_handler_base import AIHandler
from .handler_factory import create_ai_handler

__all__ = ['AIHandler', 'create_ai_handler']
