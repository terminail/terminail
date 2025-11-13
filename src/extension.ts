import * as vscode from 'vscode';
import { TerminailWebviewProvider } from './terminailManager';

export function activate(context: vscode.ExtensionContext) {
    console.log('Terminail extension is now active!');

    // Create and register Webview provider
    const provider = new TerminailWebviewProvider(context.extensionUri);
    
    // Register Webview view provider
    const viewRegistration = vscode.window.registerWebviewViewProvider(
        'terminail.terminalView',
        provider
    );

    // Register commands

    const openTerminalCommand = vscode.commands.registerCommand('terminail.openTerminal', async () => {

        // Display Webview view - the view will appear in the panel area alongside other views

        // Users can access it through the panel dropdown

        console.log('Opening Terminail Terminal in panel');

    });

    context.subscriptions.push(viewRegistration, openTerminalCommand, provider);
}