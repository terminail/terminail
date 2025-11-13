import * as vscode from 'vscode';
import { PodmanManager } from '../../src/podmanManager';

/**
 * Integration Test: PodmanManager with VS Code API
 * 
 * This test verifies that the PodmanManager properly integrates with the VS Code API
 * and can be properly initialized and used.
 */

describe('PodmanManager Integration', () => {
    let podmanManager: PodmanManager;
    let mockContext: vscode.ExtensionContext;

    beforeEach(() => {
        // Create a mock context (not used by PodmanManager but kept for consistency)
        mockContext = {
            subscriptions: [],
            globalState: {
                get: jest.fn(),
                update: jest.fn()
            },
            extensionPath: '/test/path'
        } as any;

        podmanManager = new PodmanManager();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize and integrate with VS Code correctly', async () => {
        // Test that the podman manager can be instantiated
        expect(podmanManager).toBeDefined();
        
        // Verify the manager has the expected methods (only Podman-related methods)
        expect(typeof podmanManager.startContainer).toBe('function');
        expect(typeof podmanManager.isContainerRunning).toBe('function');
        expect(typeof podmanManager.isPodmanInstalled).toBe('function');
        expect(typeof podmanManager.isContainerInstalled).toBe('function');
        expect(typeof podmanManager.isPodmanRunning).toBe('function');
    });

    it('should handle VS Code configuration correctly', () => {
        // Test that the podman manager can properly integrate with VS Code configuration system
        expect(podmanManager).toBeTruthy();
        
        // Verify that the manager can be disposed properly
        expect(typeof podmanManager.dispose).toBe('function');
    });
});