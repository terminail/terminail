const { test, expect } = require('@playwright/test');

/**
 * AI Service Switching E2E Tests
 * Tests the comprehensive workflow of switching between different AI services
 * using cd commands and verifying proper integration
 */

test.describe('AI Service Switching Tests', () => {
    let page;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;
        // Set up test environment - using simulated HTML interface
        await page.goto('http://localhost:3000');
        // Wait for page to load
        await page.waitForTimeout(1000);
    });

    test('should switch between all AI services using cd commands', async () => {
        const services = ['deepseek', 'openai'];
        const commandInput = await page.$('.command-input');
        
        for (const service of services) {
            // Switch to service using cd command
            await commandInput.focus();
            await page.keyboard.type(`cd ${service}`);
            await page.keyboard.press('Enter');
            
            // Wait for service switch
            await page.waitForTimeout(1500);
            
            // Verify service is active
            const serviceButton = await page.$(`.service-btn[data-service="${service}"]`);
            const isActive = await serviceButton.getAttribute('class');
            expect(isActive).toContain('active');
            
            // Verify service indicator
            const serviceIndicator = await page.textContent('.service-indicator');
            expect(serviceIndicator).toContain(service.charAt(0).toUpperCase() + service.slice(1));
        }
    });

    test('should maintain command history across service switches', async () => {
        const commandInput = await page.$('.command-input');
        
        // Execute commands in DeepSeek
        await commandInput.focus();
        await page.keyboard.type('qi First query in DeepSeek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        
        // Switch to OpenAI
        await commandInput.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Execute command in OpenAI
        await commandInput.focus();
        await page.keyboard.type('qi Second query in OpenAI');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        
        // Switch back to DeepSeek
        await commandInput.focus();
        await page.keyboard.type('cd deepseek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Verify command history is maintained
        const history = await page.textContent('.command-history');
        expect(history).toContain('First query in DeepSeek');
        expect(history).toContain('Second query in OpenAI');
        expect(history).toContain('cd openai');
        expect(history).toContain('cd deepseek');
    });

    test('should handle rapid service switching with qi commands', async () => {
        const commandInput = await page.$('.command-input');
        
        // Rapid switching and querying
        const switches = [
            { service: 'deepseek', query: 'DeepSeek query 1' },
            { service: 'openai', query: 'OpenAI query 1' },
            { service: 'deepseek', query: 'DeepSeek query 2' },
            { service: 'openai', query: 'OpenAI query 2' }
        ];
        
        for (const { service, query } of switches) {
            // Switch service
            await commandInput.focus();
            await page.keyboard.type(`cd ${service}`);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1000);
            
            // Execute query
            await commandInput.focus();
            await page.keyboard.type(`qi ${query}`);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(2000);
        }
        
        // Verify all queries were processed in correct service context
        const output = await page.textContent('.terminal-output');
        expect(output).toContain('DeepSeek');
        expect(output).toContain('OpenAI');
    });

    test('should preserve context when switching services', async () => {
        const commandInput = await page.$('.command-input');
        
        // Start conversation in DeepSeek
        await commandInput.focus();
        await page.keyboard.type('qi Tell me about machine learning');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Switch to OpenAI
        await commandInput.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Continue conversation in OpenAI
        await commandInput.focus();
        await page.keyboard.type('qi Now explain deep learning');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        
        // Verify both services handled their respective queries
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/machine learning|deep learning|AI|neural network/i);
    });

    test('should handle service switching during command execution', async () => {
        const commandInput = await page.$('.command-input');
        
        // Start a long-running query in DeepSeek
        await commandInput.focus();
        await page.keyboard.type('qi Explain quantum computing in detail');
        await page.keyboard.press('Enter');
        
        // Immediately try to switch services (should be handled gracefully)
        await page.waitForTimeout(500);
        await commandInput.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        
        // Wait for both operations
        await page.waitForTimeout(4000);
        
        // Verify system handled the conflict appropriately
        const output = await page.textContent('.terminal-output');
        // Either the original query completed or the switch was processed
        expect(output).toMatch(/quantum|OpenAI|processing|switched/i);
    });

    test('should update service indicators correctly during switching', async () => {
        const commandInput = await page.$('.command-input');
        
        // Track service indicator changes
        const initialIndicator = await page.textContent('.service-indicator');
        
        // Switch to OpenAI
        await commandInput.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        const openaiIndicator = await page.textContent('.service-indicator');
        expect(openaiIndicator).toContain('OpenAI');
        expect(openaiIndicator).not.toEqual(initialIndicator);
        
        // Switch to DeepSeek
        await commandInput.focus();
        await page.keyboard.type('cd deepseek');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        const deepseekIndicator = await page.textContent('.service-indicator');
        expect(deepseekIndicator).toContain('DeepSeek');
        expect(deepseekIndicator).not.toEqual(openaiIndicator);
    });

    test('should handle invalid service names gracefully', async () => {
        const commandInput = await page.$('.command-input');
        
        // Try to switch to non-existent service
        await commandInput.focus();
        await page.keyboard.type('cd invalid-service');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Verify appropriate error message
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/Invalid service|not found|error/i);
        
        // Verify current service remains unchanged
        const currentService = await page.textContent('.service-indicator');
        expect(currentService).toBeTruthy(); // Should still show a valid service
    });

    test('should integrate service switching with other terminal commands', async () => {
        const commandInput = await page.$('.command-input');
        
        // Mix service switching with regular commands
        const commands = [
            'ls',
            'cd openai',
            'qi Test OpenAI',
            'cd deepseek',
            'qi Test DeepSeek',
            'pwd'
        ];
        
        for (const cmd of commands) {
            await commandInput.focus();
            await page.keyboard.type(cmd);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(2000);
        }
        
        // Verify all commands executed successfully
        const output = await page.textContent('.terminal-output');
        expect(output).toContain('OpenAI');
        expect(output).toContain('DeepSeek');
        expect(output).toContain('Test');
    });

    test('should handle concurrent service switching attempts', async () => {
        const commandInput = await page.$('.command-input');
        
        // Simulate rapid switching attempts
        const switchAttempts = [
            'cd openai',
            'cd deepseek',
            'cd openai'
        ];
        
        for (const attempt of switchAttempts) {
            await commandInput.focus();
            await page.keyboard.type(attempt);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(800); // Shorter wait for rapid testing
        }
        
        // Wait for final state to stabilize
        await page.waitForTimeout(2000);
        
        // Verify system reached a stable state
        const currentService = await page.textContent('.service-indicator');
        expect(currentService).toMatch(/OpenAI|DeepSeek/);
        
        // Verify no errors occurred
        const output = await page.textContent('.terminal-output');
        expect(output).not.toMatch(/error|failed|conflict/i);
    });
});