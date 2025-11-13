"""
Debug script to inspect DeepSeek page structure
"""
import asyncio
from mcp_server.browser import BrowserManager
from mcp_server.handlers.deepseek_handler import DeepSeekHandler


async def debug_deepseek_page():
    """Debug DeepSeek page structure"""
    print("=== DeepSeek Page Debug ===")
    
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
        
        # Check current URL
        current_url = manager.page.url
        print(f"Current URL: {current_url}")
        
        # Take a screenshot for debugging
        await manager.page.screenshot(path="deepseek_debug.png", full_page=True)
        print("✓ Screenshot saved as deepseek_debug.png")
        
        # Get page title
        title = await manager.page.title()
        print(f"Page title: {title}")
        
        # List all textareas and input fields
        print("\n--- Textareas and Input Fields ---")
        textareas = await manager.page.query_selector_all("textarea")
        inputs = await manager.page.query_selector_all("input[type='text']")
        contenteditable = await manager.page.query_selector_all("[contenteditable='true']")
        
        print(f"Found {len(textareas)} textareas")
        print(f"Found {len(inputs)} text inputs")
        print(f"Found {len(contenteditable)} contenteditable elements")
        
        # Try to identify the chat input
        for i, element in enumerate(textareas):
            placeholder = await element.get_attribute("placeholder")
            id_attr = await element.get_attribute("id")
            class_attr = await element.get_attribute("class")
            print(f"Textarea {i}: id='{id_attr}', class='{class_attr}', placeholder='{placeholder}'")
        
        for i, element in enumerate(inputs):
            placeholder = await element.get_attribute("placeholder")
            id_attr = await element.get_attribute("id")
            class_attr = await element.get_attribute("class")
            print(f"Input {i}: id='{id_attr}', class='{class_attr}', placeholder='{placeholder}'")
        
        # List all buttons
        print("\n--- Buttons ---")
        buttons = await manager.page.query_selector_all("button")
        print(f"Found {len(buttons)} buttons")
        
        for i, element in enumerate(buttons):
            text_content = await element.text_content()
            type_attr = await element.get_attribute("type")
            class_attr = await element.get_attribute("class")
            data_testid = await element.get_attribute("data-testid")
            print(f"Button {i}: type='{type_attr}', class='{class_attr}', data-testid='{data_testid}', text='{text_content}'")
        
        # Look for specific DeepSeek elements
        print("\n--- DeepSeek Specific Elements ---")
        chat_input = await manager.page.query_selector("#chat-input")
        prompt_textarea = await manager.page.query_selector("#prompt-textarea")
        send_button = await manager.page.query_selector("[data-testid='send-button']")
        
        print(f"#chat-input: {'Found' if chat_input else 'Not found'}")
        print(f"#prompt-textarea: {'Found' if prompt_textarea else 'Not found'}")
        print(f"[data-testid='send-button']: {'Found' if send_button else 'Not found'}")
        
        # Create handler and try to ask a question
        print("\n--- Testing Question Asking ---")
        handler = DeepSeekHandler(manager.page)
        
        # Try to find the input element using handler logic
        input_selectors = [
            "#chat-input",
            "textarea",
            "#prompt-textarea",
            ".chat-textarea",
            "[contenteditable='true']",
            "input[type='text']"
        ]
        
        input_element = None
        for selector in input_selectors:
            elements = await manager.page.query_selector_all(selector)
            if elements:
                print(f"Found {len(elements)} elements with selector '{selector}'")
                input_element = elements[-1]
                break
        
        if input_element:
            print("✓ Found input element")
            # Try to fill it
            await input_element.fill("Hello DeepSeek!")
            print("✓ Filled input element")
            
            # Try to find send button
            button_selectors = [
                "button[type='submit']",
                ".send-button",
                "[data-testid='send-button']",
                ".chat-send-button",
                ".submit-button"
            ]
            
            button_clicked = False
            for selector in button_selectors:
                button = await manager.page.query_selector(selector)
                if button:
                    print(f"Found send button with selector '{selector}'")
                    # await button.click()
                    button_clicked = True
                    break
            
            if not button_clicked:
                print("Trying to press Enter in input field")
                await input_element.press("Enter")
            
            # Wait for response
            print("Waiting for response...")
            await manager.page.wait_for_timeout(5000)
            
            # Take another screenshot after sending
            await manager.page.screenshot(path="deepseek_after_question.png", full_page=True)
            print("✓ Screenshot saved as deepseek_after_question.png")
        else:
            print("✗ Could not find input element")
        
        await manager.close()
        print("\n✓ Debug session completed")
        
    except Exception as e:
        print(f"Debug session failed: {e}")
        await manager.close()


if __name__ == "__main__":
    asyncio.run(debug_deepseek_page())