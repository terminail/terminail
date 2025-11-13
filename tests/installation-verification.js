#!/usr/bin/env node

/**
 * Terminail Extension Installation Verification Script
 * 
 * This script automates the process of packaging, installing, and verifying
 * the Terminail extension in a real VS Code environment as specified in the checklist.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// VS Code installation paths on Windows
const VSCODE_PATHS = [
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Microsoft VS Code', 'bin', 'code.cmd'),
    path.join(process.env.PROGRAMFILES || '', 'Microsoft VS Code', 'bin', 'code.cmd'),
    path.join(process.env['PROGRAMFILES(X86)'] || '', 'Microsoft VS Code', 'bin', 'code.cmd')
];

function findVSCode() {
    for (const vscodePath of VSCODE_PATHS) {
        if (fs.existsSync(vscodePath)) {
            return `"${vscodePath}"`; // Quote the path to handle spaces
        }
    }
    return 'code'; // fallback to PATH
}

async function runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
        console.log(`Running: ${command}`);
        
        const process = exec(command, {
            cwd: path.join(__dirname, '..'),
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

async function main() {
    console.log('=== Terminail Extension Installation Verification ===\n');
    console.log('This script verifies the extension packaging, installation, and functionality as per checklist requirements...\n');
    
    const vscodePath = findVSCode();
    const extensionId = 'terminail.terminail';
    const projectRoot = path.resolve(__dirname, '..');
    const vsixPath = path.join(projectRoot, 'terminail-0.1.0.vsix');
    
    try {
        // 1. Package the extension
        console.log('1. Packaging the extension using vsce...');
        await runCommand('npx vsce package');
        console.log('✅ Extension packaged successfully!\n');

        // 2. Install the extension using VS Code CLI
        console.log('2. Installing the extension using VS Code CLI...');
        await runCommand(`${vscodePath} --install-extension "${vsixPath}"`);
        console.log('✅ Extension installed successfully!\n');

        // 3. Verify installation
        console.log('3. Verifying installation by checking extension list...');
        const { stdout } = await runCommand(`${vscodePath} --list-extensions`, { silent: true });
        if (stdout.includes(extensionId)) {
            console.log('✅ Extension found in the list of installed extensions!\n');
        } else {
            throw new Error('Extension not found in the list of installed extensions');
        }

        // 4. Verify extension functionality in VS Code
        console.log('4. Verifying extension functionality by checking commands...');
        console.log('   Note: Manual verification required for UI elements in VS Code.');
        console.log('   Please manually verify the following:');
        console.log('   - Terminail terminal view appears in the activity bar');
        console.log('   - Extension commands (terminail.openTerminal) are available');
        console.log('   - Webview terminal interface loads correctly');
        console.log('   - cd, ls, qi, status, help commands work properly\n');

        // 5. Uninstall extension using VS Code CLI
        console.log('5. Uninstalling the extension using VS Code CLI...');
        await runCommand(`${vscodePath} --uninstall-extension ${extensionId}`);
        console.log('✅ Extension uninstalled successfully!\n');

        // 6. Verify uninstallation
        console.log('6. Verifying uninstallation...');
        const { stdout: uninstallStdout } = await runCommand(`${vscodePath} --list-extensions`, { silent: true });
        if (!uninstallStdout.includes(extensionId)) {
            console.log('✅ Extension successfully removed from the list of installed extensions!\n');
        } else {
            throw new Error('Extension still found in the list of installed extensions after uninstallation');
        }

        console.log('🎉 All installation verification steps completed successfully!');
        console.log('');
        console.log('Summary of verified functionality:');
        console.log('- Extension packages correctly using vsce');
        console.log('- Extension installs via VS Code CLI');
        console.log('- Extension appears in VS Code extension list');
        console.log('- Extension can be uninstalled via VS Code CLI');
        console.log('- Extension completely removed after uninstallation');
        console.log('');
        console.log('Note: UI functionality verification requires manual testing in VS Code.');

    } catch (error) {
        console.error('❌ Installation verification failed:', error.message);
        console.log('');
        console.log('Please check:');
        console.log('- VS Code is installed and accessible via the "code" command');
        console.log('- The extension packages correctly');
        console.log('- VS Code has the necessary permissions to install extensions');
        console.log('- You have properly set up your extension publisher name');
        process.exit(1);
    }
}

// Run the installation verification
if (require.main === module) {
    main().catch(error => {
        console.error('Error during installation verification:', error);
        process.exit(1);
    });
}

module.exports = { main };