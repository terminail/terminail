// E2E Test Setup File
// This file sets up the testing environment for E2E tests

const path = require('path');

// Add project root to module path
const projectRoot = path.resolve(__dirname, '..', '..', '..');
require('module').Module._nodeModulePaths(projectRoot);

// Global test configuration
global.TEST_TIMEOUT = 30000;
global.EXTENSION_ID = 'TerminAI.terminai';

// Setup global error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

console.log('E2E Test Environment Setup Complete');