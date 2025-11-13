import { test, expect, Page } from '@playwright/test';

/**
 * Playwright UI Tests for Terminail Extension (TypeScript)
 * These tests verify the visual interface and user interactions
 */

test.describe('Terminail Webview UI Tests', () => {
    let page: Page;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;
        // Set up test environment - using simulated HTML interface
        await page.goto('http://localhost:3000');
        // Wait for page to load
        await page.waitForTimeout(1000);
    });

    test('should render terminal interface correctly', async () => {
        // Check if terminal container exists
        const terminalContainer = await page.$('.terminal');
        expect(terminalContainer).not.toBeNull();
        
        // Check if terminal is visible
        const terminalVisibility = await terminalContainer!.isVisible();
        expect(terminalVisibility).toBe(true);
        
        // Check if command input exists
        const commandInput = await page.$('.command-input');
        expect(commandInput).not.toBeNull();
        
        // Check if AI service selector exists
        const serviceSelector = await page.$('.ai-service-selector');
        expect(serviceSelector).not.toBeNull();
    });

    test('should handle basic command input', async () => {
        // Find command input area
        const commandInput = await page.$('.command-input');
        expect(commandInput).not.toBeNull();
        
        // Simulate typing a command
        await commandInput!.focus();
        await page.keyboard.type('help');
        await page.keyboard.press('Enter');
        
        // Wait for response
        await page.waitForTimeout(1500);
        
        // Check if help response appears
        const output = await page.textContent('.terminal-output');
        expect(output).toContain('Available commands');
    });

    test('should switch to deepseek AI service', async () => {
        // Find and click deepseek switch button (it should already be active)
        const deepseekButton = await page.$('.service-btn[data-service="deepseek"]');
        expect(deepseekButton).not.toBeNull();
        
        // Check if deepseek is already active
        const isActive = await deepseekButton!.getAttribute('class');
        expect(isActive).toContain('active');
        
        // Switch to OpenAI and back to deepseek
        const openaiButton = await page.$('.service-btn[data-service="openai"]');
        await openaiButton!.click();
        await page.waitForTimeout(500);
        
        await deepseekButton!.click();
        await page.waitForTimeout(500);
        
        // Check if deepseek is active again
        const isActiveAfter = await deepseekButton!.getAttribute('class');
        expect(isActiveAfter).toContain('active');
    });

    test('should handle ls command and display results', async () => {
        // Type ls command
        const commandInput = await page.$('[data-testid="command-input"]');
        await commandInput!.focus();
        await page.keyboard.type('ls');
        await page.keyboard.press('Enter');
        
        // Wait for command execution
        await page.waitForTimeout(2000);
        
        // Check if file listing appears
        const output = await page.textContent('.terminal-output');
        expect(output).toMatch(/\w+\s+\w+\s+\w+/); // Basic file listing pattern
    });

    test('should handle invalid command gracefully', async () => {
        // Type invalid command
        const commandInput = await page.$('.command-input');
        await commandInput!.focus();
        await page.keyboard.type('invalid_command_xyz');
        await page.keyboard.press('Enter');
        
        // Wait for error handling
        await page.waitForTimeout(1500);
        
        // Check if error message appears
        const output = await page.textContent('.terminal-output');
        expect(output).toContain('Command not found');
    });

    test('should maintain command history', async () => {
        // Execute multiple commands
        const commandInput = await page.$('.command-input');
        
        await commandInput!.focus();
        await page.keyboard.type('help');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        await commandInput!.focus();
        await page.keyboard.type('ls');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        await commandInput!.focus();
        await page.keyboard.type('status');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        // Test command history navigation
        await commandInput!.focus();
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(200);
        
        // Check if previous command is loaded
        const inputValue = await commandInput!.inputValue();
        expect(inputValue).toContain('status');
        
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(200);
        const inputValue2 = await commandInput!.inputValue();
        expect(inputValue2).toContain('ls');
    });

    test('should switch to openai AI service via command', async () => {
        // Switch to openai using command
        const commandInput = await page.$('.command-input');
        await commandInput!.focus();
        await page.keyboard.type('cd openai');
        await page.keyboard.press('Enter');
        
        // Wait for AI service switch
        await page.waitForTimeout(1500);
        
        // Verify OpenAI service is active
        const openaiButton = await page.$('.service-btn[data-service="openai"]');
        const isActive = await openaiButton!.getAttribute('class');
        expect(isActive).toContain('active');
    });

    test('should display proper loading states', async () => {
        // Execute a command that takes time
        const commandInput = await page.$('.command-input');
        await commandInput!.focus();
        await page.keyboard.type('ls');
        await page.keyboard.press('Enter');
        
        // Check if loading message appears
        await page.waitForTimeout(500);
        const output = await page.textContent('.terminal-output');
        expect(output).toContain('Processing');
        
        // Wait for command completion
        await page.waitForTimeout(2000);
        
        // Check if loading message is replaced with results
        const finalOutput = await page.textContent('.terminal-output');
        expect(finalOutput).toContain('file1.txt');
        expect(finalOutput).not.toContain('Processing');
    });
});