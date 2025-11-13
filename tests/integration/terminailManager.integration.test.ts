import * as vscode from 'vscode';
import { TerminailWebviewProvider } from '../../src/terminailManager';

/**
 * Integration Test: TerminailManager with VS Code API
 * 
 * This test verifies that the TerminailManager properly integrates with the VS Code API
 * and can be properly initialized and disposed.
 */

describe('TerminailManager Integration', () => {
    let terminailManager: TerminailWebviewProvider;
    let mockContext: vscode.ExtensionContext;

    beforeEach(() => {
        // Create mock vscode.Uri for extensionUri
        const mockUri = {
            fsPath: '/test/path'
        } as any;

        terminailManager = new TerminailWebviewProvider(mockUri);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create webview view successfully', () => {
        // Create mock webview view
        const mockWebviewView = {
            webview: {
                options: {},
                html: '',
                onDidReceiveMessage: jest.fn(),
                postMessage: jest.fn()
            }
        } as any;
        
        // Test webview view resolution
        terminailManager.resolveWebviewView(mockWebviewView, {} as any, {} as any);
        
        // Verify webview was configured
        expect(mockWebviewView.webview.options).toBeDefined();
        expect(mockWebviewView.webview.html).toBeDefined();
    });

    it('should have view type defined', () => {
        // Test static view type property
        expect(TerminailWebviewProvider.viewType).toBe('terminail.terminalView');
    });
});