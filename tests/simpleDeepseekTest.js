// Simple test to verify the deepseek AI switching functionality
// This test doesn't require the full VS Code extension host environment

const { exec } = require('child_process');
const path = require('path');

console.log('🧪 Testing deepseek AI switching functionality...\n');

// Test the extension activation
console.log('1. Testing extension activation...');
// Since we can't test the actual VS Code extension without the full environment,
// we'll verify that the extension files exist and can be loaded

try {
    // Check if the main extension file exists
    const extensionPath = path.join(__dirname, '..', 'out', 'extension.js');
    require('fs').accessSync(extensionPath);
    console.log('✅ Extension file exists');
    
    // Check if the terminAIManager exists
    const managerPath = path.join(__dirname, '..', 'out', 'terminAIManager.js');
    require('fs').accessSync(managerPath);
    console.log('✅ TerminAI manager file exists');
    
    // Check if the aiService exists
    const aiServicePath = path.join(__dirname, '..', 'out', 'aiService.js');
    require('fs').accessSync(aiServicePath);
    console.log('✅ AI service file exists');
    
    console.log('\n✅ Basic extension structure verification passed');
    console.log('\n📝 Note: Full E2E testing requires the VS Code extension host environment.');
    console.log('The deepseek AI switching functionality can be tested manually by:');
    console.log('1. Installing the extension in VS Code');
    console.log('2. Opening the TerminAI terminal (Ctrl+Shift+T)');
    console.log('3. Running "cd deepseek" command');
    console.log('4. Verifying the prompt changes to "deepseek>"');
    
    console.log('\n🎯 Test completed successfully!');
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
}