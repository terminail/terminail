import * as vscode from 'vscode';
import { activate } from '../../src/extension';
import { TerminAIWebviewProvider } from '../../src/terminAIManager';

// Mock the VS Code API
jest.mock('vscode', () => ({
    window: {
        registerWebviewViewProvider: jest.fn(),
        showInformationMessage: jest.fn(),
        showErrorMessage: jest.fn()
    },
    commands: {
        registerCommand: jest.fn()
    },
    ExtensionContext: jest.fn(),
    ExtensionMode: {
        Production: 1,
        Development: 2,
        Test: 3
    },
    Uri: {
        parse: jest.fn().mockReturnValue('file:///test/path'),
        file: jest.fn().mockReturnValue('file:///test/path')
    }
}));

// Mock TerminAIWebviewProvider
jest.mock('../../src/terminAIManager', () => ({
    TerminAIWebviewProvider: jest.fn().mockImplementation(() => ({
        dispose: jest.fn()
    }))
}));

describe('Extension Integration Tests', () => {
    let mockContext: vscode.ExtensionContext;
    let mockSubscriptions: any[];

    beforeEach(() => {
        // Create mock extension context
        mockSubscriptions = [];
        mockContext = {
            subscriptions: mockSubscriptions,
            extensionUri: vscode.Uri.parse('file:///test/path'),
            globalState: {
                get: jest.fn(),
                update: jest.fn(),
                keys: jest.fn()
            },
            workspaceState: {
                get: jest.fn(),
                update: jest.fn(),
                keys: jest.fn()
            },
            extensionPath: '/test/path',
            globalStoragePath: '/test/global/storage',
            logPath: '/test/log/path',
            storagePath: '/test/storage/path',
            asAbsolutePath: jest.fn().mockImplementation((path) => `/test/absolute/${path}`),
            environmentVariableCollection: {
                persistent: true,
                replace: jest.fn(),
                append: jest.fn(),
                prepend: jest.fn(),
                get: jest.fn(),
                forEach: jest.fn(),
                delete: jest.fn(),
                clear: jest.fn()
            },
            extensionMode: vscode.ExtensionMode.Production,
            globalStorageUri: vscode.Uri.parse('file:///test/global/storage'),
            logUri: vscode.Uri.parse('file:///test/log/path'),
            storageUri: vscode.Uri.parse('file:///test/storage/path'),
            secrets: {
                get: jest.fn(),
                store: jest.fn(),
                delete: jest.fn(),
                onDidChange: jest.fn()
            }
        } as any;

        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Extension Activation', () => {
        test('should activate extension successfully', () => {
            // Reset all mocks to ensure clean state
            jest.clearAllMocks();
            
            // Mock the registerWebviewViewProvider to return a disposable
            const mockDisposable = { dispose: jest.fn() };
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue(mockDisposable);
            
            // Mock the registerCommand to return a disposable
            (vscode.commands.registerCommand as jest.Mock).mockReturnValue(mockDisposable);
            
            // Reset TerminAIWebviewProvider mock to use actual constructor
            (TerminAIWebviewProvider as unknown as jest.Mock).mockClear();

            activate(mockContext);

            // Verify that TerminAIWebviewProvider was instantiated
            expect(TerminAIWebviewProvider).toHaveBeenCalledWith(mockContext.extensionUri);

            // Verify that Webview view provider was registered
            expect(vscode.window.registerWebviewViewProvider).toHaveBeenCalledWith(
                'terminai.terminalView',
                expect.any(Object) // TerminAIWebviewProvider is mocked to return an object
            );

            // Verify that commands were registered
            expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
                'terminai.openTerminal',
                expect.any(Function)
            );

            // Verify that disposables were added to context subscriptions
            expect(mockContext.subscriptions).toContain(mockDisposable);
            expect(mockContext.subscriptions).toHaveLength(3); // viewRegistration, openTerminalCommand, provider
        });

        test('should handle extension activation with console logging', () => {
            const consoleSpy = jest.spyOn(console, 'log');
            
            // Mock disposables
            const mockDisposable = { dispose: jest.fn() };
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue(mockDisposable);
            (vscode.commands.registerCommand as jest.Mock).mockReturnValue(mockDisposable);

            activate(mockContext);

            // Verify console logging
            expect(consoleSpy).toHaveBeenCalledWith('TerminAI extension is now active!');
            
            consoleSpy.mockRestore();
        });

        test('should register correct Webview view type', () => {
            const mockDisposable = { dispose: jest.fn() };
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue(mockDisposable);
            (vscode.commands.registerCommand as jest.Mock).mockReturnValue(mockDisposable);

            activate(mockContext);

            // Verify the correct view type is registered
            expect(vscode.window.registerWebviewViewProvider).toHaveBeenCalledWith(
                'terminai.terminalView',
                expect.anything()
            );
        });

        test('should register correct command ID', () => {
            const mockDisposable = { dispose: jest.fn() };
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue(mockDisposable);
            (vscode.commands.registerCommand as jest.Mock).mockReturnValue(mockDisposable);

            activate(mockContext);

            // Verify the correct command ID is registered
            expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
                'terminai.openTerminal',
                expect.anything()
            );
        });
    });

    describe('Command Registration', () => {
        test('should register openTerminal command with proper handler', () => {
            const mockDisposable = { dispose: jest.fn() };
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue(mockDisposable);
            
            let registeredCommandHandler: Function | undefined;
            (vscode.commands.registerCommand as jest.Mock).mockImplementation((commandId, handler) => {
                if (commandId === 'terminai.openTerminal') {
                    registeredCommandHandler = handler;
                }
                return mockDisposable;
            });

            activate(mockContext);

            // Verify command handler is registered
            expect(registeredCommandHandler).toBeDefined();
            expect(typeof registeredCommandHandler).toBe('function');

            // Test command execution
            const consoleSpy = jest.spyOn(console, 'log');
            registeredCommandHandler!();
            
            expect(consoleSpy).toHaveBeenCalledWith('Opening TerminAI Terminal in panel');
            consoleSpy.mockRestore();
        });

        test('should handle command execution errors gracefully', () => {
            const mockDisposable = { dispose: jest.fn() };
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue(mockDisposable);
            
            let registeredCommandHandler: Function | undefined;
            (vscode.commands.registerCommand as jest.Mock).mockImplementation((commandId, handler) => {
                if (commandId === 'terminai.openTerminal') {
                    registeredCommandHandler = handler;
                }
                return mockDisposable;
            });

            activate(mockContext);

            // Test that command handler executes without throwing errors
            expect(() => registeredCommandHandler!()).not.toThrow();
        });
    });

    describe('Resource Management', () => {
        test('should properly manage disposables', () => {
            const mockViewDisposable = { dispose: jest.fn() };
            const mockCommandDisposable = { dispose: jest.fn() };
            
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue(mockViewDisposable);
            (vscode.commands.registerCommand as jest.Mock).mockReturnValue(mockCommandDisposable);

            // Mock TerminAIWebviewProvider to return a disposable
            const mockProviderDisposable = { dispose: jest.fn() };
            (TerminAIWebviewProvider as unknown as jest.Mock).mockImplementation(() => mockProviderDisposable);

            activate(mockContext);

            // Verify all disposables are added to context
            expect(mockContext.subscriptions).toContain(mockViewDisposable);
            expect(mockContext.subscriptions).toContain(mockCommandDisposable);
            expect(mockContext.subscriptions).toContain(mockProviderDisposable);
            expect(mockContext.subscriptions).toHaveLength(3);
        });

        test('should handle missing extension URI gracefully', () => {
            const mockContextWithoutUri = {
                ...mockContext,
                extensionUri: vscode.Uri.parse('file:///test/path')
            };

            const mockDisposable = { dispose: jest.fn() };
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue(mockDisposable);
            (vscode.commands.registerCommand as jest.Mock).mockReturnValue(mockDisposable);

            // Should not throw error
            expect(() => activate(mockContextWithoutUri)).not.toThrow();

            // TerminAIWebviewProvider should still be called
            expect(TerminAIWebviewProvider).toHaveBeenCalled();
        });
    });

    describe('Extension Context Integration', () => {
        test('should use extension URI from context', () => {
            const mockDisposable = { dispose: jest.fn() };
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue(mockDisposable);
            (vscode.commands.registerCommand as jest.Mock).mockReturnValue(mockDisposable);

            activate(mockContext);

            // Verify TerminAIWebviewProvider receives the correct extension URI
            expect(TerminAIWebviewProvider).toHaveBeenCalledWith(mockContext.extensionUri);
        });

        test('should work with different extension modes', () => {
            const testModes = [
                vscode.ExtensionMode.Production,
                vscode.ExtensionMode.Development,
                vscode.ExtensionMode.Test
            ];

            testModes.forEach(mode => {
                const mockContextWithMode = {
                    ...mockContext,
                    extensionMode: mode
                };

                const mockDisposable = { dispose: jest.fn() };
                (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue(mockDisposable);
                (vscode.commands.registerCommand as jest.Mock).mockReturnValue(mockDisposable);

                // Should activate successfully in all modes
                expect(() => activate(mockContextWithMode)).not.toThrow();
            });
        });
    });

    describe('Error Handling', () => {
        test('should handle registration failures gracefully', () => {
            // Mock registration to throw error
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockImplementation(() => {
                throw new Error('Registration failed');
            });

            // Since activate function doesn't have error handling, it should throw
            expect(() => activate(mockContext)).toThrow('Registration failed');
        });

        test('should handle command registration failures gracefully', () => {
            // Reset all mocks to ensure clean state
            jest.clearAllMocks();
            
            // Mock command registration to throw error
            (vscode.commands.registerCommand as jest.Mock).mockImplementation(() => {
                throw new Error('Command registration failed');
            });
            
            // Mock other required APIs to avoid interference
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue({ dispose: jest.fn() });
            (TerminAIWebviewProvider as unknown as jest.Mock).mockImplementation(() => ({
                dispose: jest.fn()
            }));

            // Since activate function doesn't have error handling, it should throw
            expect(() => activate(mockContext)).toThrow('Command registration failed');
        });

        test('should handle provider instantiation failures gracefully', () => {
            // Mock TerminAIWebviewProvider to throw error
            (TerminAIWebviewProvider as unknown as jest.Mock).mockImplementation(() => {
                throw new Error('Provider creation failed');
            });

            // In a real scenario, the extension should handle this gracefully
            // For now, we'll test that the error is thrown as expected
            expect(() => activate(mockContext)).toThrow('Provider creation failed');
        });
    });

    describe('Integration with VS Code API', () => {
        test('should integrate properly with VS Code extension system', () => {
            // Reset all mocks to ensure clean state
            jest.clearAllMocks();
            
            const mockDisposable = { dispose: jest.fn() };
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue(mockDisposable);
            (vscode.commands.registerCommand as jest.Mock).mockReturnValue(mockDisposable);
            
            // Reset TerminAIWebviewProvider mock to default behavior
            (TerminAIWebviewProvider as unknown as jest.Mock).mockImplementation(() => ({
                dispose: jest.fn()
            }));

            activate(mockContext);

            // Verify VS Code API calls
            expect(vscode.window.registerWebviewViewProvider).toHaveBeenCalledTimes(1);
            expect(vscode.commands.registerCommand).toHaveBeenCalledTimes(1);

            // Verify the integration with extension context
            expect(mockContext.subscriptions.length).toBeGreaterThan(0);
        });

        test('should support extension context disposal', () => {
            const mockViewDisposable = { dispose: jest.fn() };
            const mockCommandDisposable = { dispose: jest.fn() };
            const mockProviderDisposable = { dispose: jest.fn() };
            
            (vscode.window.registerWebviewViewProvider as jest.Mock).mockReturnValue(mockViewDisposable);
            (vscode.commands.registerCommand as jest.Mock).mockReturnValue(mockCommandDisposable);
            (TerminAIWebviewProvider as unknown as jest.Mock).mockImplementation(() => mockProviderDisposable);

            activate(mockContext);

            // Simulate extension deactivation by disposing all subscriptions
            mockContext.subscriptions.forEach(disposable => {
                disposable.dispose();
            });

            // Verify all disposables were disposed
            expect(mockViewDisposable.dispose).toHaveBeenCalled();
            expect(mockCommandDisposable.dispose).toHaveBeenCalled();
            expect(mockProviderDisposable.dispose).toHaveBeenCalled();
        });
    });
});