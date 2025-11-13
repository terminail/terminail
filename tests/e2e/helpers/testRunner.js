// Full VS Code E2E Test Runner for Terminail
// This runner requires a real VS Code instance with the Terminail extension installed

const vscode = require('vscode');

class TerminailTestRunner {
    constructor() {
        this.extension = null;
        this.isActive = false;
        this.terminals = new Map();
    }

    async activateExtension() {
        try {
            // Get the Terminail extension
            this.extension = vscode.extensions.getExtension('Terminail.terminail');
            if (!this.extension) {
                throw new Error('Terminail extension not found. Please install the extension first.');
            }

            // Activate the extension
            await this.extension.activate();
            this.isActive = true;
            console.log('✅ Terminail extension activated successfully');
            
            return this.extension;
        } catch (error) {
            console.error('❌ Failed to activate Terminail extension:', error);
            throw error;
        }
    }

    async openTerminailTerminal() {
        if (!this.isActive) {
            throw new Error('Extension not active');
        }

        try {
            // Execute the command to open Terminail terminal
            await vscode.commands.executeCommand('terminail.openTerminal');
            
            // Wait for terminal to be ready
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('✅ Terminail terminal opened successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to open Terminail terminal:', error);
            throw error;
        }
    }

    async executeCommand(command, args = []) {
        if (!this.isActive) {
            throw new Error('Extension not active');
        }

        try {
            const result = await vscode.commands.executeCommand(command, ...args);
            console.log(`✅ Command '${command}' executed successfully`);
            return result;
        } catch (error) {
            console.error(`❌ Command '${command}' failed:`, error);
            throw error;
        }
    }

    async createTerminal(name = 'Terminail Terminal') {
        if (!this.isActive) {
            throw new Error('Extension not active');
        }

        try {
            const terminal = vscode.window.createTerminal(name);
            terminal.show();
            
            // Store the terminal for later use
            this.terminals.set(name, terminal);
            
            console.log(`✅ Terminal '${name}' created successfully`);
            return terminal;
        } catch (error) {
            console.error('❌ Failed to create terminal:', error);
            throw error;
        }
    }

    async sendTextToTerminal(terminal, text) {
        if (!this.isActive) {
            throw new Error('Extension not active');
        }

        try {
            terminal.sendText(text);
            console.log(`✅ Text sent to terminal: ${text}`);
        } catch (error) {
            console.error('❌ Failed to send text to terminal:', error);
            throw error;
        }
    }

    async captureTerminalOutput(terminal, timeout = 5000) {
        if (!this.isActive) {
            throw new Error('Extension not active');
        }

        try {
            // This is a simplified implementation
            // In a real scenario, you would need to capture the terminal output
            // which requires more complex handling
            await new Promise(resolve => setTimeout(resolve, timeout));
            
            // For now, return a mock response
            return "Command executed successfully";
        } catch (error) {
            console.error('❌ Failed to capture terminal output:', error);
            throw error;
        }
    }

    async waitForResponse(timeout = 5000) {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    async cleanup() {
        try {
            // Close any open terminals
            for (const terminal of this.terminals.values()) {
                terminal.dispose();
            }
            this.terminals.clear();
            
            // Close any open panels
            await vscode.commands.executeCommand('workbench.action.closePanel');
            
            this.isActive = false;
            this.extension = null;
            
            console.log('✅ TerminailTestRunner cleaned up successfully');
        } catch (error) {
            console.error('❌ Failed to cleanup test runner:', error);
            throw error;
        }
    }

    dispose() {
        this.isActive = false;
        this.extension = null;
        this.terminals.clear();
    }
}

module.exports = TerminailTestRunner;