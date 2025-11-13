import * as vscode from 'vscode';
import { TerminAIWebviewProvider } from './terminAIManager';

export function activate(context: vscode.ExtensionContext) {
    console.log('TerminAI extension is now active!');

    // Create and register Webview provider
    const provider = new TerminAIWebviewProvider(context.extensionUri);
    
    // Register Webview view provider
    const viewRegistration = vscode.window.registerWebviewViewProvider(
        'terminai.terminalView',
        provider
    );

    // Register commands

    const openTerminalCommand = vscode.commands.registerCommand('terminai.openTerminal', async () => {

        // Display Webview view - the view will appear in the panel area alongside other views

        // Users can access it through the panel dropdown

        console.log('Opening TerminAI Terminal in panel');

    });

    context.subscriptions.push(viewRegistration, openTerminalCommand, provider);
}