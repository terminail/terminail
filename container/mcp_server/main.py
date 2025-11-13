#!/usr/bin/env python3
"""
TerminAI MCP Server main program
Web server based on FastAPI, providing browser automation functionality
"""

import asyncio
import logging
import os
import yaml
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .browser import BrowserManager
from .utils import load_ai_urls, load_ai_services

# Load configuration
CONFIG_PATH = os.path.join(os.path.dirname(__file__), '..', 'config.yaml')
config = {}
if os.path.exists(CONFIG_PATH):
    with open(CONFIG_PATH, 'r') as f:
        config = yaml.safe_load(f) or {}

# Configure logging
log_level = config.get('logging', {}).get('level', 'INFO')
log_format = config.get('logging', {}).get('format', '%(asctime)s - %(name)s - %(levelname)s - %(message)s')

logging.basicConfig(
    level=getattr(logging, log_level.upper()),
    format=log_format
)
logger = logging.getLogger("terminai-mcp-server")

# Global browser manager instance
browser_manager: Optional[BrowserManager] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle management"""
    global browser_manager
    
    # Initialize browser manager on startup
    browser_manager = BrowserManager()
    logger.info("MCP Server starting up...")
    
    yield
    
    # Clean up resources on shutdown
    if browser_manager:
        await browser_manager.close()
    logger.info("MCP Server shutting down...")

# Create FastAPI application
app = FastAPI(
    title="TerminAI MCP Server",
    description="MCP Server for browser automation in TerminAI VS Code Extension",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "TerminAI MCP Server",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    browser_status = "connected" if browser_manager and browser_manager.is_connected() else "disconnected"
    debug_port = browser_manager.debug_port if browser_manager and browser_manager.debug_port else 9222
    
    return {
        "status": "healthy",
        "browser": browser_status,
        "debug_port": debug_port,
        "timestamp": asyncio.get_event_loop().time()
    }

@app.post("/init")
async def init_browser(request: dict):
    """Initialize browser connection"""
    if not browser_manager:
        raise HTTPException(status_code=500, detail="Browser manager not initialized")
    
    debug_port = request.get("debug_port", 9222)
    auto_start = request.get("auto_start", False)
    
    try:
        # If auto_start is enabled, try to start Chrome automatically
        if auto_start:
            started = await browser_manager.start_chrome_automatically()
            if not started:
                logger.warning("Failed to start Chrome automatically, trying to connect to existing instance")
        
        await browser_manager.connect(debug_port)
        return {"success": True, "message": "Browser connected successfully"}
    except Exception as e:
        logger.error(f"Failed to connect to browser: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
async def ask_question(ai: str, question: str):
    """Ask question to the specified AI"""
    if not browser_manager or not browser_manager.is_connected():
        raise HTTPException(status_code=400, detail="Browser not connected")
    
    try:
        answer = await browser_manager.ask_ai(ai, question)
        return {"success": True, "answer": answer}
    except Exception as e:
        logger.error(f"Failed to ask question: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ais")
async def get_supported_ais():
    """Get supported AI list"""
    # Get AI services from utility function
    ai_services = load_ai_services()
    
    # Convert AIService objects to dictionaries for JSON serialization
    ai_list = []
    for service in ai_services:
        ai_list.append({
            "id": service.id,
            "name": service.name,
            "url": service.url,
            "category": service.category,
            "enabled": service.enabled,
            "sequence": service.sequence,
            "icon": service.icon,
            "priority": service.priority,
            "authentication_required": service.authentication_required,
            "capabilities": service.capabilities
        })
    
    default_ai = ai_list[0]["id"] if ai_list else "deepseek"
    
    return {
        "ais": ai_list,
        "default": default_ai
    }

@app.post("/switch")
async def switch_ai(request: dict):
    """Switch to the specified AI"""
    if not browser_manager or not browser_manager.is_connected():
        raise HTTPException(status_code=400, detail="Browser not connected")
    
    ai = request.get("ai")
    if not ai:
        raise HTTPException(status_code=400, detail="AI parameter is required")
    
    try:
        await browser_manager.switch_ai(ai)
        return {"success": True, "message": f"Switched to {ai}"}
    except Exception as e:
        logger.error(f"Failed to switch AI: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def main():
    """Main function"""
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)

if __name__ == "__main__":
    main()