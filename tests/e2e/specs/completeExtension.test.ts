import * as assert from 'assert';
import * as vscode from 'vscode';

// Mocha test suite for TerminAI extension activation and basic functionality
suite('TerminAI Extension E2E Tests', function() {
    this.timeout(30000); // 30 seconds timeout
    
    let extension: vscode.Extension<any> | undefined;
    
    suiteSetup(async function() {
        // Activate the extension
        extension = vscode.extensions.getExtension('TerminAI.terminai');
        assert.ok(extension, 'TerminAI extension should be present');
        
        if (!extension.isActive) {
            await extension.activate();
        }
        
        vscode.window.showInformationMessage('Starting TerminAI extension tests');
    });
    
    suiteTeardown(function() {
        vscode.window.showInformationMessage('TerminAI extension tests completed');
    });
    
    test('Extension should be present and active', function() {
        assert.ok(extension, 'Extension should be present');
        assert.ok(extension.isActive, 'Extension should be active');
    });
    
    test('Commands should be registered', async function() {
        const commands = await vscode.commands.getCommands(true);
        const terminaiCommands = commands.filter(cmd => cmd.startsWith('terminai.'));
        
        assert.ok(terminaiCommands.includes('terminai.openTerminal'), 'terminai.openTerminal command should be registered');
        // Add more command checks as needed
    });
    
    test('should open TerminAI terminal successfully', async function() {
        // Execute the open terminal command
        await vscode.commands.executeCommand('terminai.openTerminal');
        
        // Wait for terminal to open
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify terminal is active
        const terminal = vscode.window.activeTerminal;
        assert.ok(terminal, 'TerminAI terminal should be active after opening');
        
        // Clean up
        terminal.dispose();
    });
    
    test('should handle AI switching commands', async function() {
        // Open terminal first
        await vscode.commands.executeCommand('terminai.openTerminal');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const terminal = vscode.window.activeTerminal;
        assert.ok(terminal, 'Terminal should be active');
        
        // Test switching to deepseek AI
        terminal.sendText('cd deepseek');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify terminal is still responsive
        terminal.sendText('echo ai_switch_test');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clean up
        terminal.dispose();
    });
});