const { testTerminailExtension } = require('./extension.test');
const { testCommandRegistration } = require('./verifyCommands.test');
const { testCompleteExtension } = require('./completeExtension.test');
const { testSidebarIcon } = require('./sidebarIcon.test');

async function run() {
  // This is a simplified test runner that just runs our verification
  console.log('Starting end-to-end tests...');
  
  try {
    // Run the extension functionality verification
    await testTerminailExtension();
    
    // Run the command registration verification
    await testCommandRegistration();
    
    // Run the complete extension functionality test
    await testCompleteExtension();
    
    // Run the sidebar icon verification
    await testSidebarIcon();
    
    console.log('✅ All end-to-end tests passed!');
    return Promise.resolve();
  } catch (error) {
    console.error('❌ End-to-End tests failed:', error);
    return Promise.reject(error);
  }
}

module.exports = {
  run
};