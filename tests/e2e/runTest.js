const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Full E2E test runner for TerminAI using actual VS Code environment
 */
async function runTests() {
    console.log('🚀 Starting TerminAI E2E Test Suite (Full VS Code Environment)...\n');
    
    try {
        // 1. Check if VS Code is available
        console.log('1. Checking VS Code availability...');
        try {
            execSync('code --version', { stdio: 'pipe' });
            console.log('✅ VS Code is available');
        } catch (error) {
            console.error('❌ VS Code command not found. Please ensure VS Code is installed and the `code` command is in your PATH');
            process.exit(1);
        }

        // 2. Package the extension
        console.log('2. Packaging TerminAI extension...');
        try {
            execSync('npm run package', { stdio: 'inherit' });
            console.log('✅ Extension packaged successfully');
        } catch (error) {
            console.error('❌ Failed to package extension');
            process.exit(1);
        }

        // 3. Install the extension
        console.log('3. Installing TerminAI extension...');
        const vsixPath = path.resolve(__dirname, '..', '..', 'terminai-0.1.0.vsix');
        
        if (!fs.existsSync(vsixPath)) {
            console.error(`❌ VSIX file not found at: ${vsixPath}`);
            process.exit(1);
        }

        try {
            execSync(`code --install-extension "${vsixPath}" --force`, { stdio: 'inherit' });
            console.log('✅ Extension installed successfully');
        } catch (error) {
            console.error('❌ Failed to install extension');
            process.exit(1);
        }

        // 4. Run the Mocha-based E2E tests
        console.log('4. Running E2E tests with VS Code environment...');
        try {
            execSync('npm run test:e2e:terminal', { stdio: 'inherit' });
            console.log('✅ E2E tests completed successfully');
        } catch (error) {
            console.error('❌ E2E tests failed');
            process.exit(1);
        }

        // 5. Clean up: Uninstall the extension
        console.log('5. Cleaning up: Uninstalling extension...');
        try {
            execSync('code --uninstall-extension TerminAI.terminai', { stdio: 'pipe' });
            console.log('✅ Extension uninstalled successfully');
        } catch (error) {
            console.log('⚠️  Extension uninstall may have failed, but continuing...');
        }

        console.log('\n🎉 All E2E tests completed successfully with full VS Code environment!');
        process.exit(0);

    } catch (error) {
        console.error('❌ E2E test runner failed:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run tests
runTests();