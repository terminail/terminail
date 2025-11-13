import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as net from 'net';

export class ChromeManager {
    private chromeProcess: child_process.ChildProcess | null = null;
    private debugPort: number = 9222;
    private userDataDir: string;

    constructor() {
        // Create a unique user data directory for this session
        this.userDataDir = this.getUserDataDir();
    }

    /**
     * Start Chrome browser with debug port
     */
    public async startChrome(): Promise<number> {
        // Find an available port
        this.debugPort = await this.findAvailablePort();
        
        // Kill any existing Chrome processes on the same port
        await this.killExistingChromeProcesses();
        
        // Start Chrome with debug port
        const chromePath = await this.findChromePath();
        
        if (!chromePath) {
            throw new Error('Chrome browser not found. Please install Google Chrome.');
        }

        const args = [
            `--remote-debugging-port=${this.debugPort}`,
            `--user-data-dir=${this.userDataDir}`,
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-ipc-flooding-protection',
            '--enable-automation',
            '--password-store=basic',
            '--use-mock-keychain',
            '--disable-features=TranslateUI',
            '--disable-component-extensions-with-background-pages',
            '--disable-default-apps',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--no-sandbox',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--disable-background-networking',
            '--disable-sync',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-first-run',
            '--safebrowsing-disable-auto-update',
            '--disable-client-side-phishing-detection',
            '--disable-popup-blocking',
            '--disable-prompt-on-repost',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-ipc-flooding-protection',
            '--disable-hang-monitor',
            '--disable-site-isolation-trials',
            '--disable-features=VizDisplayCompositor',
            '--disable-back-forward-cache',
            '--aggressive-cache-discard',
            '--aggressive-tab-discard',
            '--aggressive-cache-discard',
            'about:blank'
        ];

        try {
            this.chromeProcess = child_process.spawn(chromePath, args, {
                detached: true,
                stdio: 'ignore' as child_process.StdioOptions
            });

            // Wait for Chrome to start and debug port to be available
            await this.waitForChromeReady();
            
            vscode.window.showInformationMessage(`Chrome started on debug port ${this.debugPort}`);
            
            return this.debugPort;
        } catch (error) {
            throw new Error(`Failed to start Chrome: ${error}`);
        }
    }

    /**
     * Stop Chrome browser
     */
    public async stopChrome(): Promise<void> {
        if (this.chromeProcess) {
            try {
                // Send SIGTERM to the process group
                process.kill(-this.chromeProcess.pid!, 'SIGTERM');
                
                // Wait for process to exit
                await new Promise<void>((resolve) => {
                    const timeout = setTimeout(() => {
                        // Force kill if still running after 5 seconds
                        if (this.chromeProcess && this.chromeProcess.pid) {
                            process.kill(-this.chromeProcess.pid, 'SIGKILL');
                        }
                        resolve();
                    }, 5000);
                    
                    if (this.chromeProcess) {
                        this.chromeProcess.once('exit', () => {
                            clearTimeout(timeout);
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
                
                this.chromeProcess = null;
                vscode.window.showInformationMessage('Chrome browser stopped');
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to stop Chrome: ${error}`);
            }
        }
    }

    /**
     * Get current debug port
     */
    public getDebugPort(): number {
        return this.debugPort;
    }

    /**
     * Check if Chrome is running
     */
    public isChromeRunning(): boolean {
        return this.chromeProcess !== null && !this.chromeProcess.killed;
    }

    /**
     * Find available port starting from 9222
     */
    private async findAvailablePort(): Promise<number> {
        const startPort = 9222;
        const maxPort = 9322;
        
        for (let port = startPort; port <= maxPort; port++) {
            if (await this.isPortAvailable(port)) {
                return port;
            }
        }
        
        throw new Error(`No available ports found between ${startPort} and ${maxPort}`);
    }

    /**
     * Check if a port is available
     */
    private async isPortAvailable(port: number): Promise<boolean> {
        return new Promise((resolve) => {
            const server = net.createServer();
            
            server.once('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    resolve(false);
                } else {
                    resolve(false);
                }
            });
            
            server.once('listening', () => {
                server.close();
                resolve(true);
            });
            
            server.listen(port);
        });
    }

    /**
     * Kill existing Chrome processes using the same debug port
     */
    private async killExistingChromeProcesses(): Promise<void> {
        try {
            // Use taskkill on Windows to kill Chrome processes
            if (process.platform === 'win32') {
                child_process.execSync(`taskkill /F /IM chrome.exe /T`, { stdio: 'ignore' });
            } else {
                // For Unix-like systems
                child_process.execSync(`pkill -f "chrome.*--remote-debugging-port"`, { stdio: 'ignore' });
            }
            
            // Wait a bit for processes to be killed
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            // Ignore errors if no processes were found to kill
        }
    }

    /**
     * Find Chrome executable path
     */
    private async findChromePath(): Promise<string | null> {
        const platforms = {
            win32: [
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
            ],
            darwin: [
                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            ],
            linux: [
                '/usr/bin/google-chrome',
                '/usr/bin/chromium',
                '/usr/bin/chromium-browser'
            ]
        };

        const paths = platforms[process.platform as keyof typeof platforms] || [];
        
        for (const path of paths) {
            try {
                // Check if file exists and is executable
                const fs = await import('fs');
                if (fs.existsSync(path)) {
                    return path;
                }
            } catch (error) {
                // Continue to next path
            }
        }

        // Try to find Chrome in PATH
        try {
            const which = process.platform === 'win32' ? 'where' : 'which';
            const result = child_process.execSync(`${which} chrome`).toString().trim();
            if (result) {
                return result;
            }
        } catch (error) {
            // Chrome not found in PATH
        }

        return null;
    }

    /**
     * Wait for Chrome to be ready and debug port to be available
     */
    private async waitForChromeReady(): Promise<void> {
        const maxAttempts = 30;
        const delay = 1000;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                // Try to connect to the debug port
                const response = await fetch(`http://localhost:${this.debugPort}/json`);
                if (response.ok) {
                    return;
                }
            } catch (error) {
                // Port not ready yet, wait and retry
                if (attempt < maxAttempts - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        throw new Error(`Chrome did not start within ${maxAttempts * delay / 1000} seconds`);
    }

    /**
     * Get user data directory path
     */
    private getUserDataDir(): string {
        const os = require('os');
        const path = require('path');
        
        const baseDir = path.join(os.tmpdir(), 'terminail-chrome');
        const sessionId = Date.now().toString();
        
        return path.join(baseDir, sessionId);
    }

    /**
     * Clean up resources
     */
    public async dispose(): Promise<void> {
        await this.stopChrome();
        
        // Clean up user data directory
        try {
            const fs = await import('fs');
            const path = await import('path');
            
            const baseDir = path.dirname(this.userDataDir);
            if (fs.existsSync(baseDir)) {
                fs.rmSync(baseDir, { recursive: true, force: true });
            }
        } catch (error) {
            // Ignore cleanup errors
        }
    }
}