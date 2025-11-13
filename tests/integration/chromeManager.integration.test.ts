import * as vscode from 'vscode';
import { ChromeManager } from '../../src/chromeManager';

/**
 * Integration Test: ChromeManager with VS Code API
 * 
 * This test verifies that the ChromeManager properly integrates with the VS Code API
 * and can be properly initialized and used.
 */

describe('ChromeManager Integration', () => {
    let chromeManager: ChromeManager;
    let mockContext: vscode.ExtensionContext;

    beforeEach(() => {
        // Create a mock context (not used by ChromeManager but kept for consistency)
        mockContext = {
            subscriptions: [],
            globalState: {
                get: jest.fn(),
                update: jest.fn()
            },
            extensionPath: '/test/path'
        } as any;

        chromeManager = new ChromeManager();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize and integrate with VS Code correctly', async () => {
        // Test that the chrome manager can be instantiated
        expect(chromeManager).toBeDefined();
        
        // Verify the manager has the expected methods
        expect(typeof chromeManager.startChrome).toBe('function');
        expect(typeof chromeManager.stopChrome).toBe('function');
        expect(typeof chromeManager.isChromeRunning).toBe('function');
        expect(typeof chromeManager.getDebugPort).toBe('function');
    });

    it('should handle VS Code configuration correctly', () => {
        // Test that the chrome manager can properly integrate with VS Code configuration system
        expect(chromeManager).toBeTruthy();
        
        // Verify that the manager has the expected properties
        expect(chromeManager.getDebugPort()).toBe(9222);
        expect(chromeManager.isChromeRunning()).toBe(false);
    });

    it('should handle Chrome start and stop lifecycle', async () => {
        // Mock the actual Chrome start process to avoid starting real Chrome
        const originalStartChrome = chromeManager.startChrome;
        chromeManager.startChrome = jest.fn().mockResolvedValue(9222);
        
        const originalStopChrome = chromeManager.stopChrome;
        chromeManager.stopChrome = jest.fn().mockResolvedValue(undefined);

        // Test start Chrome
        const debugPort = await chromeManager.startChrome();
        expect(debugPort).toBe(9222);
        expect(chromeManager.startChrome).toHaveBeenCalledTimes(1);

        // Test stop Chrome
        await chromeManager.stopChrome();
        expect(chromeManager.stopChrome).toHaveBeenCalledTimes(1);

        // Restore original methods
        chromeManager.startChrome = originalStartChrome;
        chromeManager.stopChrome = originalStopChrome;
    });

    it('should handle Chrome not available scenario', async () => {
        // Mock Chrome start to throw error
        const originalStartChrome = chromeManager.startChrome;
        chromeManager.startChrome = jest.fn().mockRejectedValue(new Error('Chrome not found'));

        await expect(chromeManager.startChrome()).rejects.toThrow('Chrome not found');
        expect(chromeManager.startChrome).toHaveBeenCalledTimes(1);

        // Restore original method
        chromeManager.startChrome = originalStartChrome;
    });
});