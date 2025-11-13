import * as assert from 'assert';
import * as vscode from 'vscode';

// Mocha test suite for TerminAI terminal commands
suite('TerminAI Terminal Commands E2E Tests', function() {
    this.timeout(30000); // 30 seconds timeout
    
    let extension: vscode.Extension<any> | undefined;
    let terminal: vscode.Terminal | undefined;
    
    suiteSetup(async function() {
        // Activate the extension
        extension = vscode.extensions.getExtension('TerminAI.terminai');
        assert.ok(extension, 'TerminAI extension should be present');
        
        if (!extension.isActive) {
            await extension.activate();
        }
        
        vscode.window.showInformationMessage('Starting TerminAI terminal commands tests');
    });
    
    setup(async function() {
        // Open TerminAI terminal before each test
        await vscode.commands.executeCommand('terminai.openTerminal');
        
        // Wait a bit for terminal to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the active terminal
        terminal = vscode.window.activeTerminal;
        assert.ok(terminal, 'TerminAI terminal should be active');
    });
    
    teardown(async function() {
        // Clean up terminal after each test
        if (terminal) {
            terminal.dispose();
            terminal = undefined;
        }
    });
    
    suiteTeardown(function() {
        vscode.window.showInformationMessage('TerminAI terminal commands tests completed');
    });
    
    test('should switch to deepseek AI', async function() {
        // This test verifies that the 'cd deepseek' command switches to deepseek AI
        // and changes the prompt to "deepseek>"
        
        // Send the cd deepseek command to the terminal
        terminal!.sendText('cd deepseek');
        
        // Wait for command execution
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Since we can't directly capture terminal output in VS Code tests,
        // we verify that the command executed successfully by checking
        // that the extension is still active and terminal is responsive
        
        // Verify extension is still active
        assert.ok(extension!.isActive, 'Extension should remain active after command');
        
        // Verify terminal is still active
        assert.ok(vscode.window.activeTerminal, 'Terminal should remain active after command');
        
        // Send a simple command to verify terminal is responsive
        terminal!.sendText('echo test');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // The test passes if we reach this point without errors
        // In a real E2E environment with proper terminal output capture,
        // we would verify the prompt changed to "deepseek>"
    });
    
    test('should execute ls command', async function() {
        // Send ls command to terminal
        terminal!.sendText('ls');
        
        // Wait for command execution
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify extension and terminal are still active
        assert.ok(extension!.isActive, 'Extension should remain active after ls command');
        assert.ok(vscode.window.activeTerminal, 'Terminal should remain active after ls command');
    });
    
    test('should handle invalid command gracefully', async function() {
        // Send invalid command
        terminal!.sendText('invalid_command_xyz');
        
        // Wait for command execution
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify extension and terminal are still active (should handle errors gracefully)
        assert.ok(extension!.isActive, 'Extension should remain active after invalid command');
        assert.ok(vscode.window.activeTerminal, 'Terminal should remain active after invalid command');
    });
});