import { test, expect, Page } from '@playwright/test';

/**
 * OpenAI AI Service E2E Tests
 * Tests the core functionality of interacting with OpenAI AI website
 * through cd and qi commands
 */

test.describe('OpenAI AI Service Tests', () => {
    let page: Page;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;
        // Set up test environment - using simulated HTML interface
        await page.goto('http://localhost:3000');
        // Wait for page to load
        await page.waitForTimeout(1000);
        
        // Ensure we start with OpenAI service
        const openaiButton = await page.$('.service-btn[data-service="openai"]');
        const deepseekButton = await page.$('.service-btn[data-service="deepseek"]');
        
        // If DeepSeek is active, switch to OpenAI
        const deepseekActive = await deepseekButton!.getAttribute('class');
        if (deepseekActive?.includes('active')) {
            await openaiButton!.click();
            await page.waitForTimeout(500);
        }
    });

    test('should switch to openai AI service using cd command', async () => {
        // Verify we start with OpenAI
        const openaiButton = await page.$('.service-btn[data-service="openai"]');
        const openaiActive = await openaiButton!.getAttribute('class');
        expect(openaiActive).toContain('active');
        
        // Switch to DeepSeek first
        const deepseekButton = await page.$('.service-btn[data-service="deepseek"]');
        await deepseekButton!.click();
        await page.waitForTimeout(500);
        
        // Verify DeepSeek is active
        const deepseekActive = await deepseekButton!.getAttribute('class');
        expect(deepseekActive).toContain('active');
        
        // Switch back to OpenAI using cd command
        const commandInput = await page.$('.command-input');
        await commandInput!.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        
        // Wait for service switch
        await page.waitForTimeout(1500);
        
        // Verify OpenAI is active
        const openaiActiveAfter = await openaiButton!.getAttribute('class');
        expect(openaiActiveAfter).toContain('active');
        
        // Verify service indicator shows OpenAI
        const serviceIndicator = await page.textContent('.service-indicator');
        expect(serviceIndicator).toContain('OpenAI');
    });

    test('should execute qi command with openai AI service', async () => {
        // Execute a simple query to OpenAI
        const commandInput = await page.$('.command-input');
        await commandInput!.focus();
        await page.keyboard.type('qi What is the largest planet in our solar system?');
        await page.keyboard.press('Enter');
        
        // Wait for AI response
        await page.waitForTimeout(3000);
        
        // Check if response contains expected content
        const output = await page.textContent('.terminal-output');
        expect(output).toContain('Jupiter');
        expect(output).toContain('planet');
        
        // Verify the response is from OpenAI
        expect(output).toMatch(/OpenAI|GPT|response/i);
    });

    test('should handle technical qi command with openai', async () => {
        // Execute a technical query
        const commandInput = await page.$('.command-input');
        await commandInput!.focus();
        await page.keyboard.type('qi Explain the difference between supervised and unsupervised learning');
        await page.keyboard.press('Enter');
        
        // Wait for AI response
        await page.waitForTimeout(4000);
        
        // Check if response contains relevant technical content
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/supervised|unsupervised|learning|training|data|labels/i);
        
        // Verify response quality
        expect(output?.length).toBeGreaterThan(100); // Technical responses should be detailed
    });

    test('should maintain conversation context with openai', async () => {
        // First query
        const commandInput = await page.$('.command-input');
        await commandInput!.focus();
        await page.keyboard.type('qi What is React?');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Follow-up query
        await commandInput!.focus();
        await page.keyboard.type('qi How does it compare to Vue?');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Check if responses show contextual understanding
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/React|Vue|JavaScript|framework|comparison/i);
    });

    test('should handle qi command with code generation using openai', async () => {
        // Execute a code generation query
        const commandInput = await page.$('.command-input');
        await commandInput!.focus();
        await page.keyboard.type('qi Write a Python function to calculate factorial');
        await page.keyboard.press('Enter');
        
        // Wait for AI response
        await page.waitForTimeout(4000);
        
        // Check if response contains code
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/def|factorial|return|python|function/i);
        expect(output).toContain('('); // Code syntax
        expect(output).toContain(')'); // Code syntax
    });

    test('should show proper loading states with openai qi commands', async () => {
        // Execute qi command
        const commandInput = await page.$('.command-input');
        await commandInput!.focus();
        await page.keyboard.type('qi What is natural language processing?');
        await page.keyboard.press('Enter');
        
        // Check loading state
        await page.waitForTimeout(500);
        const loadingOutput = await page.textContent('.terminal-output');
        expect(loadingOutput).toContain('Processing');
        expect(loadingOutput).toContain('OpenAI');
        
        // Wait for completion
        await page.waitForTimeout(3500);
        const finalOutput = await page.textContent('.terminal-output');
        expect(finalOutput).not.toContain('Processing');
        expect(finalOutput).toContain('natural language');
    });

    test('should handle service-specific features with openai', async () => {
        // Test OpenAI-specific capabilities
        const commandInput = await page.$('.command-input');
        await commandInput!.focus();
        await page.keyboard.type('qi Generate a creative story about a robot');
        await page.keyboard.press('Enter');
        
        // Wait for creative response
        await page.waitForTimeout(4000);
        
        // Check for creative content
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/robot|story|creative|adventure|character/i);
        expect(output?.length).toBeGreaterThan(150); // Creative responses should be longer
    });

    test('should integrate cd and qi commands seamlessly with openai', async () => {
        // Switch to DeepSeek
        const deepseekButton = await page.$('.service-btn[data-service="deepseek"]');
        await deepseekButton!.click();
        await page.waitForTimeout(500);
        
        // Switch back to OpenAI using cd
        const commandInput = await page.$('.command-input');
        await commandInput!.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Execute qi command
        await commandInput!.focus();
        await page.keyboard.type('qi Test OpenAI integration');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Verify successful integration
        const output = await page.textContent('.terminal-output');
        expect(output).toContain('OpenAI');
        expect(output?.length).toBeGreaterThan(20);
    });
});