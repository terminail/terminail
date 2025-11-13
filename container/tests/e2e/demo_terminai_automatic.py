"""
TerminAI Automatic Chrome Demo - Complete demonstration of TerminAI's automatic Chrome functionality
"""
import asyncio
import logging
from mcp_server.browser import BrowserManager
from mcp_server.handlers.deepseek_handler import DeepSeekHandler


async def demo_terminai_automatic_functionality():
    """Demonstrate TerminAI's automatic Chrome startup and DeepSeek interaction"""
    print("=== TerminAI Automatic Chrome Demo ===")
    print("This demo shows how TerminAI can automatically start Chrome and interact with DeepSeek")
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    manager = BrowserManager()
    
    try:
        print("\n1. Starting Chrome automatically...")
        success = await manager.start_chrome_automatically()
        if not success:
            print("❌ Failed to start Chrome automatically")
            return
        
        print("✅ Chrome started automatically!")
        
        print("\n2. Connecting to Chrome browser...")
        await manager.connect(debug_port=9222)
        
        if not manager.is_connected() or manager.page is None:
            print("❌ Failed to connect to browser")
            return
        
        print("✅ Successfully connected to browser")
        
        print("\n3. Navigating to DeepSeek...")
        await manager.page.goto("https://chat.deepseek.com")
        await asyncio.sleep(3)
        
        current_url = manager.page.url
        if "deepseek" not in current_url.lower():
            print("❌ Failed to navigate to DeepSeek")
            return
        
        print("✅ Successfully navigated to DeepSeek")
        
        print("\n4. Creating DeepSeek handler...")
        handler = DeepSeekHandler(manager.page)
        print("✅ DeepSeek handler created")
        
        print("\n5. Asking a question to DeepSeek...")
        question = "Hello! This is a test from TerminAI. What can you help me with?"
        response = await handler.ask_question(question)
        
        if not response or len(response) == 0:
            print("❌ Failed to get response from DeepSeek")
            return
        
        print(f"✅ Got response from DeepSeek ({len(response)} characters)")
        print(f"   First 200 characters: {response[:200]}...")
        
        print("\n6. Asking a math question...")
        math_question = "What is 123 + 456?"
        math_response = await handler.ask_question(math_question)
        
        if "579" in math_response:
            print("✅ Math question answered correctly (123 + 456 = 579)")
        else:
            print("⚠ Math question response may not contain correct answer")
        
        await manager.close()
        print("\n✅ Demo completed successfully!")
        print("\nSummary:")
        print("  ✓ TerminAI automatically started Chrome")
        print("  ✓ Connected to Chrome with debug port")
        print("  ✓ Navigated to DeepSeek website")
        print("  ✓ Sent questions to DeepSeek")
        print("  ✓ Received responses from DeepSeek")
        print("  ✓ All functionality working properly")
        
    except Exception as e:
        print(f"❌ Demo failed: {e}")
        await manager.close()


if __name__ == "__main__":
    asyncio.run(demo_terminai_automatic_functionality())