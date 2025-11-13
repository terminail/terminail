const { test, expect } = require('@playwright/test');

/**
 * OpenAI AI Service E2E Tests
 * Tests the core functionality of interacting with OpenAI AI website
 * through cd and qi commands
 */

test.describe('OpenAI AI Service Tests', () => {
    let page;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;
        // Set up test environment - using simulated HTML interface
        await page.goto('http://localhost:3000');
        // Wait for page to load
        await page.waitForTimeout(1000);
        
        // Ensure we start with OpenAI service
        const openaiButton = await page.$('.service-btn[data-service="openai"]');
        const isActive = await openaiButton.getAttribute('class');
        if (!isActive?.includes('active')) {
            await openaiButton.click();
            await page.waitForTimeout(500);
        }
    });

    test('should switch to openai AI service using cd command', async () => {
        // Switch to another service first
        const deepseekButton = await page.$('.service-btn[data-service="deepseek"]');
        await deepseekButton.click();
        await page.waitForTimeout(500);
        
        // Verify DeepSeek is active
        const deepseekActive = await deepseekButton.getAttribute('class');
        expect(deepseekActive).toContain('active');
        
        // Switch back to OpenAI using cd command
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        
        // Wait for service switch
        await page.waitForTimeout(1500);
        
        // Verify OpenAI is active
        const openaiButton = await page.$('.service-btn[data-service="openai"]');
        const openaiActive = await openaiButton.getAttribute('class');
        expect(openaiActive).toContain('active');
        
        // Verify service indicator shows OpenAI
        const serviceIndicator = await page.textContent('.service-indicator');
        expect(serviceIndicator).toContain('OpenAI');
    });

    test('should execute qi command with openai AI service', async () => {
        // Execute a simple query to OpenAI
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
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
        await commandInput.focus();
        await page.keyboard.type('qi Explain the difference between HTTP and HTTPS protocols');
        await page.keyboard.press('Enter');
        
        // Wait for AI response
        await page.waitForTimeout(4000);
        
        // Check if response contains relevant technical content
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/HTTP|HTTPS|protocol|security|encryption|SSL|TLS/i);
        
        // Verify response quality
        expect(output?.length).toBeGreaterThan(100); // Technical explanation should be detailed
    });

    test('should handle code generation qi command with openai', async () => {
        // Execute a code generation query
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('qi Write a Python function to calculate factorial');
        await page.keyboard.press('Enter');
        
        // Wait for AI response
        await page.waitForTimeout(4000);
        
        // Check if response contains code
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/def|factorial|python|function|return|recursive/i);
        
        // Verify code structure
        expect(output).toContain('(');
        expect(output).toContain(')');
    });

    test('should maintain conversation context with openai', async () => {
        // First query about programming
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('qi What is object-oriented programming?');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Follow-up query
        await commandInput.focus();
        await page.keyboard.type('qi Give me examples of OOP principles');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Check if responses show contextual understanding
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/OOP|object-oriented|encapsulation|inheritance|polymorphism|abstraction/i);
    });

    test('should handle qi command with openai-specific features', async () => {
        // Execute query that might leverage OpenAI's specific capabilities
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('qi Generate a creative story about a robot learning to paint');
        await page.keyboard.press('Enter');
        
        // Wait for creative response
        await page.waitForTimeout(4000);
        
        // Check if response shows creative capabilities
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/robot|paint|creative|story|learning|art/i);
        expect(output?.length).toBeGreaterThan(150); // Creative content should be substantial
    });

    test('should show loading state during openai qi command execution', async () => {
        // Execute qi command
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('qi What is natural language processing?');
        await page.keyboard.press('Enter');
        
        // Check loading state immediately after execution
        await page.waitForTimeout(500);
        const loadingOutput = await page.textContent('.terminal-output');
        expect(loadingOutput).toContain('Processing');
        expect(loadingOutput).toContain('OpenAI');
        
        // Wait for completion and verify loading state is gone
        await page.waitForTimeout(3000);
        const finalOutput = await page.textContent('.terminal-output');
        expect(finalOutput).not.toContain('Processing');
        expect(finalOutput).toContain('natural language processing');
    });

    test('should integrate cd and qi commands seamlessly with openai', async () => {
        // Switch to another service
        const deepseekButton = await page.$('.service-btn[data-service="deepseek"]');
        await deepseekButton.click();
        await page.waitForTimeout(500);
        
        // Switch back to OpenAI using cd
        const commandInput = await page.$('.command-input');
        await commandInput.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Execute qi command immediately after switching
        await commandInput.focus();
        await page.keyboard.type('qi Test OpenAI integration');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Verify successful integration
        const output = await page.textContent('.terminal-output');
        expect(output).toContain('OpenAI');
        expect(output?.length).toBeGreaterThan(20);
    });
});