/**
 * Integration Test: Configuration Management
 * 
 * This test verifies that the configuration management works correctly
 * with the VS Code settings system.
 */

import * as vscode from 'vscode';
import { ConfigurationManager } from '../../src/configurationManager';

describe('Configuration Management Integration', () => {
    let configurationManager: ConfigurationManager;
    let mockGet: jest.Mock;
    
    beforeEach(() => {
        // Mock VS Code configuration API before creating ConfigurationManager
        mockGet = jest.fn().mockImplementation((key, defaultValue) => {
            // Simulate vscode configuration behavior: return defaultValue if value is undefined
            return defaultValue;
        });
        (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue({
            get: mockGet
        });
        
        configurationManager = new ConfigurationManager();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve API key from VS Code settings', () => {
        // Set up mock return value
        mockGet.mockReturnValue('test-api-key');
        
        // Test configuration retrieval
        const apiKey = configurationManager.getApiKey();
        
        // Verify the configuration was retrieved correctly
        expect(apiKey).toBe('test-api-key');
        expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('terminail');
        expect(mockGet).toHaveBeenCalledWith('apiKey', '');
    });

    it('should handle missing API key configuration gracefully', () => {
        // Set up mock return value for missing config
        // The mock should return the defaultValue when value is undefined
        mockGet.mockImplementation((key, defaultValue) => {
            // Return defaultValue to simulate missing configuration
            return defaultValue;
        });
        
        // Test configuration retrieval
        const apiKey = configurationManager.getApiKey();
        
        // Verify the configuration handles missing values correctly
        expect(apiKey).toBe('');
    });
    
    it('should retrieve model configuration from VS Code settings', () => {
        // Set up mock return value for model
        mockGet.mockImplementation((key, defaultValue) => {
            if (key === 'model') return 'gpt-4';
            return defaultValue;
        });
        
        // Test model configuration retrieval
        const model = configurationManager.getModel();
        
        // Verify the configuration was retrieved correctly
        expect(model).toBe('gpt-4');
        expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('terminail');
        expect(mockGet).toHaveBeenCalledWith('model', 'gpt-4');
    });
});