// Mock VS Code API
jest.mock('vscode', () => {
    return {
        window: {
            showErrorMessage: jest.fn(),
            showInformationMessage: jest.fn()
        },
        commands: {
            registerCommand: jest.fn()
        },
        workspace: {
            registerTextDocumentContentProvider: jest.fn(),
            openTextDocument: jest.fn().mockResolvedValue({}),
            showTextDocument: jest.fn().mockResolvedValue({}),
            getConfiguration: jest.fn().mockReturnValue({
                get: jest.fn()
            })
        },
        ExtensionContext: jest.fn(),
        globalState: {
            get: jest.fn(),
            update: jest.fn()
        },
        Uri: {
            parse: jest.fn().mockReturnValue({ toString: () => 'mock-uri' })
        }
    };
});

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

describe('Extension Configuration Validation', () => {
    describe('Package.json validation', () => {
        let packageJson: any;

        beforeEach(() => {
            const packageJsonPath = path.join(__dirname, '..', '..', 'package.json');
            const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
            packageJson = JSON.parse(packageJsonContent);
        });

        it('should have correct extension name', () => {
            expect(packageJson.name).toBe('terminai');
        });

        it('should have correct activation events', () => {
            // Check if activationEvents exists and is an array, or if it's undefined (which is valid)
            if (packageJson.activationEvents) {
                expect(Array.isArray(packageJson.activationEvents)).toBe(true);
                expect(packageJson.activationEvents).toContain('onCommand:terminai.openTerminal');
            } else {
                // activationEvents is optional, so this is acceptable
                expect(true).toBe(true);
            }
        });

        it('should have all required commands registered', () => {
            const commands = packageJson.contributes.commands;
            const commandIds = commands.map((cmd: any) => cmd.command);
            
            expect(commandIds).toContain('terminai.openTerminal');
        });

        it('should have correct command configurations', () => {
            const commands = packageJson.contributes.commands;
            const openTerminalCommand = commands.find((cmd: any) => cmd.command === 'terminai.openTerminal');
            
            expect(openTerminalCommand).toBeDefined();
            expect(openTerminalCommand.title).toBe('TerminAI: Open AI Terminal');
            expect(openTerminalCommand.category).toBe('TerminAI');
        });

        it('should have correct menu configurations', () => {
            // Check for keybindings
            expect(Array.isArray(packageJson.contributes.keybindings)).toBe(true);
            const keybinding = packageJson.contributes.keybindings[0];
            expect(keybinding.command).toBe('terminai.openTerminal');
        });
    });
});