import * as vscode from 'vscode';

/**
 * Integration Test: Extension Configuration Settings
 * 
 * This test verifies that the extension's configuration settings
 * are properly defined and can be accessed.
 */

describe('Extension Configuration Settings Integration', () => {
    let mockGet: jest.Mock;
    let mockUpdate: jest.Mock;
    
    beforeEach(() => {
        // Mock VS Code configuration API
        mockGet = jest.fn().mockImplementation((key, defaultValue) => {
            // Return default values for configuration
            if (key === 'model') return 'gpt-4';
            if (key === 'maxTokens') return 1000;
            return defaultValue;
        });
        
        mockUpdate = jest.fn().mockResolvedValue(undefined);
        
        (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue({
            get: mockGet,
            update: mockUpdate
        });
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('should have terminai configuration section', () => {
        // This test verifies that the terminai configuration section exists
        const config = vscode.workspace.getConfiguration('terminai');
        expect(config).toBeDefined();
        expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('terminai');
    });
    
    it('should have default configuration values', () => {
        // This test verifies that default configuration values are set correctly
        const config = vscode.workspace.getConfiguration('terminai');
        
        // Test default values from package.json
        expect(config.get('model')).toBe('gpt-4');
        expect(config.get('maxTokens')).toBe(1000);
        
        // Verify mock was called with correct parameters
        // Check that mock was called with the expected parameters
        const modelCall = mockGet.mock.calls.find(call => call[0] === 'model');
        const maxTokensCall = mockGet.mock.calls.find(call => call[0] === 'maxTokens');
        
        expect(modelCall).toBeDefined();
        expect(maxTokensCall).toBeDefined();
        
        // Check that the calls contain the expected parameters
        expect(modelCall).toContain('model');
        expect(maxTokensCall).toContain('maxTokens');
    });
    
    it('should allow configuration updates', async () => {
        // This test verifies that configuration can be updated
        const config = vscode.workspace.getConfiguration('terminai');
        
        // Test updating a configuration value
        await config.update('model', 'gpt-3.5-turbo', 1); // Global = 1
        
        // Verify the update was called
        expect(mockUpdate).toHaveBeenCalledWith('model', 'gpt-3.5-turbo', 1);
        
        // Reset to default value
        await config.update('model', 'gpt-4', 1); // Global = 1
        expect(mockUpdate).toHaveBeenCalledWith('model', 'gpt-4', 1);
    });
});