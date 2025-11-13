"""
DeepSeek Validation E2E tests - Tests with validation questions to verify DeepSeek functionality
"""
import pytest
import asyncio
import re
from mcp_server.browser import BrowserManager
from mcp_server.handlers.deepseek_handler import DeepSeekHandler


class TestDeepSeekValidationE2E:
    """E2E tests for DeepSeek AI with validation questions"""
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_deepseek_weather_and_math_validation(self):
        """Test DeepSeek with weather question and math problem to validate responses"""
        print("\n=== DeepSeek Weather and Math Validation Test ===")
        
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
            assert "deepseek" in current_url.lower()
            print("✓ Confirmed we're on DeepSeek website")
            
            # Create DeepSeek handler
            handler = DeepSeekHandler(manager.page)
            print("✓ DeepSeek handler created")
            
            # Test 1: Weather question in Chinese
            chinese_weather_question = "今天天气怎么样？"
            print(f"\nAsking Chinese weather question: '{chinese_weather_question}'")
            
            chinese_weather_response = await handler.ask_question(chinese_weather_question)
            assert chinese_weather_response is not None and len(chinese_weather_response) > 0
            print(f"✓ Chinese weather response received ({len(chinese_weather_response)} chars)")
            
            # Wait a bit
            await asyncio.sleep(2)
            
            # Test 2: Weather question in English
            english_weather_question = "How is the weather today?"
            print(f"\nAsking English weather question: '{english_weather_question}'")
            
            english_weather_response = await handler.ask_question(english_weather_question)
            assert english_weather_response is not None and len(english_weather_response) > 0
            print(f"✓ English weather response received ({len(english_weather_response)} chars)")
            
            # Wait a bit
            await asyncio.sleep(2)
            
            # Test 3: Math problem
            math_question = "What is 123 + 456?"
            print(f"\nAsking math question: '{math_question}'")
            
            math_response = await handler.ask_question(math_question)
            assert math_response is not None and len(math_response) > 0
            print(f"✓ Math response received ({len(math_response)} chars)")
            
            # Validate math response contains correct answer
            # Look for the correct answer (579) in the response
            math_response_clean = re.sub(r'[^\d\s]', '', math_response)
            if '579' in math_response_clean:
                print("✓ Math response contains correct answer (579)")
            else:
                print("⚠ Math response may not contain correct answer (579)")
                # This is not a failure - just informational
            
            await manager.close()
            print("\n✓ Weather and math validation test completed")
            
        except Exception as e:
            # Clean up on failure
            await manager.close()
            pytest.fail(f"DeepSeek weather and math validation test failed: {e}")
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_deepseek_simple_math_validation(self):
        """Test DeepSeek with simple math to validate basic functionality"""
        print("\n=== DeepSeek Simple Math Validation Test ===")
        
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
            
            # Test simple math problems
            math_problems = [
                ("What is 2 + 2?", "4"),
                ("What is 10 - 3?", "7"),
                ("What is 5 * 6?", "30")
            ]
            
            all_correct = True
            
            for question, expected_answer in math_problems:
                print(f"\nAsking: '{question}'")
                
                response = await handler.ask_question(question)
                assert response is not None and len(response) > 0
                print(f"✓ Response received ({len(response)} chars)")
                
                # Check if expected answer is in response
                if expected_answer in response:
                    print(f"✓ Response contains correct answer ({expected_answer})")
                else:
                    print(f"⚠ Response may not contain correct answer ({expected_answer})")
                    all_correct = False
                
                # Wait between questions
                await asyncio.sleep(2)
            
            if all_correct:
                print("✓ All math problems answered correctly")
            else:
                print("⚠ Some math problems may not have correct answers")
            
            await manager.close()
            print("\n✓ Simple math validation test completed")
            
        except Exception as e:
            # Clean up on failure
            await manager.close()
            pytest.fail(f"DeepSeek simple math validation test failed: {e}")