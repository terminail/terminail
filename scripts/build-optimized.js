#!/usr/bin/env node

/**
 * Optimized Build Script for TerminAI Extension
 * 
 * This script automates the packaging process with size optimization:
 * 1. Compiles TypeScript code
 * 2. Removes unnecessary files
 * 3. Minifies JavaScript (if terser is available)
 * 4. Packages the extension
 * 5. Reports package size
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m'
};

function log(color, message) {
    console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, options = {}) {
    try {
        log(colors.blue, `Running: ${command}`);
        const result = execSync(command, {
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit',
            ...options
        });
        return result;
    } catch (error) {
        log(colors.red, `Error running command: ${command}`);
        throw error;
    }
}

function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return (stats.size / (1024 * 1024)).toFixed(2); // Size in MB
    } catch (error) {
        return null;
    }
}

async function main() {
    try {
        log(colors.green, '=== TerminAI Extension Optimized Build ===\n');
        
        // 1. Clean previous build artifacts
        log(colors.yellow, '1. Cleaning previous build artifacts...');
        const outDir = path.join(__dirname, '..', 'out');
        if (fs.existsSync(outDir)) {
            fs.rmSync(outDir, { recursive: true, force: true });
            log(colors.green, '   Cleaned out/ directory');
        }
        
        // 2. Compile TypeScript with production settings
        log(colors.yellow, '2. Compiling TypeScript code with production settings...');
        try {
            // Check if production tsconfig exists
            const prodTsConfig = path.join(__dirname, '..', 'tsconfig.production.json');
            if (fs.existsSync(prodTsConfig)) {
                runCommand('tsc -p ./tsconfig.production.json');
                log(colors.green, '   TypeScript compilation completed with production settings');
            } else {
                runCommand('npm run compile');
                log(colors.green, '   TypeScript compilation completed with default settings');
            }
        } catch (error) {
            log(colors.yellow, '   Production tsconfig not found, using default compilation');
            runCommand('npm run compile');
        }
        
        // 3. Remove source maps (if they exist)
        log(colors.yellow, '3. Removing source maps...');
        const outDirFiles = fs.readdirSync(outDir, { recursive: true });
        let sourceMapCount = 0;
        
        for (const file of outDirFiles) {
            if (file.endsWith('.js.map')) {
                const filePath = path.join(outDir, file);
                fs.unlinkSync(filePath);
                sourceMapCount++;
            }
        }
        log(colors.green, `   Removed ${sourceMapCount} source map files`);
        
        // 4. Check if terser is available for minification
        log(colors.yellow, '4. Checking for terser (JavaScript minification)...');
        try {
            runCommand('npx terser --version', { stdio: 'ignore' });
            log(colors.green, '   Terser found, proceeding with minification');
            
            // Minify JavaScript files
            log(colors.yellow, '   Minifying JavaScript files...');
            let minifyCount = 0;
            
            for (const file of outDirFiles) {
                if (file.endsWith('.js')) {
                    const filePath = path.join(outDir, file);
                    runCommand(`npx terser "${filePath}" -o "${filePath}" -c -m`);
                    minifyCount++;
                }
            }
            log(colors.green, `   Minified ${minifyCount} JavaScript files`);
        } catch (error) {
            log(colors.yellow, '   Terser not found, skipping minification');
            log(colors.yellow, '   To enable minification, run: npm install terser -g');
        }
        
        // 5. Package the extension
        log(colors.yellow, '5. Packaging the extension...');
        runCommand('npx vsce package');
        
        // 6. Find the generated .vsix file
        const projectRoot = path.join(__dirname, '..');
        const files = fs.readdirSync(projectRoot);
        const vsixFile = files.find(file => file.endsWith('.vsix'));
        
        if (vsixFile) {
            const vsixPath = path.join(projectRoot, vsixFile);
            const size = getFileSize(vsixPath);
            
            log(colors.green, '\n=== Build Completed Successfully ===');
            log(colors.green, `Extension package: ${vsixFile}`);
            if (size) {
                log(colors.green, `Package size: ${size} MB`);
            }
            
            // Compare with previous build if it exists
            const prevVsixFiles = files.filter(file => 
                file.endsWith('.vsix') && file !== vsixFile
            );
            
            if (prevVsixFiles.length > 0) {
                const prevVsixPath = path.join(projectRoot, prevVsixFiles[0]);
                const prevSize = getFileSize(prevVsixPath);
                
                if (prevSize && size) {
                    const sizeDiff = (parseFloat(size) - parseFloat(prevSize)).toFixed(2);
                    if (sizeDiff < 0) {
                        log(colors.green, `Size improvement: ${Math.abs(sizeDiff)} MB smaller`);
                    } else if (sizeDiff > 0) {
                        log(colors.yellow, `Size increase: ${sizeDiff} MB larger`);
                    } else {
                        log(colors.blue, 'Package size unchanged');
                    }
                }
            }
        } else {
            log(colors.red, 'Error: Could not find generated .vsix file');
            process.exit(1);
        }
        
        log(colors.green, '\n🎉 Optimized build completed successfully!');
        log(colors.blue, 'Summary of optimizations applied:');
        log(colors.blue, '- Cleaned build artifacts');
        log(colors.blue, '- Compiled TypeScript to JavaScript');
        log(colors.blue, '- Removed source maps');
        log(colors.blue, '- Applied JavaScript minification (if terser available)');
        log(colors.blue, '- Packaged extension with .vscodeignore exclusions');
        
    } catch (error) {
        log(colors.red, `Build failed: ${error.message}`);
        process.exit(1);
    }
}

// Run the script if called directly
if (require.main === module) {
    main();
}

module.exports = { main };
