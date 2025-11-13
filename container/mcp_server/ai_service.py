"""
Data class for AI service information
"""

from dataclasses import dataclass
from typing import Optional

@dataclass
class AIService:
    """Represents an AI service configuration"""
    id: str
    name: str
    url: str
    category: str
    enabled: bool
    sequence: int
    # Optional fields that may be present in some configurations
    icon: Optional[str] = None
    priority: Optional[int] = None
    authentication_required: Optional[bool] = None
    capabilities: Optional[list] = None