"""
DeepSeek Logged-in E2E tests - Tests with manual login and question answering
"""
import pytest
import asyncio
import time
from unittest.mock import AsyncMock

from mcp_server.browser import BrowserManager
from mcp_server.handlers.deepseek_handler import DeepSeekHandler


class TestDeepSeekLoggedInE2E:
    """E2E tests for DeepSeek AI with manual login and question answering"""
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_manual_login_and_question_answering(self):
        """Test manual login and question answering workflow"""
        print("\n=== DeepSeek Manual Login and Question Answering Test ===")
        print("Please follow these steps:")
        print("1. Log in to DeepSeek in the Chrome browser that's already open")
        print("2. Make sure you're on the DeepSeek chat page")
        print("3. Press Enter in this terminal when you're logged in and ready")
        
        # Wait for user to press Enter
        input("Press Enter when you're logged in to DeepSeek: ")
        
        manager = BrowserManager()
        
        try:
            # Connect to the browser
            print("Connecting to Chrome browser...")
            await manager.connect(debug_port=9222)
            
            # Verify connection
            assert manager.is_connected() is True
            assert manager.browser is not None
            assert manager.page is not None
            print("✓ Successfully connected to browser")
            
            # Verify we're on DeepSeek
            current_url = manager.page.url
            print(f"Current URL: {current_url}")
            assert "deepseek" in current_url.lower()
            print("✓ Confirmed we're on DeepSeek website")
            
            # Create DeepSeek handler
            handler = DeepSeekHandler(manager.page)
            print("✓ DeepSeek handler created")
            
            # Test asking a question
            test_question = "What is the capital of France?"
            print(f"\nAsking question: '{test_question}'")
            
            # Ask the question
            response = await handler.ask_question(test_question)
            
            # Verify we got a response
            assert response is not None
            assert isinstance(response, str)
            assert len(response) > 0
            print(f"✓ Received response: '{response}'")
            
            # Additional validation
            assert "Browser page not available" not in response
            assert "Could not find input element" not in response
            assert "No answer found" not in response
            print("✓ Response validation passed")
            
            await manager.close()
            print("✓ Browser connection closed")
            
            print("\n=== Test Completed Successfully ===")
            print("The question was sent to DeepSeek and a response was received!")
            
        except Exception as e:
            # Clean up on failure
            await manager.close()
            pytest.fail(f"Manual login and question answering test failed: {e}")
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_interactive_deepseek_session(self):
        """Test interactive DeepSeek session with multiple questions"""
        print("\n=== DeepSeek Interactive Session Test ===")
        print("Please follow these steps:")
        print("1. Make sure you're logged in to DeepSeek")
        print("2. Press Enter in this terminal when you're ready")
        
        # Wait for user to press Enter
        input("Press Enter when you're ready to start the interactive session: ")
        
        manager = BrowserManager()
        
        try:
            # Connect to the browser
            print("Connecting to Chrome browser...")
            await manager.connect(debug_port=9222)
            
            # Verify connection
            assert manager.is_connected() is True
            assert manager.page is not None
            print("✓ Successfully connected to browser")
            
            # Create DeepSeek handler
            handler = DeepSeekHandler(manager.page)
            print("✓ DeepSeek handler created")
            
            # Test multiple questions
            test_questions = [
                "Hello, what can you help me with?",
                "What is 2+2?",
                "Tell me a short joke"
            ]
            
            for i, question in enumerate(test_questions, 1):
                print(f"\n--- Question {i}: '{question}' ---")
                
                # Ask the question
                response = await handler.ask_question(question)
                
                # Verify we got a response
                assert response is not None
                assert isinstance(response, str)
                assert len(response) > 0
                print(f"✓ Response: '{response}'")
                
                # Wait a bit between questions
                await asyncio.sleep(2)
            
            await manager.close()
            print("\n✓ Interactive session completed successfully")
            
        except Exception as e:
            # Clean up on failure
            await manager.close()
            pytest.fail(f"Interactive DeepSeek session test failed: {e}")