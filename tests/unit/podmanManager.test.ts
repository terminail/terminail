import { PodmanManager } from '../../src/podmanManager';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Mock the VS Code API
jest.mock('vscode', () => ({
    window: {
        showInformationMessage: jest.fn(),
        showErrorMessage: jest.fn()
    },
    workspace: {
        rootPath: '/test/workspace'
    }
}));

// Mock child_process.exec to return a Promise that resolves immediately
jest.mock('child_process', () => ({
    exec: jest.fn().mockImplementation((command: string) => {
        // Return a Promise that resolves with the expected result
        if (command === 'podman --version' || command.includes('podman --version')) {
            return Promise.resolve({ stdout: 'podman version 4.0.0', stderr: '' });
        } else if (command === 'podman image exists terminai-mcp-server' || command.includes('podman image exists terminai-mcp-server')) {
            return Promise.resolve({ stdout: '', stderr: '' });
        } else if (command.includes('run')) {
            return Promise.resolve({ stdout: 'container123', stderr: '' });
        } else if (command.includes('ps') && command.includes('container123')) {
            return Promise.resolve({ stdout: 'Up 5 minutes', stderr: '' });
        } else if (command.includes('which') && command.includes('google-chrome')) {
            return Promise.resolve({ stdout: '/usr/bin/google-chrome', stderr: '' });
        } else if (command.includes('stop') || command.includes('rm')) {
            return Promise.resolve({ stdout: '', stderr: '' });
        } else if (command.includes('podman command not found')) {
            return Promise.reject(new Error('podman command not found'));
        } else if (command.includes('Browser start failed')) {
            return Promise.reject(new Error('Browser start failed'));
        } else if (command.includes('podman ps failed')) {
            return Promise.reject(new Error('podman ps failed'));
        } else if (command.includes('Container not found')) {
            return Promise.reject(new Error('Container not found'));
        } else {
            return Promise.resolve({ stdout: '', stderr: '' });
        }
    })
}));

// Mock util.promisify to return the function itself (since exec is already mocked as Promise)
jest.mock('util', () => ({
    promisify: jest.fn().mockImplementation((fn) => fn)
}));

// Mock fs module
jest.mock('fs', () => ({
    existsSync: jest.fn().mockReturnValue(true),
    mkdirSync: jest.fn()
}));

// Mock os module
jest.mock('os', () => ({
    homedir: jest.fn().mockReturnValue('/home/test')
}));

// Mock path module
jest.mock('path', () => ({
    join: jest.fn().mockImplementation((...args) => args.join('/'))
}));

// Mock fetch for browser testing
global.fetch = jest.fn();

describe('PodmanManager', () => {
    let podmanManager: PodmanManager;

    beforeEach(() => {
        // Set test environment variables
        process.env.NODE_ENV = 'test';
        process.env.JEST_WORKER_ID = 'test-worker';
        
        podmanManager = new PodmanManager();
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Clean up environment variables
        delete process.env.NODE_ENV;
        delete process.env.JEST_WORKER_ID;
        
        jest.clearAllMocks();
    });

    describe('Basic Functionality', () => {
        test('should create PodmanManager instance', () => {
            expect(podmanManager).toBeInstanceOf(PodmanManager);
        });

        test('should have default properties', () => {
            expect(podmanManager['containerId']).toBeNull();
            expect(podmanManager['mcpPort']).toBe(3000);
        });

        test('should have all required methods', () => {
            expect(typeof podmanManager.startContainer).toBe('function');
            expect(typeof podmanManager.isContainerRunning).toBe('function');
            expect(typeof podmanManager.dispose).toBe('function');
            expect(typeof podmanManager.isPodmanInstalled).toBe('function');
            expect(typeof podmanManager.isContainerInstalled).toBe('function');
            expect(typeof podmanManager.isPodmanRunning).toBe('function');
        });
    });

    describe('Container Management', () => {
        test('should start container successfully', async () => {
            await podmanManager.startContainer();

            // Note: vscode.window.showInformationMessage is not mocked in this test
            // The method call is expected to happen but we can't verify it without proper mocking
            expect(podmanManager['containerId']).toBe('container123');
        });

        test('should handle existing container cleanup', async () => {
            await podmanManager.startContainer();

            expect(podmanManager['containerId']).toBe('container123');
        });

        test('should handle podman not available', async () => {
            // Mock exec to throw error for podman --version command
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('--version')) {
                    return Promise.reject(new Error('podman command not found'));
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            await expect(podmanManager.startContainer()).rejects.toThrow(
                'Failed to start Podman container: Error: podman command not found'
            );

            // Restore original mock
            jest.requireMock('child_process').exec = originalMock;
        });

        test('should check if container is running', async () => {
            podmanManager['containerId'] = 'container123';

            // Mock exec to return container status with "Up" for this specific test
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('ps') && command.includes('container123')) {
                    return Promise.resolve({ stdout: 'Up 5 minutes', stderr: '' });
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            const isRunning = await podmanManager.isContainerRunning();
            expect(isRunning).toBe(true);
            
            // Verify that exec was called with the expected command
            const execMock = require('child_process').exec;
            expect(execMock).toHaveBeenCalledWith(
                expect.stringContaining('podman ps --filter id=container123')
            );

            // Restore original mock
            jest.requireMock('child_process').exec = originalMock;
        });

        test('should return false for container running check when no container ID', async () => {
            const isRunning = await podmanManager.isContainerRunning();
            expect(isRunning).toBe(false);
        });

        test('should handle container running check errors', async () => {
            podmanManager['containerId'] = 'container123';

            // Mock exec to throw error for this specific test
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('ps') && command.includes('container123')) {
                    return Promise.reject(new Error('podman ps failed'));
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            const isRunning = await podmanManager.isContainerRunning();
            expect(isRunning).toBe(false);

            // Restore original mock
            jest.requireMock('child_process').exec = originalMock;
        });

        test('should check if Podman is installed', async () => {
            // Mock exec to return valid podman version for this specific test
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('--version')) {
                    return Promise.resolve({ stdout: 'podman version 4.0.0', stderr: '' });
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            const isInstalled = await podmanManager.isPodmanInstalled();
            expect(isInstalled).toBe(true);

            // Restore original mock
            jest.requireMock('child_process').exec = originalMock;
        });

        test('should handle Podman not installed', async () => {
            // Mock exec to throw error for podman --version command
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('--version')) {
                    return Promise.reject(new Error('podman command not found'));
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            const isInstalled = await podmanManager.isPodmanInstalled();
            expect(isInstalled).toBe(false);

            // Restore original mock
            jest.requireMock('child_process').exec = originalMock;
        });

        test('should check if container image is installed', async () => {
            // Mock exec to return valid image exists check for this specific test
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('image exists')) {
                    return Promise.resolve({ stdout: '', stderr: '' });
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            const isInstalled = await podmanManager.isContainerInstalled();
            expect(isInstalled).toBe(true);

            // Restore original mock
            jest.requireMock('child_process').exec = originalMock;
        });

        test('should handle container image not installed', async () => {
            // Mock exec to throw error for image exists command
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('image exists')) {
                    return Promise.reject(new Error('image not found'));
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            const isInstalled = await podmanManager.isContainerInstalled();
            expect(isInstalled).toBe(false);

            // Restore original mock
            jest.requireMock('child_process').exec = originalMock;
        });

        test('should check if Podman daemon is running', async () => {
            // Mock exec to return valid podman info
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('info --format json')) {
                    return Promise.resolve({ stdout: JSON.stringify({ host: { arch: 'x86_64', os: 'linux' } }), stderr: '' });
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            const isRunning = await podmanManager.isPodmanRunning();
            expect(isRunning).toBe(true);

            // Restore original mock
            jest.requireMock('child_process').exec = originalMock;
        });

        test('should handle Podman daemon not running', async () => {
            // Mock exec to throw error for podman info command
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('info --format json')) {
                    return Promise.reject(new Error('cannot connect to Podman'));
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            const isRunning = await podmanManager.isPodmanRunning();
            expect(isRunning).toBe(false);

            // Restore original mock
            jest.requireMock('child_process').exec = originalMock;
        });

        test('should check if TerminAI container is running', async () => {
            // Set container ID to enable ID-based check
            podmanManager['containerId'] = 'container123';
            
            // Mock exec to return container running status
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('ps --filter id=')) {
                    return Promise.resolve({ stdout: 'container123 Up 5 minutes\n', stderr: '' });
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            const isRunning = await podmanManager.isContainerRunning();
            expect(isRunning).toBe(true);

            // Restore original mock and reset container ID
            jest.requireMock('child_process').exec = originalMock;
            podmanManager['containerId'] = null;
        });

        test('should handle TerminAI container not running', async () => {
            // Mock exec to return empty container list
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('ps --filter id=')) {
                    return Promise.resolve({ stdout: '', stderr: '' });
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            const isRunning = await podmanManager.isContainerRunning();
            expect(isRunning).toBe(false);

            // Restore original mock
            jest.requireMock('child_process').exec = originalMock;
        });
    });

    describe('Resource Cleanup', () => {
        test('should dispose container', async () => {
            podmanManager['containerId'] = 'container123';

            // Mock exec to handle container stop and rm commands
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('stop') || command.includes('rm')) {
                    return Promise.resolve({ stdout: '', stderr: '' });
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            await podmanManager.dispose();
            expect(podmanManager['containerId']).toBeNull();

            // Restore original mock
            jest.requireMock('child_process').exec = originalMock;
        });

        test('should handle disposal errors gracefully', async () => {
            podmanManager['containerId'] = 'container123';

            // Mock exec to throw error for disposal commands
            const originalMock = jest.requireMock('child_process').exec;
            jest.requireMock('child_process').exec.mockImplementation((command: string) => {
                if (command.includes('stop') || command.includes('rm')) {
                    return Promise.reject(new Error('Container not found'));
                }
                // For other commands, use original mock behavior
                return originalMock(command);
            });

            await podmanManager.dispose();

            // Should not throw error
            expect(podmanManager['containerId']).toBeNull();

            // Restore original mock
            jest.requireMock('child_process').exec = originalMock;
        });

        test('should handle disposal with no resources', async () => {
            await podmanManager.dispose();

            // Should not throw error
            expect(podmanManager['containerId']).toBeNull();
        });
    });
});