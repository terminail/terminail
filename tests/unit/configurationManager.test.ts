import { ConfigurationManager } from '../../src/configurationManager';
import * as vscode from 'vscode';

// Mock the VS Code API
jest.mock('vscode', () => ({
    workspace: {
        getConfiguration: jest.fn()
    },
    window: {
        showErrorMessage: jest.fn(),
        showInformationMessage: jest.fn()
    },
    commands: {
        executeCommand: jest.fn()
    },
    ConfigurationTarget: {
        Global: 1,
        Workspace: 2,
        WorkspaceFolder: 3
    }
}));

describe('ConfigurationManager', () => {
    let configurationManager: ConfigurationManager;
    let mockConfig: any;

    beforeEach(() => {
        // 设置默认的mock配置
        mockConfig = {
            get: jest.fn().mockReturnValue(undefined),
            update: jest.fn().mockResolvedValue(undefined)
        };
        
        (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue(mockConfig);
        configurationManager = new ConfigurationManager();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Basic Functionality', () => {
        test('should create ConfigurationManager instance', () => {
            expect(configurationManager).toBeInstanceOf(ConfigurationManager);
        });

        test('should have getApiKey method', () => {
            expect(typeof configurationManager.getApiKey).toBe('function');
        });

        test('should have getModel method', () => {
            expect(typeof configurationManager.getModel).toBe('function');
        });

        test('should have getMaxTokens method', () => {
            expect(typeof configurationManager.getMaxTokens).toBe('function');
        });

        test('should have updateApiKey method', () => {
            expect(typeof configurationManager.updateApiKey).toBe('function');
        });

        test('should have updateModel method', () => {
            expect(typeof configurationManager.updateModel).toBe('function');
        });

        test('should have updateMaxTokens method', () => {
            expect(typeof configurationManager.updateMaxTokens).toBe('function');
        });

        test('should have isValidConfiguration method', () => {
            expect(typeof configurationManager.isValidConfiguration).toBe('function');
        });

        test('should have getConfigurationSummary method', () => {
            expect(typeof configurationManager.getConfigurationSummary).toBe('function');
        });

        test('should have openSettings method', () => {
            expect(typeof configurationManager.openSettings).toBe('function');
        });

        test('should have validateApiKeyFormat method', () => {
            expect(typeof configurationManager.validateApiKeyFormat).toBe('function');
        });

        test('should have getAvailableModels method', () => {
            expect(typeof configurationManager.getAvailableModels).toBe('function');
        });

        test('should have isModelSupported method', () => {
            expect(typeof configurationManager.isModelSupported).toBe('function');
        });
    });

    describe('API Key Management', () => {
        test('should return empty string when API key is not set', () => {
            mockConfig.get.mockImplementation((key: string, defaultValue?: any) => {
                if (key === 'apiKey') {
                    return defaultValue !== undefined ? defaultValue : '';
                }
                return defaultValue !== undefined ? defaultValue : undefined;
            });
            
            const apiKey = configurationManager.getApiKey();
            expect(apiKey).toBe('');
        });
        
        test('should return API key when set', () => {
            mockConfig.get.mockImplementation((key: string, defaultValue?: any) => {
                if (key === 'apiKey') {
                    return 'test-api-key-123456';
                }
                return defaultValue || undefined;
            });
            
            const apiKey = configurationManager.getApiKey();
            expect(apiKey).toBe('test-api-key-123456');
        });

        test('should update API key successfully', async () => {
            const newApiKey = 'new-api-key-789';
            
            await configurationManager.updateApiKey(newApiKey);
            
            expect(mockConfig.update).toHaveBeenCalledWith('apiKey', newApiKey, 1);
        });

        test('should validate API key format correctly', () => {
            // Test valid API key format (length >= 20 and contains underscore)
            const validApiKey = 'sk_1234567890abcdefghij';
            
            const isValid = configurationManager.validateApiKeyFormat(validApiKey);
            expect(isValid).toBe(true);

            // Test invalid API key format (too short)
            const invalidApiKey = 'sk-123';
            expect(configurationManager.validateApiKeyFormat(invalidApiKey)).toBe(false);

            // Test invalid API key format (missing underscore)
            const invalidApiKey2 = 'sk1234567890abcdefghij';
            expect(configurationManager.validateApiKeyFormat(invalidApiKey2)).toBe(false);
        });
    });

    describe('Model Configuration', () => {
        test('should return default model when not set', () => {
            mockConfig.get.mockImplementation((key: string, defaultValue?: any) => {
                if (key === 'model') {
                    return defaultValue !== undefined ? defaultValue : 'gpt-4';
                }
                return defaultValue !== undefined ? defaultValue : undefined;
            });
            
            const model = configurationManager.getModel();
            expect(model).toBe('gpt-4');
        });
        
        test('should return configured model when set', () => {
            mockConfig.get.mockImplementation((key: string, defaultValue?: any) => {
                if (key === 'model') {
                    return 'gpt-3.5-turbo';
                }
                return defaultValue || undefined;
            });
            
            const model = configurationManager.getModel();
            expect(model).toBe('gpt-3.5-turbo');
        });

        test('should update model successfully', async () => {
            const newModel = 'gpt-4-turbo';
            
            await configurationManager.updateModel(newModel);
            
            expect(mockConfig.update).toHaveBeenCalledWith('model', newModel, 1);
        });

        test('should check if model is supported', () => {
            const supportedModels = ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'];
            
            // Mock getAvailableModels to return supported models
            configurationManager.getAvailableModels = jest.fn().mockReturnValue(supportedModels);
            
            const isSupported = configurationManager.isModelSupported('gpt-4');
            expect(isSupported).toBe(true);
            
            const isNotSupported = configurationManager.isModelSupported('unknown-model');
            expect(isNotSupported).toBe(false);
        });
    });

    describe('Max Tokens Configuration', () => {
        test('should return default max tokens when not set', () => {
            mockConfig.get.mockImplementation((key: string, defaultValue?: any) => {
                if (key === 'maxTokens') {
                    return defaultValue !== undefined ? defaultValue : 1000;
                }
                return defaultValue !== undefined ? defaultValue : undefined;
            });
            
            const maxTokens = configurationManager.getMaxTokens();
            expect(maxTokens).toBe(1000);
        });
        
        test('should return configured max tokens when set', () => {
            mockConfig.get.mockImplementation((key: string, defaultValue?: any) => {
                if (key === 'maxTokens') {
                    return 2000;
                }
                return defaultValue || undefined;
            });
            
            const maxTokens = configurationManager.getMaxTokens();
            expect(maxTokens).toBe(2000);
        });

        test('should update max tokens successfully', async () => {
            const newMaxTokens = 1500;
            
            await configurationManager.updateMaxTokens(newMaxTokens);
            
            expect(mockConfig.update).toHaveBeenCalledWith('maxTokens', newMaxTokens, 1);
        });

        test('should validate max tokens range', () => {
            // Test default value
            mockConfig.get.mockImplementation((key: string, defaultValue?: any) => {
                if (key === 'maxTokens') return defaultValue !== undefined ? defaultValue : 1000;
                return defaultValue !== undefined ? defaultValue : undefined;
            });
            
            const defaultTokens = configurationManager.getMaxTokens();
            expect(typeof defaultTokens).toBe('number');
            expect(defaultTokens).toBe(1000);

            // Test edge cases
            mockConfig.get.mockImplementation((key: string, defaultValue?: any) => {
                if (key === 'maxTokens') return 0;
                return defaultValue;
            });
            expect(configurationManager.getMaxTokens()).toBe(0);

            mockConfig.get.mockImplementation((key: string, defaultValue?: any) => {
                if (key === 'maxTokens') return 10000;
                return defaultValue;
            });
            expect(configurationManager.getMaxTokens()).toBe(10000);
        });
    });

    describe('Configuration Validation', () => {
        test('should validate configuration as invalid when API key is empty', () => {
            mockConfig.get.mockImplementation((key: string, defaultValue?: any) => {
                if (key === 'apiKey') {
                    return '';
                }
                return defaultValue || undefined;
            });
            
            const isValid = configurationManager.isValidConfiguration();
            expect(isValid).toBe(false);
        });

        test('should validate configuration as valid when API key is present', () => {
            mockConfig.get.mockImplementation((key: string, defaultValue?: any) => {
                if (key === 'apiKey') {
                    return 'valid-api-key';
                }
                return defaultValue || undefined;
            });
            
            const isValid = configurationManager.isValidConfiguration();
            expect(isValid).toBe(true);
        });

        test('should provide configuration summary', () => {
            mockConfig.get.mockImplementation((key: string, defaultValue?: any) => {
                if (key === 'apiKey') {
                    return 'test-api-key';
                } else if (key === 'model') {
                    return 'gpt-4';
                } else if (key === 'maxTokens') {
                    return 1000;
                }
                return defaultValue || undefined;
            });
            
            const summary = configurationManager.getConfigurationSummary();
            expect(typeof summary).toBe('string');
            expect(summary).toContain('gpt-4');
            expect(summary).toContain('1000');
        });
    });

    describe('Error Handling', () => {
        test('should handle configuration update errors gracefully', async () => {
            mockConfig.update.mockRejectedValue(new Error('Update failed'));
            
            await expect(configurationManager.updateApiKey('test-key')).rejects.toThrow('Update failed');
        });

        test('should handle configuration retrieval errors gracefully', () => {
            mockConfig.get.mockImplementation(() => {
                throw new Error('Config retrieval failed');
            });
            
            expect(() => configurationManager.getApiKey()).toThrow('Config retrieval failed');
        });
    });

    describe('Available Models', () => {
        test('should return available models', () => {
            const models = configurationManager.getAvailableModels();
            expect(Array.isArray(models)).toBe(true);
            expect(models.length).toBeGreaterThan(0);
        });

        test('should include common AI models', () => {
            const models = configurationManager.getAvailableModels();
            expect(models).toContain('gpt-4');
            expect(models).toContain('gpt-3.5-turbo');
        });
    });
});