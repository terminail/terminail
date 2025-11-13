#!/usr/bin/env node

/**
 * Unit Test Runner
 * 
 * This script runs unit tests for the Terminail extension.
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

async function runUnitTests() {
    console.log('=== Terminail Extension Unit Tests ===\n');
    
    try {
        // Run unit tests using npm
        console.log('Running unit tests...');
        await runCommand('npm run test:unit');
        console.log('✅ Unit tests completed successfully!\n');
        
        console.log('🎉 All unit tests passed!');
        console.log('\nSummary of what was tested:');
        console.log('- TerminailManager basic functionality');
        console.log('- ConfigurationManager basic functionality');
        console.log('- PodmanManager basic functionality');
        console.log('- Core component instantiation and method existence');
        
    } catch (error) {
        console.error('❌ Unit tests failed:', error.message);
        process.exit(1);
    }
}

// Run the unit tests
if (require.main === module) {
    runUnitTests();
}

module.exports = { runUnitTests };