import * as vscode from 'vscode';
import * as extension from '../../src/extension';

/**
 * Integration Test: Extension Activation
 * 
 * This test verifies that the extension activates correctly and registers all commands.
 */

describe('Extension Activation Integration', () => {
    let mockContext: vscode.ExtensionContext;
    
    beforeEach(() => {
        // Create a mock context
        mockContext = {
            subscriptions: [],
            globalState: {
                get: jest.fn().mockReturnValue([]),
                update: jest.fn().mockResolvedValue(undefined)
            },
            extensionPath: '/test/path',
            extensionUri: {} as any
        } as any;
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('should activate the extension without errors', () => {
        // Test extension activation (synchronous function)
        expect(() => {
            extension.activate(mockContext);
        }).not.toThrow();
        
        // Verify the extension context was properly handled
        expect(mockContext.subscriptions.length).toBeGreaterThan(0);
    });
    
    it('should register all required commands during activation', async () => {
        // Activate the extension
        await extension.activate(mockContext);
        
        // Verify commands are registered (this is tested through the mock)
        const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
        const registeredCommands = registerCommandMock.mock.calls.map(call => call[0]);
        
        // Check that required commands are present
        expect(registeredCommands).toContain('terminail.openTerminal');
    });
});