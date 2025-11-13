const { test, expect } = require('@playwright/test');

/**
 * DeepSeek AI Service E2E Tests
 * Tests the core functionality of interacting with DeepSeek AI website
 * through cd and qi commands
 */

test.describe('DeepSeek AI Service Tests', () => {
    let page;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;
        // Set up test environment - using simulated HTML interface
        await page.goto('http://localhost:3000');
        // Wait for page to load
        await page.waitForTimeout(1000);
        
        // Ensure we start with DeepSeek service
        const deepseekButton = await page.$('.service-btn[data-service="deepseek"]');
        const isActive = await deepseekButton.getAttribute('class');
        if (!isActive?.includes('active')) {
            await deepseekButton.click();
            await page.waitForTimeout(500);
        }
    });

    test('should switch to deepseek AI service using cd command', async () => {
        // Switch to another service first
        const openaiButton = await page.$('.service-btn[data-service="openai"]');
        await openaiButton.click();
        await page.waitForTimeout(500);
        
        // Verify OpenAI is active
        const openaiActive = await openaiButton.getAttribute('class');
        expect(openaiActive).toContain('active');
        
        // Switch back to DeepSeek using cd command
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('cd deepseek');
        await page.keyboard.press('Enter');
        
        // Wait for service switch
        await page.waitForTimeout(1500);
        
        // Verify DeepSeek is active
        const deepseekButton = await page.$('.service-btn[data-service="deepseek"]');
        const deepseekActive = await deepseekButton.getAttribute('class');
        expect(deepseekActive).toContain('active');
        
        // Verify service indicator shows DeepSeek
        const serviceIndicator = await page.textContent('.service-indicator');
        expect(serviceIndicator).toContain('DeepSeek');
    });

    test('should execute qi command with deepseek AI service', async () => {
        // Execute a simple query to DeepSeek
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('qi What is the capital of France?');
        await page.keyboard.press('Enter');
        
        // Wait for AI response
        await page.waitForTimeout(3000);
        
        // Check if response contains expected content
        const output = await page.textContent('.terminal-output');
        expect(output).toContain('Paris');
        expect(output).toContain('France');
        
        // Verify the response is from DeepSeek
        expect(output).toMatch(/DeepSeek|AI|response/i);
    });

    test('should handle complex qi command with deepseek', async () => {
        // Execute a more complex query
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('qi Explain the concept of machine learning in simple terms');
        await page.keyboard.press('Enter');
        
        // Wait for AI response
        await page.waitForTimeout(4000);
        
        // Check if response contains relevant content
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/machine learning|ML|algorithm|data|training/i);
        
        // Verify response structure
        expect(output?.length).toBeGreaterThan(50); // Reasonable response length
    });

    test('should maintain context across multiple qi commands with deepseek', async () => {
        // First query
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('qi What is Python?');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Second query that builds on context
        await commandInput.focus();
        await page.keyboard.type('qi How is it different from Java?');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Check if responses show contextual understanding
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/Python|Java|programming|language|difference/i);
    });

    test('should handle qi command errors gracefully with deepseek', async () => {
        // Execute empty qi command
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('qi');
        await page.keyboard.press('Enter');
        
        // Wait for error handling
        await page.waitForTimeout(2000);
        
        // Check if appropriate error message appears
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/Please provide a question|Query required|Error/i);
    });

    test('should show loading state during deepseek qi command execution', async () => {
        // Execute qi command
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('qi What is artificial intelligence?');
        await page.keyboard.press('Enter');
        
        // Check loading state immediately after execution
        await page.waitForTimeout(500);
        const loadingOutput = await page.textContent('.terminal-output');
        expect(loadingOutput).toContain('Processing');
        expect(loadingOutput).toContain('DeepSeek');
        
        // Wait for completion and verify loading state is gone
        await page.waitForTimeout(3000);
        const finalOutput = await page.textContent('.terminal-output');
        expect(finalOutput).not.toContain('Processing');
        expect(finalOutput).toContain('artificial intelligence');
    });

    test('should integrate cd and qi commands seamlessly with deepseek', async () => {
        // Switch to another service
        const openaiButton = await page.$('.service-btn[data-service="openai"]');
        await openaiButton.click();
        await page.waitForTimeout(500);
        
        // Switch back to DeepSeek using cd
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('cd deepseek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Execute qi command immediately after switching
        await commandInput.focus();
        await page.keyboard.type('qi Test integration with DeepSeek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Verify successful integration
        const output = await page.textContent('.terminal-output');
        expect(output).toContain('DeepSeek');
        expect(output?.length).toBeGreaterThan(20);
    });
});