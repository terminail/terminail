/**
 * End-to-End Test: TerminAI Extension Functionality
 * 
 * This test verifies that the TerminAI extension works correctly
 * in a real VS Code environment.
 */

const vscode = require('vscode');

async function testTerminAIExtension() {
    console.log('=== TerminAI Extension End-to-End Test ===\n');
    
    try {
        // Get the extension
        const extension = vscode.extensions.getExtension('TerminAI.terminai');
        if (!extension) {
            throw new Error('TerminAI extension not found');
        }

        // Activate the extension if not already active
        if (!extension.isActive) {
            await extension.activate();
            console.log('✅ Extension activated');
        } else {
            console.log('✅ Extension already active');
        }

        // Verify the extension is working
        if (extension.isActive) {
            console.log('✅ Extension is active and running');
            
            // Test 1: Verify the main command is registered
            console.log('\n1. Verifying main command registration...');
            const commands = await vscode.commands.getCommands(true);
            const hasMainCommand = commands.includes('terminai.openTerminal');
            
            if (!hasMainCommand) {
                throw new Error('Main command not registered');
            }
            console.log('✅ Main command is registered');
            
            // Test 2: Execute the main command
            console.log('\n2. Executing main command...');
            await vscode.commands.executeCommand('terminai.openTerminal');
            console.log('✅ Main command executed successfully');
            
            console.log('\n🎉 TerminAI Extension End-to-End Test PASSED!');
            console.log('\nSummary of verified functionality:');
            console.log('- Main command is properly registered');
            console.log('- Main command can be executed without errors');
            console.log('- Extension can be activated successfully');
            
            return true;
        } else {
            throw new Error('Extension failed to activate');
        }
    } catch (error) {
        console.error('❌ TerminAI Extension End-to-End Test FAILED:', error.message);
        console.log('\nTroubleshooting steps:');
        console.log('1. Verify that the main command is registered in package.json');
        console.log('2. Verify that the command is registered in extension.ts with the exact same name');
        console.log('3. Check that the extension activates correctly');
        console.log('4. Ensure all required dependencies are available');
        
        return false;
    }
}

// Run the test if called directly
if (require.main === module) {
    testTerminAIExtension().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Test execution error:', error);
        process.exit(1);
    });
}

module.exports = { testTerminAIExtension };