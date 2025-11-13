#!/usr/bin/env node

/**
 * Integration Test Runner
 * 
 * This script runs integration tests for the TerminAI extension.
 */

const { exec } = require('child_process');
const path = require('path');

async function runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
        console.log(`Running: ${command}`);
        
        const process = exec(command, {
            cwd: path.join(__dirname, '..', '..'),
            ...options
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString();
            if (!options.silent) {
                process.stdout.write(data);
            }
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString();
            if (!options.silent) {
                process.stderr.write(data);
            }
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve({ code, stdout, stderr });
            } else {
                reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
            }
        });

        process.on('error', (error) => {
            reject(error);
        });
    });
}

async function runIntegrationTests() {
    console.log('=== TerminAI Extension Integration Tests ===\n');
    
    try {
        // Run integration tests using npm
        console.log('Running integration tests...');
        await runCommand('npm run test:integration');
        console.log('✅ Integration tests completed successfully!\n');
        
        console.log('🎉 All integration tests passed!');
        console.log('\nSummary of what was tested:');
        console.log('- Configuration management integration with VS Code');
        console.log('- TerminAIManager integration with VS Code APIs');
        console.log('- Command registration and handling');
        
    } catch (error) {
        console.error('❌ Integration tests failed:', error.message);
        process.exit(1);
    }
}

// Run the integration tests
if (require.main === module) {
    runIntegrationTests();
}

module.exports = { runIntegrationTests };