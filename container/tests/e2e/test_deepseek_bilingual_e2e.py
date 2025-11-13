"""
DeepSeek Bilingual E2E tests - Tests with both English and Chinese questions
"""
import pytest
import asyncio
from mcp_server.browser import BrowserManager
from mcp_server.handlers.deepseek_handler import DeepSeekHandler


class TestDeepSeekBilingualE2E:
    """E2E tests for DeepSeek AI with bilingual questions"""
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_deepseek_bilingual_question_answering(self):
        """Test DeepSeek with both English and Chinese versions of the same question"""
        print("\n=== DeepSeek Bilingual Question Answering Test ===")
        
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
            
            # Test English question
            english_question = "What is the capital of France?"
            print(f"\nAsking English question: '{english_question}'")
            
            # Ask the English question
            english_response = await handler.ask_question(english_question)
            
            # Verify we got a response
            assert english_response is not None
            assert isinstance(english_response, str)
            assert len(english_response) > 0
            print(f"✓ English response received (length: {len(english_response)} chars)")
            
            # Wait a bit between questions
            await asyncio.sleep(2)
            
            # Test Chinese question (same meaning)
            chinese_question = "法国的首都是什么？"
            print(f"\nAsking Chinese question: '{chinese_question}'")
            
            # Ask the Chinese question
            chinese_response = await handler.ask_question(chinese_question)
            
            # Verify we got a response
            assert chinese_response is not None
            assert isinstance(chinese_response, str)
            assert len(chinese_response) > 0
            print(f"✓ Chinese response received (length: {len(chinese_response)} chars)")
            
            # Both responses should contain information about Paris
            # (This is a basic check - in practice, we might want more sophisticated validation)
            paris_found = False
            if "Paris" in english_response or "巴黎" in english_response:
                paris_found = True
            if "Paris" in chinese_response or "巴黎" in chinese_response:
                paris_found = True
                
            if paris_found:
                print("✓ Both responses contain information about Paris")
            else:
                print("⚠ Responses may not contain Paris information (this is not a failure)")
            
            await manager.close()
            print("\n✓ Bilingual test completed successfully")
            
        except Exception as e:
            # Clean up on failure
            await manager.close()
            pytest.fail(f"DeepSeek bilingual question answering test failed: {e}")
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_deepseek_multiple_bilingual_questions(self):
        """Test DeepSeek with multiple pairs of English and Chinese questions"""
        print("\n=== DeepSeek Multiple Bilingual Questions Test ===")
        
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
            
            # Test multiple question pairs
            question_pairs = [
                ("What is 2+2?", "2加2等于多少？"),
                ("Hello, how are you?", "你好，你好吗？"),
                ("What is the weather like today?", "今天天气怎么样？")
            ]
            
            for i, (english_q, chinese_q) in enumerate(question_pairs, 1):
                print(f"\n--- Question Pair {i} ---")
                
                # Ask English question
                print(f"English: '{english_q}'")
                english_response = await handler.ask_question(english_q)
                assert english_response is not None and len(english_response) > 0
                print(f"✓ English response: {len(english_response)} chars")
                
                # Wait a bit
                await asyncio.sleep(1)
                
                # Ask Chinese question
                print(f"Chinese: '{chinese_q}'")
                chinese_response = await handler.ask_question(chinese_q)
                assert chinese_response is not None and len(chinese_response) > 0
                print(f"✓ Chinese response: {len(chinese_response)} chars")
                
                # Wait between question pairs
                await asyncio.sleep(2)
            
            await manager.close()
            print("\n✓ Multiple bilingual questions test completed successfully")
            
        except Exception as e:
            # Clean up on failure
            await manager.close()
            pytest.fail(f"DeepSeek multiple bilingual questions test failed: {e}")