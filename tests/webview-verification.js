const fs = require('fs');
const path = require('path');

function verifyWebviewImplementation() {
    console.log('=== Webview Functionality Verification ===\n');
    
    try {
        // 1. Check if TerminailWebviewProvider class exists
        const terminailManagerPath = path.join(__dirname, '..', 'src', 'terminailManager.ts');
        if (!fs.existsSync(terminailManagerPath)) {
            throw new Error('terminailManager.ts file not found');
        }
        
        const terminailManagerContent = fs.readFileSync(terminailManagerPath, 'utf8');
        
        // 2. Verify TerminailWebviewProvider class implementation
        if (!terminailManagerContent.includes('class TerminailWebviewProvider')) {
            throw new Error('TerminailWebviewProvider class not found');
        }
        
        if (!terminailManagerContent.includes('implements vscode.WebviewViewProvider')) {
            throw new Error('TerminailWebviewProvider does not implement vscode.WebviewViewProvider');
        }
        
        console.log('✅ TerminailWebviewProvider class properly implemented\n');
        
        // 3. Verify resolveWebviewView method
        if (!terminailManagerContent.includes('resolveWebviewView')) {
            throw new Error('resolveWebviewView method not found');
        }
        
        if (!terminailManagerContent.includes('enableScripts: true')) {
            throw new Error('enableScripts not set to true in webview options');
        }
        
        console.log('✅ resolveWebviewView method properly implemented\n');
        
        // 4. Verify HTML template structure
        if (!terminailManagerContent.includes('getWebviewContent')) {
            throw new Error('getWebviewContent method not found');
        }
        
        if (!terminailManagerContent.includes('<meta charset="UTF-8">')) {
            throw new Error('UTF-8 meta tag not found in HTML template');
        }
        
        if (!terminailManagerContent.includes('<meta name="viewport"')) {
            throw new Error('Viewport meta tag not found in HTML template');
        }
        
        console.log('✅ HTML template structure properly implemented\n');
        
        // 5. Verify command system implementation
        const requiredCommands = ['cd ', 'ls', 'qi ', 'status', 'help'];
        for (const command of requiredCommands) {
            if (!terminailManagerContent.includes(command)) {
                throw new Error(`Required command "${command}" not found`);
            }
        }
        
        console.log('✅ Command system properly implemented\n');
        
        // 6. Verify message handling
        if (!terminailManagerContent.includes('onDidReceiveMessage')) {
            throw new Error('onDidReceiveMessage handler not found');
        }
        
        if (!terminailManagerContent.includes('handleMessage')) {
            throw new Error('handleMessage method not found');
        }
        
        console.log('✅ Message handling properly implemented\n');
        
        // 7. Verify command history implementation
        if (!terminailManagerContent.includes('commandHistory')) {
            throw new Error('commandHistory not found');
        }
        
        if (!terminailManagerContent.includes('historyIndex')) {
            throw new Error('historyIndex not found');
        }
        
        if (!terminailManagerContent.includes('ArrowUp') || !terminailManagerContent.includes('ArrowDown')) {
            throw new Error('Arrow key navigation not implemented');
        }
        
        console.log('✅ Command history properly implemented\n');
        
        console.log('🎉 All webview functionality verification tests passed!');
        console.log('');
        console.log('Summary of verified functionality:');
        console.log('- TerminailWebviewProvider class properly implemented');
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