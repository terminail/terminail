"""
Real DeepSeek interaction test - Works with actual DeepSeek page structure
"""
import asyncio
import time
from mcp_server.browser import BrowserManager
from mcp_server.handlers.deepseek_handler import DeepSeekHandler


async def test_real_deepseek_interaction():
    """Test real interaction with DeepSeek"""
    print("=== Real DeepSeek Interaction Test ===")
    
    manager = BrowserManager()
    
    try:
        # Connect to the browser
        print("Connecting to Chrome browser...")
        await manager.connect(debug_port=9222)
        
        # Verify connection
        if not manager.is_connected() or manager.page is None:
            print("Failed to connect to browser")
            return
        
        print("✓ Successfully connected to browser")
        
        # Create handler
        handler = DeepSeekHandler(manager.page)
        print("✓ DeepSeek handler created")
        
        # Test asking a question
        test_question = "What is the capital of France?"
        print(f"\nAsking question: '{test_question}'")
        
        # Ask the question
        response = await handler.ask_question(test_question)
        
        print(f"Response: '{response}'")
        
        # Wait a bit to see the result in the browser
        print("\nWaiting 10 seconds so you can see the result in the browser...")
        await asyncio.sleep(10)
        
        await manager.close()
        print("\n✓ Test completed")
        
    except Exception as e:
        print(f"Test failed: {e}")
        await manager.close()


if __name__ == "__main__":
    asyncio.run(test_real_deepseek_interaction())