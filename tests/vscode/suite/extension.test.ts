import * as assert from 'assert';
import * as vscode from 'vscode';

// Mocha test suite
describe('Terminail Extension Test Suite', function() {
    
    before(function() {
        vscode.window.showInformationMessage('Start all tests.');
    });

    it('Extension should be present', function() {
        assert.ok(vscode.extensions.getExtension('Terminail.terminail'));
    });

    it('Commands should be registered', async function() {
        const commands = await vscode.commands.getCommands(true);
        const terminailCommands = commands.filter(cmd => cmd.startsWith('terminail.'));
        
        assert.ok(terminailCommands.includes('terminail.openTerminal'));
    });
});