"""
Utility functions for the MCP server
"""

import logging
import os
import yaml
from typing import Dict, List, Optional
from .ai_service import AIService

logger = logging.getLogger("terminail-mcp-utils")

def load_ai_urls() -> Dict[str, str]:
    """Load AI URLs from container configuration"""
    ai_urls = {
        "deepseek": "https://chat.deepseek.com",
        "qwen": "https://qianwen.aliyun.com/chat", 
        "doubao": "https://www.doubao.com/chat"
    }
    
    # Load from container configuration file
    config_path = os.path.join(os.path.dirname(__file__), '..', 'config.yaml')
    if os.path.exists(config_path):
        try:
            with open(config_path, 'r') as f:
                config = yaml.safe_load(f)
                if 'ai_services' in config:
                    # Update ai_urls with configured services
                    ai_urls = {}
                    for service in config['ai_services']:
                        if service.get('enabled', True):
                            ai_urls[service['id']] = service['url']
        except Exception as e:
            logger.warning(f"Failed to load AI services configuration: {e}")
    
    return ai_urls

def load_ai_services() -> List[AIService]:
    """Load AI services from container configuration"""
    ai_services = []
    
    # Load from container configuration file
    config_path = os.path.join(os.path.dirname(__file__), '..', 'config.yaml')
    if os.path.exists(config_path):
        try:
            with open(config_path, 'r') as f:
                config = yaml.safe_load(f)
                if 'ai_services' in config:
                    # Create AIService objects for configured services
                    for service_data in config['ai_services']:
                        if service_data.get('enabled', True):
                            ai_service = AIService(
                                id=service_data['id'],
                                name=service_data['name'],
                                url=service_data['url'],
                                category=service_data['category'],
                                enabled=service_data.get('enabled', True),
                                sequence=service_data.get('sequence', 0),
                                icon=service_data.get('icon'),
                                priority=service_data.get('priority'),
                                authentication_required=service_data.get('authentication_required'),
                                capabilities=service_data.get('capabilities')
                            )
                            ai_services.append(ai_service)
        except Exception as e:
            logger.warning(f"Failed to load AI services configuration: {e}")
    
    return ai_services

def get_ai_service_by_id(service_id: str) -> Optional[AIService]:
    """Get AI service by ID from container configuration"""
    ai_services = load_ai_services()
    for service in ai_services:
        if service.id == service_id:
            return service
    return None