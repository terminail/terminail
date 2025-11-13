import { test, expect, Page } from '@playwright/test';

/**
 * AI Service Switching E2E Tests
 * Tests the workflow of switching between different AI services
 * and maintaining context across service changes
 */

test.describe('AI Service Switching Tests', () => {
    let page: Page;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;
        // Set up test environment - using simulated HTML interface
        await page.goto('http://localhost:3000');
        // Wait for page to load
        await page.waitForTimeout(1000);
    });

    test('should switch between all available AI services using cd commands', async () => {
        const commandInput = await page.$('.command-input');
        
        // Test switching to DeepSeek
        await commandInput!.focus();
        await page.keyboard.type('cd deepseek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Verify DeepSeek is active
        const deepseekButton = await page.$('.service-btn[data-service="deepseek"]');
        const deepseekActive = await deepseekButton!.getAttribute('class');
        expect(deepseekActive).toContain('active');
        
        // Test switching to OpenAI
        await commandInput!.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Verify OpenAI is active
        const openaiButton = await page.$('.service-btn[data-service="openai"]');
        const openaiActive = await openaiButton!.getAttribute('class');
        expect(openaiActive).toContain('active');
        
        // Test switching back to DeepSeek
        await commandInput!.focus();
        await page.keyboard.type('cd deepseek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Verify DeepSeek is active again
        const deepseekActiveAgain = await deepseekButton!.getAttribute('class');
        expect(deepseekActiveAgain).toContain('active');
    });

    test('should maintain command history across service switches', async () => {
        const commandInput = await page.$('.command-input');
        
        // Execute commands with DeepSeek
        await commandInput!.focus();
        await page.keyboard.type('qi What is Python?');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Switch to OpenAI
        await commandInput!.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Execute command with OpenAI
        await commandInput!.focus();
        await page.keyboard.type('qi What is JavaScript?');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Test command history navigation
        await commandInput!.focus();
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(200);
        
        const inputValue = await commandInput!.inputValue();
        expect(inputValue).toContain('What is JavaScript?');
        
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(200);
        const inputValue2 = await commandInput!.inputValue();
        expect(inputValue2).toContain('cd openai');
        
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(200);
        const inputValue3 = await commandInput!.inputValue();
        expect(inputValue3).toContain('What is Python?');
    });

    test('should handle rapid service switching with qi commands', async () => {
        const commandInput = await page.$('.command-input');
        
        // Rapid switching test
        await commandInput!.focus();
        await page.keyboard.type('cd deepseek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        
        await commandInput!.focus();
        await page.keyboard.type('qi Quick test');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        
        await commandInput!.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        
        await commandInput!.focus();
        await page.keyboard.type('qi Another test');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        
        // Verify both services were used
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/DeepSeek|OpenAI|test/i);
    });

    test('should preserve service context when switching back', async () => {
        const commandInput = await page.$('.command-input');
        
        // Start with DeepSeek and execute a query
        await commandInput!.focus();
        await page.keyboard.type('cd deepseek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        await commandInput!.focus();
        await page.keyboard.type('qi DeepSeek specific question');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Switch to OpenAI
        await commandInput!.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Execute OpenAI query
        await commandInput!.focus();
        await page.keyboard.type('qi OpenAI specific question');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Switch back to DeepSeek
        await commandInput!.focus();
        await page.keyboard.type('cd deepseek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Verify DeepSeek context is preserved
        const deepseekButton = await page.$('.service-btn[data-service="deepseek"]');
        const deepseekActive = await deepseekButton!.getAttribute('class');
        expect(deepseekActive).toContain('active');
        
        // Execute another DeepSeek query
        await commandInput!.focus();
        await page.keyboard.type('qi Back to DeepSeek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        const output = await page.textContent('.terminal-output');
        expect(output).toContain('DeepSeek');
    });

    test('should handle service switching during qi command execution', async () => {
        const commandInput = await page.$('.command-input');
        
        // Start a qi command with DeepSeek
        await commandInput!.focus();
        await page.keyboard.type('cd deepseek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        await commandInput!.focus();
        await page.keyboard.type('qi Long running query');
        await page.keyboard.press('Enter');
        
        // Immediately switch service during execution
        await page.waitForTimeout(500);
        await commandInput!.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        
        // Wait for both operations to complete
        await page.waitForTimeout(4000);
        
        // Verify system handled the interruption gracefully
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/OpenAI|switched|completed/i);
    });

    test('should update service indicators correctly during switching', async () => {
        const commandInput = await page.$('.command-input');
        
        // Test DeepSeek indicator
        await commandInput!.focus();
        await page.keyboard.type('cd deepseek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        let serviceIndicator = await page.textContent('.service-indicator');
        expect(serviceIndicator).toContain('DeepSeek');
        
        // Test OpenAI indicator
        await commandInput!.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        serviceIndicator = await page.textContent('.service-indicator');
        expect(serviceIndicator).toContain('OpenAI');
        
        // Test button active states
        const deepseekButton = await page.$('.service-btn[data-service="deepseek"]');
        const openaiButton = await page.$('.service-btn[data-service="openai"]');
        
        const deepseekActive = await deepseekButton!.getAttribute('class');
        const openaiActive = await openaiButton!.getAttribute('class');
        
        expect(deepseekActive).not.toContain('active');
        expect(openaiActive).toContain('active');
    });

    test('should handle invalid service names in cd commands', async () => {
        const commandInput = await page.$('.command-input');
        
        // Try to switch to invalid service
        await commandInput!.focus();
        await page.keyboard.type('cd invalid_service');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Verify error handling
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/Invalid service|not found|error/i);
        
        // Verify current service remains unchanged
        const currentService = await page.textContent('.service-indicator');
        expect(currentService).toBeTruthy(); // Should still have a valid service
    });

    test('should integrate service switching with other terminal commands', async () => {
        const commandInput = await page.$('.command-input');
        
        // Mix service switching with other commands
        await commandInput!.focus();
        await page.keyboard.type('help');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        await commandInput!.focus();
        await page.keyboard.type('cd deepseek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        await commandInput!.focus();
        await page.keyboard.type('ls');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        
        await commandInput!.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        await commandInput!.focus();
        await page.keyboard.type('status');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Verify all commands executed successfully
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/help|ls|status|DeepSeek|OpenAI/i);
    });
});