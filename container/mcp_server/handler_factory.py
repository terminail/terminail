"""
Factory for creating AI handlers
"""

from typing import Optional
from playwright.async_api import Page
from .ai_handler_base import AIHandler

# Import handlers
from .handlers.deepseek_handler import DeepSeekHandler
from .handlers.doubao_handler import DoubaoHandler
from .handlers.qwen_handler import QwenHandler
from .handlers.yuanbao_handler import YuanbaoHandler
from .handlers.ernie_handler import ErnieHandler
from .handlers.kimi_handler import KimiHandler
from .handlers.tongyi_wanxiang_handler import TongyiWanxiangHandler
from .handlers.wenxin_yiyan_handler import WenxinYiyanHandler
from .handlers.chatgpt_handler import ChatgptHandler
from .handlers.claude_handler import ClaudeHandler
from .handlers.gemini_handler import GeminiHandler
from .handlers.copilot_handler import CopilotHandler
from .handlers.perplexity_handler import PerplexityHandler
from .handlers.grok_handler import GrokHandler
from .handlers.pi_handler import PiHandler
from .handlers.quark_handler import QuarkHandler
from .handlers.huggingchat_handler import HuggingchatHandler
from .handlers.leonardo_ai_handler import LeonardoAiHandler

def create_ai_handler(ai_service: str, page: Page) -> Optional[AIHandler]:
    """Factory function to create AI handler based on service name"""
    handlers = {
        "deepseek": DeepSeekHandler,
        "doubao": DoubaoHandler,
        "qwen": QwenHandler,
        "yuanbao": YuanbaoHandler,
        "ernie": ErnieHandler,
        "kimi": KimiHandler,
        "tongyi-wanxiang": TongyiWanxiangHandler,
        "wenxin-yiyan": WenxinYiyanHandler,
        "chatgpt": ChatgptHandler,
        "claude": ClaudeHandler,
        "gemini": GeminiHandler,
        "copilot": CopilotHandler,
        "perplexity": PerplexityHandler,
        "grok": GrokHandler,
        "pi": PiHandler,
        "quark": QuarkHandler,
        "huggingchat": HuggingchatHandler,
        "leonardo-ai": LeonardoAiHandler
    }
    
    handler_class = handlers.get(ai_service.lower())
    if handler_class:
        return handler_class(page)
    
    return None