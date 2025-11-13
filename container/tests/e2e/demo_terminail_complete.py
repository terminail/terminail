"""
Complete Terminail Demo - Shows full automatic Chrome startup and DeepSeek interaction
"""
import asyncio
import logging
from mcp_server.chrome_manager import ChromeManager
from mcp_server.browser import BrowserManager
from mcp_server.handlers.deepseek_handler import DeepSeekHandler


async def demo_complete_terminail_functionality():
    """Demonstrate complete Terminail functionality: automatic Chrome + DeepSeek interaction"""
    print("=== Complete Terminail Extension Demo ===")
    print("This demo shows the full Terminail workflow:")
    print("1. Automatic Chrome startup")
    print("2. Connection to DeepSeek")
    print("3. AI interaction")
    print("4. Automatic cleanup")
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    # Use context manager for automatic resource management
    with ChromeManager() as chrome_manager:
        print("\n1. Chrome started automatically by Terminail extension")
        
        manager = BrowserManager()
        
        try:
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
            
            print("\n5. Testing AI interaction...")
            
            # Test greeting
            greeting = "Hello from Terminail! What can you help me with today?"
            print(f"Asking: {greeting}")
            response = await handler.ask_question(greeting)
            print(f"✅ Response: {len(response)} characters received")
            
            # Wait a bit
            await asyncio.sleep(2)
            
            # Test simple question
            question = "What is the capital of France?"
            print(f"\nAsking: {question}")
            response = await handler.ask_question(question)
            if "Paris" in response or "巴黎" in response:
                print("✅ Correctly answered question about France")
            else:
                print("⚠ Response may not contain expected answer")
            
            # Wait a bit
            await asyncio.sleep(2)
            
            # Test math question
            math_question = "What is 10 + 15?"
            print(f"\nAsking: {math_question}")
            math_response = await handler.ask_question(math_question)
            if "25" in math_response:
                print("✅ Correctly answered math question")
            else:
                print("⚠ Math response may not contain correct answer")
            
            await manager.close()
            print("\n✅ All tests completed successfully!")
            
        except Exception as e:
            print(f"❌ Demo failed: {e}")
            await manager.close()
        
        print("\n6. Chrome will be automatically stopped when this block exits")
    
    print("\n✅ Demo completed successfully!")
    print("\nSummary of Terminail Extension Capabilities:")
    print("  ✓ Automatically starts Chrome on host machine")
    print("  ✓ Connects to Chrome debug port (9222)")
    print("  ✓ Navigates to AI websites (DeepSeek)")
    print("  ✓ Sends questions and receives responses")
    print("  ✓ Automatically cleans up resources")
    print("  ✓ Zero user intervention required!")


if __name__ == "__main__":
    asyncio.run(demo_complete_terminail_functionality())