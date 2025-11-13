import * as vscode from 'vscode';
import * as extension from '../../src/extension';

// Mock the VS Code API
jest.mock('vscode', () => {
    const originalModule = jest.requireActual('vscode');
    
    return {
        ...originalModule,
        window: {
            showErrorMessage: jest.fn(),
            showInformationMessage: jest.fn(),
            registerWebviewViewProvider: jest.fn().mockReturnValue({
                dispose: jest.fn()
            })
        },
        commands: {
            registerCommand: jest.fn().mockImplementation((_commandName, _callback) => {
                // Return a disposable object
                return {
                    dispose: jest.fn()
                };
            })
        },
        workspace: {
            getConfiguration: jest.fn().mockReturnValue({
                get: jest.fn()
            })
        }
    };
});

describe('Extension Commands', () => {
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
    
    it('should register the terminail.openTerminal command', async () => {
        // Activate the extension
        await extension.activate(mockContext);
        
        // Check that the command was registered
        const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
        const commandRegistered = registerCommandMock.mock.calls.some(
            call => call[0] === 'terminail.openTerminal'
        );
        
        expect(commandRegistered).toBe(true);
    });
    
    it('should register all required commands', async () => {
        // Activate the extension
        await extension.activate(mockContext);
        
        // Check that commands were registered
        const registerCommandMock = vscode.commands.registerCommand as jest.Mock;
        
        // These are the commands that should be registered based on package.json
        const requiredCommands = [
            'terminail.openTerminal'
        ];
        
        requiredCommands.forEach(command => {
            const commandRegistered = registerCommandMock.mock.calls.some(
                call => call[0] === command
            );
            
            expect(commandRegistered).toBe(true);
        });
    });
});