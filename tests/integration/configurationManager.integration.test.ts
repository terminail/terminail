import * as vscode from 'vscode';
import { ConfigurationManager } from '../../src/configurationManager';

/**
 * Integration Test: ConfigurationManager with VS Code API
 * 
 * This test verifies that the ConfigurationManager properly integrates with the VS Code API
 * and can retrieve and set configuration values.
 */

describe('ConfigurationManager Integration', () => {
    let configurationManager: ConfigurationManager;

    beforeEach(() => {
        configurationManager = new ConfigurationManager();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve configuration from VS Code', () => {
        // Mock VS Code configuration API
        const mockGet = jest.fn().mockReturnValue('test-api-key');
        (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue({
            get: mockGet
        });
        
        // Recreate configuration manager with mocked configuration
        configurationManager = new ConfigurationManager();
        
        // Test configuration retrieval
        const apiKey = configurationManager.getApiKey();
        
        // Verify the configuration was retrieved correctly
        expect(apiKey).toBe('test-api-key');
        expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('terminai');
    });

    it('should handle missing configuration gracefully', () => {
        // Mock VS Code configuration API with undefined value
        const mockGet = jest.fn().mockImplementation((key, defaultValue) => {
            // Simulate vscode configuration behavior: return defaultValue if value is undefined
            return defaultValue;
        });
        (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue({
            get: mockGet
        });
        
        // Recreate configuration manager with mocked configuration
        configurationManager = new ConfigurationManager();
        
        // Test configuration retrieval
        const apiKey = configurationManager.getApiKey();
        
        // Verify the configuration handles missing values correctly
        expect(apiKey).toBe('');
    });
});