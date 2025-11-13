const { test, expect } = require('@playwright/test');

/**
 * Demo Playwright Test to verify the setup is working
 * This test demonstrates that Playwright is properly configured
 * and can run basic browser tests
 */

test.describe('Playwright Setup Verification', () => {
    test('should load a basic HTML page', async ({ page }) => {
        // Create a simple HTML page for testing
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Terminail Demo</title>
            </head>
            <body>
                <div id="terminal-container">
                    <div class="xterm-rows">terminail$</div>
                    <input data-testid="command-input" placeholder="Enter command...">
                    <div class="terminal-output">Welcome to Terminail</div>
                    <button data-testid="deepseek-button">Switch to DeepSeek</button>
                    <div data-testid="ai-service-indicator">Current AI: Default</div>
                </div>
            </body>
            </html>
        `;
        
        // Set the HTML content directly
        await page.setContent(htmlContent);
        
        // Test basic UI elements
        const terminalContainer = await page.$('#terminal-container');
        expect(terminalContainer).not.toBeNull();
        
        const prompt = await page.textContent('.xterm-rows');
        expect(prompt).toContain('terminail$');
        
        const commandInput = await page.$('[data-testid="command-input"]');
        expect(commandInput).not.toBeNull();
        
        const deepseekButton = await page.$('[data-testid="deepseek-button"]');
        expect(deepseekButton).not.toBeNull();
        
        const serviceIndicator = await page.$('[data-testid="ai-service-indicator"]');
        expect(serviceIndicator).not.toBeNull();
    });

    test('should simulate command input and AI switching', async ({ page }) => {
        // Create a more interactive demo
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Terminail Interactive Demo</title>
                <style>
                    #terminal-container { 
                        border: 1px solid #ccc; 
                        padding: 10px; 
                        margin: 10px; 
                        font-family: monospace; 
                    }
                    .xterm-rows { color: #00ff00; margin-bottom: 10px; }
                    .terminal-output { background: #000; color: #fff; padding: 5px; margin: 5px 0; }
                    button { margin: 5px; padding: 5px 10px; }
                </style>
            </head>
            <body>
                <div id="terminal-container">
                    <div class="xterm-rows">terminail$</div>
                    <input id="command-input" data-testid="command-input" placeholder="Enter command...">
                    <button id="execute-btn">Execute</button>
                    <div id="output" class="terminal-output">Welcome to Terminail Demo</div>
                    <button id="deepseek-btn" data-testid="deepseek-button">Switch to DeepSeek</button>
                    <div id="service-indicator" data-testid="ai-service-indicator">Current AI: Default</div>
                </div>
                
                <script>
                    document.getElementById('execute-btn').addEventListener('click', function() {
                        const input = document.getElementById('command-input');
                        const output = document.getElementById('output');
                        output.textContent = 'Executing: ' + input.value;
                        input.value = '';
                    });
                    
                    document.getElementById('deepseek-btn').addEventListener('click', function() {
                        const prompt = document.querySelector('.xterm-rows');
                        const indicator = document.getElementById('service-indicator');
                        prompt.textContent = 'deepseek>';
                        indicator.textContent = 'Current AI: DeepSeek';
                    });
                </script>
            </body>
            </html>
        `;
        
        await page.setContent(htmlContent);
        
        // Test command execution
        const commandInput = await page.$('#command-input');
        await commandInput.fill('help');
        
        const executeButton = await page.$('#execute-btn');
        await executeButton.click();
        
        const output = await page.textContent('#output');
        expect(output).toContain('Executing: help');
        
        // Test AI service switching
        const deepseekButton = await page.$('#deepseek-btn');
        await deepseekButton.click();
        
        const prompt = await page.textContent('.xterm-rows');
        expect(prompt).toContain('deepseek>');
        
        const serviceIndicator = await page.textContent('#service-indicator');
        expect(serviceIndicator).toContain('DeepSeek');
    });

    test('should demonstrate multiple browser support', async ({ page, browserName }) => {
        // This test runs in all configured browsers
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <body>
                <div id="browser-test">Running in ${browserName}</div>
                <div id="terminal-sim">Terminail Demo - Browser: ${browserName}</div>
            </body>
            </html>
        `;
        
        await page.setContent(htmlContent);
        
        const browserTest = await page.textContent('#browser-test');
        expect(browserTest).toContain(browserName);
        
        const terminalSim = await page.textContent('#terminal-sim');
        expect(terminalSim).toContain('Terminail Demo');
        expect(terminalSim).toContain(browserName);
    });
});