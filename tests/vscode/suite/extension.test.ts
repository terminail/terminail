import * as assert from 'assert';
import * as vscode from 'vscode';

// Mocha test suite
describe('TerminAI Extension Test Suite', function() {
    
    before(function() {
        vscode.window.showInformationMessage('Start all tests.');
    });

    it('Extension should be present', function() {
        assert.ok(vscode.extensions.getExtension('TerminAI.terminai'));
    });

    it('Commands should be registered', async function() {
        const commands = await vscode.commands.getCommands(true);
        const terminaiCommands = commands.filter(cmd => cmd.startsWith('terminai.'));
        
        assert.ok(terminaiCommands.includes('terminai.openTerminal'));
    });
});