import * as vscode from 'vscode';
import { PodmanManager } from './podmanManager';
import { ChromeManager } from './chromeManager';

export class TerminailWebviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'terminail.terminalView';
    private webviewView?: vscode.WebviewView;
    private podmanManager: PodmanManager;
    private chromeManager: ChromeManager;
    private currentAI: string = 'deepseek'; // Default AI service
    private commandHistory: string[] = [];
    private historyIndex: number = -1;
    private waitingForChromeConfirmation: boolean = false;
    private pendingAIChange: string | null = null;

    constructor(private extensionUri: vscode.Uri) {
        this.podmanManager = new PodmanManager();
        this.chromeManager = new ChromeManager();
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this.webviewView = webviewView;

        webviewView.webview.options = {

            enableScripts: true

        };

        webviewView.webview.html = this.getWebviewContent();

        webviewView.webview.onDidReceiveMessage((data) => {
            this.handleMessage(data);
        });

        // Initialize Podman and browser on startup
        this.initializeServices();
    }

    private async initializeServices() {
        if (this.webviewView) {
            this.postMessage({ type: 'output', content: '🚀 Terminail starting up...\n' });
            
            try {
                // Check if MCP server is already running locally
                this.postMessage({ type: 'output', content: '🔍 Checking for local MCP server...\n' });
                
                // Test connection to local MCP server
                const isServerRunning = await this.testMCPConnection();
                
                if (isServerRunning) {
                    this.postMessage({ type: 'output', content: '✅ Connected to local MCP server\n' });
                    
                    // Get default AI from MCP server
                    const defaultAI = await this.getDefaultAIFromMCP();
                    if (defaultAI) {
                        this.currentAI = defaultAI;
                        this.postMessage({ type: 'output', content: `✅ Default AI service: ${this.currentAI}\n` });
                        // Update prompt with the correct AI service
                        this.postMessage({ type: 'updatePrompt', ai: this.currentAI });
                    } else {
                        this.currentAI = 'unknown';
                        this.postMessage({ type: 'output', content: '⚠️ Could not determine default AI service\n' });
                        // Update prompt to unknown
                        this.postMessage({ type: 'updatePrompt', ai: this.currentAI });
                    }
                    
                    // Initialize browser connection with MCP server
                    this.postMessage({ type: 'output', content: '🌐 Initializing browser connection...\n' });
                    await this.initializeBrowserWithMCP();
                    this.postMessage({ type: 'output', content: '✅ Browser connection initialized\n' });
                } else {
                    // Fallback to starting Chrome and Podman if local server not available
                    this.postMessage({ type: 'output', content: '🌐 Starting Chrome browser...\n' });
                    const debugPort = await this.chromeManager.startChrome();
                    this.postMessage({ type: 'output', content: `✅ Chrome started on debug port ${debugPort}\n` });
                    
                    this.postMessage({ type: 'output', content: '🐳 Starting Podman container...\n' });
                    await this.podmanManager.startContainer(debugPort);
                    this.postMessage({ type: 'output', content: '✅ Podman container started\n' });
                    
                    // Try to get default AI from MCP server after container starts
                    const defaultAI = await this.getDefaultAIFromMCP();
                    if (defaultAI) {
                        this.currentAI = defaultAI;
                        this.postMessage({ type: 'output', content: `✅ Default AI service: ${this.currentAI}\n` });
                        // Update prompt with the correct AI service
                        this.postMessage({ type: 'updatePrompt', ai: this.currentAI });
                    } else {
                        this.currentAI = 'unknown';
                        this.postMessage({ type: 'output', content: '⚠️ Could not determine default AI service\n' });
                        // Update prompt to unknown
                        this.postMessage({ type: 'updatePrompt', ai: this.currentAI });
                    }
                }
                
                this.postMessage({ 
                    type: 'output', 
                    content: `🤖 Terminail ready! Current AI: ${this.currentAI}\nType 'help' to see available commands\n\n${this.currentAI}$ ` 
                });
            } catch (error) {
                this.postMessage({ 
                    type: 'output', 
                    content: `❌ Initialization failed: ${error}\n` 
                });
                
                // Clean up resources on failure
                await this.cleanupResources();
            }
        }
    }

    private async testMCPConnection(): Promise<boolean> {
        try {
            const http = await import('http');
            const url = await import('url');
            
            const requestUrl = url.parse('http://localhost:3000/health');
            
            const responsePromise = new Promise<boolean>((resolve, reject) => {
                const req = http.request({
                    hostname: requestUrl.hostname,
                    port: requestUrl.port ? parseInt(requestUrl.port) : 3000,
                    path: requestUrl.path,
                    method: 'GET',
                    timeout: 3000 // 3 second timeout
                }, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            resolve(res.statusCode === 200 && response.status === 'healthy');
                        } catch (error) {
                            resolve(false);
                        }
                    });
                });
                
                req.on('error', () => {
                    resolve(false);
                });
                
                req.on('timeout', () => {
                    req.destroy();
                    resolve(false);
                });
                
                req.end();
            });
            
            return await responsePromise;
        } catch (error) {
            return false;
        }
    }

    private async initializeBrowserWithMCP(): Promise<boolean> {
        try {
            const http = await import('http');
            const url = await import('url');
            
            const requestUrl = url.parse('http://localhost:3000/init');
            const postData = JSON.stringify({
                debug_port: 9222,
                auto_start: true
            });
            
            const options = {
                hostname: requestUrl.hostname,
                port: requestUrl.port ? parseInt(requestUrl.port) : 3000,
                path: requestUrl.path,
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'content-length': Buffer.byteLength(postData)
                }
            };
            
            const responsePromise = new Promise<boolean>((resolve, reject) => {
                const req = http.request(options, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            resolve(res.statusCode === 200 && response.success === true);
                        } catch (error) {
                            resolve(false);
                        }
                    });
                });
                
                req.on('error', (error) => {
                    reject(error);
                });
                
                req.write(postData);
                req.end();
            });
            
            return await responsePromise;
        } catch (error) {
            console.error('Failed to initialize browser with MCP:', error);
            return false;
        }
    }

    private async getDefaultAIFromMCP(): Promise<string | null> {
        try {
            const http = await import('http');
            const url = await import('url');
            
            const requestUrl = url.parse('http://localhost:3000/ais');
            
            const responsePromise = new Promise<string | null>((resolve, reject) => {
                const req = http.request({
                    hostname: requestUrl.hostname,
                    port: requestUrl.port ? parseInt(requestUrl.port) : 3000,
                    path: requestUrl.path,
                    method: 'GET',
                    timeout: 5000 // 5 second timeout
                }, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            if (res.statusCode === 200 && response.default) {
                                resolve(response.default);
                            } else {
                                resolve(null);
                            }
                        } catch (error) {
                            resolve(null);
                        }
                    });
                });
                
                req.on('error', () => {
                    resolve(null);
                });
                
                req.on('timeout', () => {
                    req.destroy();
                    resolve(null);
                });
                
                req.end();
            });
            
            return await responsePromise;
        } catch (error) {
            return null;
        }
    }

    private async cleanupResources() {
        try {
            await this.podmanManager.dispose();
            await this.chromeManager.stopChrome();
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }



    private async handleMessage(data: any) {
        switch (data.type) {
            case 'command':
                await this.handleCommand(data.command);
                break;
            case 'keydown':
                if (data.key === 'ArrowUp') {
                    this.handleHistoryNavigation('up');
                } else if (data.key === 'ArrowDown') {
                    this.handleHistoryNavigation('down');
                }
                break;
        }
    }

    private async handleCommand(command: string) {
        if (!command.trim()) {
            this.addPrompt();
            return;
        }

        // Check if we're waiting for Chrome confirmation
        if (this.waitingForChromeConfirmation) {
            const userInput = command.trim().toLowerCase();
            if (userInput === 'y' || userInput === 'yes' || userInput === '是') {
                this.waitingForChromeConfirmation = false;
                
                // Auto-start Chrome
                const success = await this.startChromeAutomatically();
                
                if (success) {
                    // Wait a bit for Chrome to fully start
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    
                    // Retry the AI change
                    if (this.pendingAIChange) {
                        this.postMessage({ 
                            type: 'output', 
                            content: `🔄 重新尝试切换到 ${this.pendingAIChange}...\n` 
                        });
                        await this.changeAI(this.pendingAIChange);
                    }
                } else {
                    this.postMessage({ 
                        type: 'output', 
                        content: `❌ 自动启动Chrome失败，请手动启动Chrome后重试\n` 
                    });
                    this.addPrompt();
                }
                
                this.pendingAIChange = null;
                return;
            } else {
                // User declined or entered something else
                this.waitingForChromeConfirmation = false;
                this.pendingAIChange = null;
                this.postMessage({ 
                    type: 'output', 
                    content: `❌ Chrome启动已取消，请手动启动Chrome后重试\n` 
                });
                this.addPrompt();
                return;
            }
        }

        // Add to command history
        this.commandHistory.push(command);
        if (this.commandHistory.length > 100) { // Limit history record count
            this.commandHistory.shift();
        }
        this.historyIndex = this.commandHistory.length; // Reset history index

        // Display user input command
        this.postMessage({ type: 'command', content: command });

        const args = command.trim().split(/\s+/);
        const cmd = args[0].toLowerCase();

        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'ls':
                await this.listAIs(args.slice(1));
                break;
            case 'cd':
                await this.changeAI(args[1]);
                break;
            case 'qi':
                await this.askQuestion(args.slice(1).join(' '));
                break;
            case 'status':
                await this.showStatus();
                break;
            case 'clear':
                this.clearTerminal();
                break;
            case 'chrome':
                await this.handleChromeCommand(args.slice(1));
                break;
            default:
                // Treat unknown commands as questions and forward to qi command
                const question = command.trim();
                await this.askQuestion(question);
        }

        this.addPrompt();
    }

    private handleHistoryNavigation(direction: 'up' | 'down') {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.postMessage({ 
                type: 'setInput', 
                command: this.commandHistory[this.historyIndex] 
            });
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.postMessage({ 
                type: 'setInput', 
                command: this.commandHistory[this.historyIndex] 
            });
        } else if (direction === 'down' && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex = this.commandHistory.length;
            this.postMessage({ 
                type: 'setInput', 
                command: '' 
            });
        }
    }

    private showHelp() {
        const helpText = `
📖 Terminail Command Help:

Basic Commands:
  cd <ai>       Switch current AI (deepseek, qwen, doubao)
  ls [-l]       List all supported AIs (use -l for detailed view)
  qi <question> Ask current AI a question
  status        Check system status
  clear         Clear terminal

System Commands:
  chrome        Manage Chrome browser (start, status, help)
  help          Display this help

Tips:
• After switching AI, the system will automatically navigate to the corresponding chat page
• Please wait patiently for AI to generate answers when asking questions
• Ensure the browser remains open
        `;
        this.postMessage({ type: 'output', content: helpText });
    }

    private async listAIs(args: string[] = []) {
        const detailed = args.includes('-l') || args.includes('--long');
        
        try {
            // Call MCP server API to get supported AI services
            const http = await import('http');
            const url = await import('url');
            
            const requestUrl = url.parse('http://localhost:3000/ais');
            
            const responsePromise = new Promise((resolve, reject) => {
                const req = http.request({
                    hostname: requestUrl.hostname,
                    port: requestUrl.port ? parseInt(requestUrl.port) : 3000,
                    path: requestUrl.path,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    }
                }, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            resolve({ ok: res.statusCode === 200, status: res.statusCode, data: response });
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                
                req.on('error', (error) => {
                    reject(error);
                });
                
                req.end();
            });
            
            const response = await responsePromise;
            
            if (!(response as any).ok) {
                throw new Error(`HTTP error! status: ${(response as any).status}`);
            }
            
            const responseData = (response as any).data;
            const aiServices = responseData.ais || [];
            
            if (detailed) {
                // Create detailed listing for AIService objects
                let output = 'Detailed AI Services List:\n';
                output += '==========================\n';
                output += 'ID              Name                 Category      URL\n';
                output += '--------------- -------------------- ------------- ------------------------------------------\n';
                
                aiServices.forEach((service: any) => {
                    const serviceId = service.id || 'unknown';
                    const serviceName = service.name || serviceId;
                    const category = service.category || 'Unknown';
                    const url = service.url || 'N/A';
                    output += `${serviceId.padEnd(15)} ${serviceName.padEnd(20)} ${category.padEnd(13)} ${url}\n`;
                });
                
                this.postMessage({ 
                    type: 'output', 
                    content: output 
                });
            } else {
                // Simple listing
                const serviceNames = aiServices.map((service: any) => service.name || service.id);
                const aiList = serviceNames.join(', ');
                this.postMessage({ 
                    type: 'output', 
                    content: `Supported AI services: ${aiList}\n` 
                });
            }
            
        } catch (error) {
            this.postMessage({ 
                type: 'output', 
                content: `❌ Failed to get AI services list: ${error}\n` 
            });
        }
    }

    private async getSupportedAIs(): Promise<string[]> {
        try {
            const http = await import('http');
            const url = await import('url');
            
            const requestUrl = url.parse('http://localhost:3000/ais');
            
            const responsePromise = new Promise((resolve, reject) => {
                const req = http.request({
                    hostname: requestUrl.hostname,
                    port: requestUrl.port ? parseInt(requestUrl.port) : 3000,
                    path: requestUrl.path,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    }
                }, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            resolve({ ok: res.statusCode === 200, status: res.statusCode, data: response });
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                
                req.on('error', (error) => {
                    reject(error);
                });
                
                req.end();
            });
            
            const response = await responsePromise;
            
            if (!(response as any).ok) {
                throw new Error(`HTTP error! status: ${(response as any).status}`);
            }
            
            const responseData = (response as any).data;
            const aiServices = responseData.ais || [];
            
            return aiServices.map((service: any) => (service.id || '').toLowerCase());
        } catch (error) {
            console.error('Failed to get supported AIs:', error);
            return ['deepseek', 'qwen', 'doubao', 'chatgpt']; // Fallback to default list
        }
    }

    private async changeAI(aiName?: string) {
        if (!aiName) {
            this.postMessage({ 
                type: 'output', 
                content: '❌ Please specify the AI service to switch to\n' 
            });
            return;
        }

        // Get supported AIs from container API
        const supportedAIs = await this.getSupportedAIs();
        if (!supportedAIs.includes(aiName.toLowerCase())) {
            this.postMessage({ 
                type: 'output', 
                content: `❌ Unsupported AI service: ${aiName}\n` 
            });
            return;
        }

        this.currentAI = aiName.toLowerCase();
        
        // Notify MCP server to switch websites
        try {
            // Use node's http module instead of fetch
            const http = await import('http');
            const url = await import('url');
            
            const requestUrl = url.parse(`http://localhost:3000/switch`);
            const postData = JSON.stringify({
                ai: this.currentAI
            });
            
            const options = {
                    hostname: requestUrl.hostname,
                    port: requestUrl.port ? parseInt(requestUrl.port) : 3000,
                    path: requestUrl.path,
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'content-length': Buffer.byteLength(postData)
                    }
                };
            
            const responsePromise = new Promise((resolve, reject) => {
                const req = http.request(options, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            resolve({ ok: res.statusCode === 200, status: res.statusCode, data: response });
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                
                req.on('error', (error) => {
                    reject(error);
                });
                
                req.write(postData);
                req.end();
            });
            
            const response = await responsePromise;
            
            if ((response as any).ok) {
                const data = (response as any).data;
                
                if (data.success) {
                    this.postMessage({ 
                            type: 'output', 
                            content: `✅ Switched to ${this.currentAI}\n` 
                        });
                    // Update prompt after successful AI switch
                    this.postMessage({
                        type: 'updatePrompt',
                        ai: this.currentAI
                    });
                } else {
                    this.postMessage({ 
                            type: 'output', 
                            content: `❌ Failed to switch AI: ${data.error}\n` 
                        });
                }
            } else {
                // Handle browser not connected error (400 status)
                if ((response as any).status === 400) {
                    const errorMessage = (response as any).data?.detail || 'Browser not connected';
                    
                    if (errorMessage.includes('Browser not connected')) {
                        // Show Chrome startup command and ask for confirmation
                        await this.handleChromeNotStarted(aiName);
                        return;
                    }
                }
                throw new Error(`HTTP error! status: ${(response as any).status}`);
            }
        } catch (error) {
            this.postMessage({ 
                    type: 'output', 
                    content: `❌ Failed to switch AI: ${error}\n` 
                });
        }
    }

    private async handleChromeNotStarted(aiName: string) {
        // Show Chrome startup command
        const chromeCommand = this.getChromeStartupCommand();
        
        this.postMessage({ 
            type: 'output', 
            content: `🔧 Chrome浏览器未启动，无法切换到 ${aiName}\n` 
        });
        
        this.postMessage({ 
            type: 'output', 
            content: `📋 请手动启动Chrome浏览器，使用以下命令：\n${chromeCommand}\n` 
        });
        
        this.postMessage({ 
            type: 'output', 
            content: `💡 或者，输入 'y' 让Terminail自动启动Chrome：` 
        });
        
        // Wait for user confirmation
        this.waitingForChromeConfirmation = true;
        this.pendingAIChange = aiName;
    }

    private getChromeStartupCommand(debugPort: number = 9222, additionalArgs: string[] = []): string {
        const os = require('os');
        const platform = os.platform();
        
        // Base arguments
        const baseArgs = [
            `--remote-debugging-port=${debugPort}`,
            `--user-data-dir=\"${platform === 'win32' ? '%USERPROFILE%\\.terminail\\chrome_data' : '~/.terminail/chrome_data'}\"`,
            '--no-first-run',
            '--no-default-browser-check'
        ];
        
        // Combine all arguments
        const allArgs = [...baseArgs, ...additionalArgs];
        
        if (platform === 'win32') {
            return `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" ${allArgs.join(' ')}`;
        } else if (platform === 'darwin') {
            return `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ${allArgs.join(' ')}`;
        } else {
            return `google-chrome ${allArgs.join(' ')}`;
        }
    }

    private async startChromeAutomatically(debugPort: number = 9222, additionalArgs: string[] = []): Promise<boolean> {
        try {
            const { exec } = require('child_process');
            const util = require('util');
            const execAsync = util.promisify(exec);
            
            const command = this.getChromeStartupCommand(debugPort, additionalArgs);
            
            this.postMessage({ 
                type: 'output', 
                content: `🚀 Starting Chrome browser with debug port ${debugPort}...\n` 
            });
            
            // Start Chrome in background
            const { stdout, stderr } = await execAsync(command, { windowsHide: true });
            
            // Wait for Chrome to start
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            this.postMessage({ 
                type: 'output', 
                content: `✅ Chrome browser started successfully\n` 
            });
            
            return true;
        } catch (error) {
            this.postMessage({ 
                type: 'output', 
                content: `❌ Failed to start Chrome automatically: ${error}\n` 
            });
            return false;
        }
    }

    private async askQuestion(question: string) {
        if (!question) {
            this.postMessage({ 
                type: 'output', 
                content: '❌ Please enter a question to ask\n' 
            });
            return;
        }

        this.postMessage({ 
            type: 'output', 
            content: `[${this.currentAI}] Asking: ${question}\n` 
        });

        try {
            // Use node's http module instead of fetch
            const http = await import('http');
            const url = await import('url');
            
            const requestUrl = url.parse(`http://localhost:3000/ask`);
            const postData = JSON.stringify({
                question: question,
                aiName: this.currentAI
            });
            
            const options = {
                    hostname: requestUrl.hostname,
                    port: requestUrl.port ? parseInt(requestUrl.port) : 3000,
                    path: requestUrl.path,
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'content-length': Buffer.byteLength(postData)
                    }
                };
            
            const responsePromise = new Promise((resolve, reject) => {
                const req = http.request(options, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            resolve({ ok: res.statusCode === 200, status: res.statusCode, data: response });
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                
                req.on('error', (error) => {
                    reject(error);
                });
                
                req.write(postData);
                req.end();
            });
            
            const response = await responsePromise;
            
            if ((response as any).ok) {
                const data = (response as any).data;
                
                if (data.success) {
                    this.postMessage({ 
                            type: 'output', 
                            content: `[${this.currentAI}] Answer: ${data.answer}\n` 
                        });
                } else {
                    this.postMessage({ 
                            type: 'output', 
                            content: `❌ Failed to get answer: ${data.error}\n` 
                        });
                }
            } else {
                throw new Error(`HTTP error! status: ${(response as any).status}`);
            }
        } catch (error) {
            this.postMessage({ 
                    type: 'output', 
                    content: `❌ Failed to get answer: ${error}\n` 
                });
        }
    }

    private async showStatus() {
        const status = `
📊 System Status:
• Current AI: ${this.currentAI}
    • Podman: ${await this.podmanManager.isContainerRunning() ? 'Running' : 'Stopped'}
        `;
        this.postMessage({ type: 'output', content: status });
    }

    private clearTerminal() {
        this.postMessage({ type: 'clear' });
    }

    private addPrompt() {
        this.postMessage({ 
            type: 'output', 
            content: `${this.currentAI}$ ` 
        });
    }

    private postMessage(message: any) {
        if (this.webviewView) {
            this.webviewView.webview.postMessage(message);
        }
    }

    private getWebviewContent(): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Terminail Terminal</title>
            <style>
                body {
                    margin: 0;
                    padding: 10px;
                    font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
                    background-color: #1e1e1e;
                    color: #d4d4d4;
                    height: 100vh;
                    overflow: hidden;
                }
                
                #terminal {
                    height: calc(100vh - 80px);
                    overflow-y: auto;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    line-height: 1.4;
                    padding: 5px;
                }
                
                .prompt {
                    color: #4ec9b0;
                }
                
                .command {
                    color: #dcdcaa;
                }
                
                .output {
                    color: #d4d4d4;
                }
                
                .input-line {
                    display: flex;
                    align-items: center;
                    margin-top: 5px;
                }
                
                #command-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #d4d4d4;
                    font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
                    font-size: 14px;
                    outline: none;
                    padding: 0 5px;
                    line-height: 1.4;
                }
                
                .response {
                    color: #ce9178;
                }
                
                .error {
                    color: #f48771;
                }
            </style>
        </head>
        <body>
            <div id="terminal"></div>
            <div class="input-line">
                <span id="prompt" class="prompt">loading$ </span>
                <input type="text" id="command-input" autocomplete="off" autofocus>
            </div>

            <script>
                // Global message listener registration to prevent duplicates
                if (!window.terminailMessageListenerRegistered) {
                    window.terminailMessageListenerRegistered = true;
                    
                    window.addEventListener('message', event => {
                        const message = event.data;
                        const terminal = document.getElementById('terminal');
                        const commandInput = document.getElementById('command-input');
                        const promptSpan = document.getElementById('prompt');
                        
                        if (!terminal || !commandInput || !promptSpan) return;
                        
                        let currentPrompt = promptSpan.textContent || 'loading$ ';
                        
                        // Scroll to bottom
                        function scrollToBottom() {
                            terminal.scrollTop = terminal.scrollHeight;
                        }
                        
                        // Output content to terminal
                        function outputToTerminal(content) {
                            if (typeof content === 'string') {
                                const outputElement = document.createElement('div');
                                outputElement.className = 'output';
                                outputElement.textContent = content;
                                terminal.appendChild(outputElement);
                            }
                            scrollToBottom();
                        }
                        
                        // Add command to terminal
                        function addCommandToTerminal(command) {
                            const commandElement = document.createElement('div');
                            commandElement.className = 'command';
                            commandElement.textContent = currentPrompt + command;
                            terminal.appendChild(commandElement);
                            scrollToBottom();
                        }
                        
                        // Update prompt
                        function updatePrompt(ai) {
                            currentPrompt = ai + '$ ';
                            promptSpan.textContent = currentPrompt;
                        }
                        
                        // Clear terminal
                        function clearTerminal() {
                            terminal.innerHTML = '';
                        }
                        
                        // Set input box content
                        function setInput(value) {
                            commandInput.value = value;
                            commandInput.focus();
                        }
                        
                        // Handle message types
                        switch (message.type) {
                            case 'output':
                                outputToTerminal(message.content);
                                break;
                            case 'command':
                                addCommandToTerminal(message.content);
                                break;
                            case 'clear':
                                clearTerminal();
                                break;
                            case 'setInput':
                                setInput(message.command);
                                break;
                            case 'updatePrompt':
                                updatePrompt(message.ai);
                                break;
                        }
                    });
                }
                
                // Initialize VS Code API and input handling for this instance
                const vscode = acquireVsCodeApi();
                const terminal = document.getElementById('terminal');
                const commandInput = document.getElementById('command-input');
                const promptSpan = document.getElementById('prompt');
                
                if (commandInput) {
                    // Command input handling - only register once
                    commandInput.addEventListener('keydown', event => {
                        // Send message to VS Code extension
                        vscode.postMessage({
                            type: 'keydown',
                            key: event.key,
                            input: commandInput.value
                        });
                        
                        if (event.key === 'Enter') {
                            // Send command to VS Code extension
                            vscode.postMessage({
                                type: 'command',
                                command: commandInput.value
                            });
                            
                            commandInput.value = '';
                            event.preventDefault();
                        }
                    });
                    
                    // Initial focus
                    commandInput.focus();
                }
            </script>

        </body>

        </html>`;

    }

    private async handleChromeCommand(args: string[]): Promise<void> {
        const subCommand = args.length > 0 ? args[0].toLowerCase() : 'status';
        
        switch (subCommand) {
            case 'start':
                await this.startChromeWithArgs(args.slice(1));
                break;
            case 'status':
                await this.checkChromeStatus();
                break;
            case 'help':
                this.showChromeHelp();
                break;
            default:
                this.postMessage({ 
                    type: 'output', 
                    content: `❌ Unknown chrome subcommand: ${subCommand}\nType 'chrome help' to see available subcommands\n` 
                });
        }
    }

    private async startChromeWithArgs(args: string[]): Promise<void> {
        let debugPort = 9222;
        let additionalArgs: string[] = [];
        
        // Parse arguments
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (arg === '--port' && i + 1 < args.length) {
                debugPort = parseInt(args[i + 1]);
                i++; // Skip next argument
            } else if (arg === '--headless') {
                additionalArgs.push('--headless');
            } else if (arg === '--no-sandbox') {
                additionalArgs.push('--no-sandbox');
            } else if (arg === '--disable-web-security') {
                additionalArgs.push('--disable-web-security');
            } else if (arg.startsWith('--')) {
                additionalArgs.push(arg);
            }
        }
        
        this.postMessage({ 
            type: 'output', 
            content: `🚀 Starting Chrome with debug port ${debugPort}...\n` 
        });
        
        try {
            const success = await this.startChromeAutomatically(debugPort, additionalArgs);
            if (success) {
                this.postMessage({ 
                    type: 'output', 
                    content: `✅ Chrome started successfully on port ${debugPort}\n` 
                });
                
                // Wait a bit for Chrome to fully start
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Try to connect to the browser
                await this.checkChromeStatus();
            } else {
                this.postMessage({ 
                    type: 'output', 
                    content: `❌ Failed to start Chrome\n` 
                });
            }
        } catch (error) {
            this.postMessage({ 
                type: 'output', 
                content: `❌ Error starting Chrome: ${error}\n` 
            });
        }
    }

    private async checkChromeStatus(): Promise<void> {
        try {
            // Check MCP server health endpoint
            const http = await import('http');
            const url = await import('url');
            
            const requestUrl = url.parse('http://localhost:3000/health');
            
            const responsePromise = new Promise<any>((resolve, reject) => {
                const req = http.request({
                    hostname: requestUrl.hostname,
                    port: requestUrl.port ? parseInt(requestUrl.port) : 3000,
                    path: requestUrl.path,
                    method: 'GET',
                    timeout: 5000
                }, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            resolve({ 
                                statusCode: res.statusCode, 
                                data: response 
                            });
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                
                req.on('error', (error) => {
                    reject(error);
                });
                
                req.on('timeout', () => {
                    req.destroy();
                    reject(new Error('Request timeout'));
                });
                
                req.end();
            });
            
            const response = await responsePromise;
            
            if (response.statusCode === 200) {
                const browserStatus = response.data.browser || 'unknown';
                const debugPort = response.data.debug_port || 9222;
                const statusText = browserStatus === 'connected' ? '✅ Connected' : '❌ Disconnected';
                
                this.postMessage({ 
                    type: 'output', 
                    content: `📊 Chrome Status:\n` +
                            `  • MCP Server: ✅ Running\n` +
                            `  • Browser: ${statusText}\n` +
                            `  • Debug Port: ${debugPort}\n` +
                            `  • Timestamp: ${new Date().toLocaleString()}\n`
                });
                
                if (browserStatus === 'disconnected') {
                    this.postMessage({ 
                        type: 'output', 
                        content: `💡 Tip: Use 'chrome start' to launch Chrome browser\n` 
                    });
                }
            } else {
                this.postMessage({ 
                    type: 'output', 
                    content: `❌ MCP Server is not responding (status: ${response.statusCode})\n` 
                });
            }
        } catch (error) {
            this.postMessage({ 
                type: 'output', 
                content: `❌ Error checking Chrome status: ${error}\n` 
            });
        }
    }

    private showChromeHelp(): void {
        const helpText = `
📖 Chrome Command Help:

Usage:
  chrome [subcommand] [options]

Subcommands:
  start     Start Chrome browser with optional parameters
  status    Check Chrome browser status (default)
  help      Display this help

Start Options:
  --port <number>        Set debug port (default: 9222)
  --headless            Run Chrome in headless mode
  --no-sandbox          Disable sandbox (useful in containers)
  --disable-web-security Disable web security (for testing)

Examples:
  chrome                    # Check Chrome status
  chrome start              # Start Chrome on default port 9222
  chrome start --port 9333  # Start Chrome on port 9333
  chrome start --headless   # Start Chrome in headless mode
  chrome help               # Show this help

Note:
• Chrome must be running for AI commands to work
• Use 'chrome status' to verify browser connection
• The system will automatically try to connect to Chrome
        `;
        this.postMessage({ type: 'output', content: helpText });
    }



    /**

     * Dispose of the provider

     */

    public dispose(): void {

        // Clean up resources if needed

        if (this.podmanManager) {

            this.podmanManager.dispose();

        }

    }

}