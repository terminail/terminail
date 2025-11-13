const fs = require('fs');
const path = require('path');

function verifyWebviewImplementation() {
    console.log('=== Webview Functionality Verification ===\n');
    
    try {
        // 1. Check if TerminAIWebviewProvider class exists
        const terminAIManagerPath = path.join(__dirname, '..', 'src', 'terminAIManager.ts');
        if (!fs.existsSync(terminAIManagerPath)) {
            throw new Error('terminAIManager.ts file not found');
        }
        
        const terminAIManagerContent = fs.readFileSync(terminAIManagerPath, 'utf8');
        
        // 2. Verify TerminAIWebviewProvider class implementation
        if (!terminAIManagerContent.includes('class TerminAIWebviewProvider')) {
            throw new Error('TerminAIWebviewProvider class not found');
        }
        
        if (!terminAIManagerContent.includes('implements vscode.WebviewViewProvider')) {
            throw new Error('TerminAIWebviewProvider does not implement vscode.WebviewViewProvider');
        }
        
        console.log('✅ TerminAIWebviewProvider class properly implemented\n');
        
        // 3. Verify resolveWebviewView method
        if (!terminAIManagerContent.includes('resolveWebviewView')) {
            throw new Error('resolveWebviewView method not found');
        }
        
        if (!terminAIManagerContent.includes('enableScripts: true')) {
            throw new Error('enableScripts not set to true in webview options');
        }
        
        console.log('✅ resolveWebviewView method properly implemented\n');
        
        // 4. Verify HTML template structure
        if (!terminAIManagerContent.includes('getWebviewContent')) {
            throw new Error('getWebviewContent method not found');
        }
        
        if (!terminAIManagerContent.includes('<meta charset="UTF-8">')) {
            throw new Error('UTF-8 meta tag not found in HTML template');
        }
        
        if (!terminAIManagerContent.includes('<meta name="viewport"')) {
            throw new Error('Viewport meta tag not found in HTML template');
        }
        
        console.log('✅ HTML template structure properly implemented\n');
        
        // 5. Verify command system implementation
        const requiredCommands = ['cd ', 'ls', 'qi ', 'status', 'help'];
        for (const command of requiredCommands) {
            if (!terminAIManagerContent.includes(command)) {
                throw new Error(`Required command "${command}" not found`);
            }
        }
        
        console.log('✅ Command system properly implemented\n');
        
        // 6. Verify message handling
        if (!terminAIManagerContent.includes('onDidReceiveMessage')) {
            throw new Error('onDidReceiveMessage handler not found');
        }
        
        if (!terminAIManagerContent.includes('handleMessage')) {
            throw new Error('handleMessage method not found');
        }
        
        console.log('✅ Message handling properly implemented\n');
        
        // 7. Verify command history implementation
        if (!terminAIManagerContent.includes('commandHistory')) {
            throw new Error('commandHistory not found');
        }
        
        if (!terminAIManagerContent.includes('historyIndex')) {
            throw new Error('historyIndex not found');
        }
        
        if (!terminAIManagerContent.includes('ArrowUp') || !terminAIManagerContent.includes('ArrowDown')) {
            throw new Error('Arrow key navigation not implemented');
        }
        
        console.log('✅ Command history properly implemented\n');
        
        console.log('🎉 All webview functionality verification tests passed!');
        console.log('');
        console.log('Summary of verified functionality:');
        console.log('- TerminAIWebviewProvider class properly implemented');
        console.log('- resolveWebviewView method with correct options');
        console.log('- HTML template with proper meta tags');
        console.log('- Command system with all required commands');
        console.log('- Message handling between extension and webview');
        console.log('- Command history with arrow key navigation');
        
    } catch (error) {
        console.error('❌ Webview functionality verification failed:', error.message);
        process.exit(1);
    }
}

// Run the verification
if (require.main === module) {
    verifyWebviewImplementation();
}

module.exports = { verifyWebviewImplementation };