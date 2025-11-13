# TerminAI Terminal UI - VS Code Integration Guide

You can completely create an interface that is almost identical to VS Code's built-in terminal! Here are the components and libraries you can utilize:

## 🎯 VS Code Official Components and API

### Solution 1. **Terminal API** (Directly use real terminal)

Use VS Code's Terminal API: directly create a terminal, then output content in the terminal. However, in this way, the terminal is a real shell environment, and we cannot completely control input and output.

```typescript
import * as vscode from 'vscode';

// Create real terminal instance
const terminal = vscode.window.createTerminal({
    name: 'TerminAI Terminal',
    shellPath: '/bin/bash', // or cmd.exe (Windows)
    shellArgs: ['--login']
});

// Send command to terminal
terminal.sendText('echo "Hello from TerminAI"');
terminal.show();
```

### Solution 2. **Webview API** (Custom terminal interface) [Selected]

Use Webview API: create a custom webview, then simulate a terminal interface in this webview. This way can completely control the interface and interaction.

```typescript
// Create fully custom terminal interface
const panel = vscode.window.createWebviewPanel(
    'terminaiTerminal',
    'TerminAI Terminal',
    vscode.ViewColumn.One,
    {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, 'media')
        ]
    }
);
```

### 3. **XTerm.js** (Library used by VS Code terminal)
VS Code terminal is based on **XTerm.js**, you can use it directly:

```typescript
// Add dependency in package.json
{
  "dependencies": {
    "xterm": "^5.3.0",
    "xterm-addon-fit": "^0.8.0",
    "xterm-addon-web-links": "^0.9.0",
    "xterm-addon-search": "^0.11.0"
  }
}
```

## 🛠️ Complete TerminAI Terminal Implementation

### 1. **Webview Terminal Implementation**

**`terminalView.ts`**:
```typescript
import * as vscode from 'vscode';
import * as path from 'path';

export class TerminAITerminalView {
    private _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    constructor(extensionUri: vscode.Uri) {
        this._panel = vscode.window.createWebviewPanel(
            'terminaiTerminal',
            'TerminAI Terminal',
            vscode.ViewColumn.One,
            this.getWebviewOptions(extensionUri)
        );

        this._setupWebview();
        this._setupMessageHandlers();
    }

    private getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
        return {
            enableScripts: true,
            enableForms: false,
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, 'media'),
                vscode.Uri.joinPath(extensionUri, 'node_modules')
            ]
        };
    }

    private _setupWebview(): void {
        this._panel.webview.html = this._getHtmlContent();
        
        // Apply VS Code theme
        this._updateTheme();
        vscode.window.onDidChangeActiveColorTheme(() => {
            this._updateTheme();
        });
    }

    private async _updateTheme(): Promise<void> {
        const theme = vscode.window.activeColorTheme;
        const isDark = theme.kind === vscode.ColorThemeKind.Dark;
        
        await this._panel.webview.postMessage({
            type: 'themeChange',
            theme: isDark ? 'dark' : 'light',
            colors: {
                background: this._getThemeColor('terminal.background'),
                foreground: this._getThemeColor('terminal.foreground'),
                cursor: this._getThemeColor('terminalCursor.foreground'),
                selection: this._getThemeColor('terminal.selectionBackground')
            }
        });
    }

    private _getThemeColor(colorId: string): string {
        const color = vscode.workspace.getConfiguration().get(colorId);
        return color?.toString() || '';
    }

    private _getHtmlContent(): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>TerminAI Terminal</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background: var(--vscode-terminal-background);
                        font-family: var(--vscode-editor-font-family);
                        font-size: var(--vscode-editor-font-size);
                        font-weight: var(--vscode-editor-font-weight);
                        height: 100vh;
                        overflow: hidden;
                    }
                    #terminal-container {
                        width: 100%;
                        height: 100%;
                        padding: 8px;
                        box-sizing: border-box;
                    }
                </style>
            </head>
            <body>
                <div id="terminal-container"></div>
                
                <script src="${this._getResourceUri('xterm.js')}"></script>
                <script src="${this._getResourceUri('xterm-addon-fit.js')}"></script>
                <script src="${this._getResourceUri('xterm-addon-web-links.js')}"></script>
                <script src="${this._getResourceUri('terminal.js')}"></script>
            </body>
            </html>
        `;
    }

    private _getResourceUri(fileName: string): string {
        const onDiskPath = vscode.Uri.joinPath(this._extensionUri, 'media', fileName);
        return this._panel.webview.asWebviewUri(onDiskPath).toString();
    }

    private _setupMessageHandlers(): void {
        this._panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.type) {
                    case 'executeCommand':
                        await this._handleCommand(message.command);
                        break;
                    case 'resize':
                        await this._handleResize(message.cols, message.rows);
                        break;
                    case 'ready':
                        this._sendWelcomeMessage();
                        break;
                }
            },
            null,
            this._disposables
        );
    }

    private async _handleCommand(command: string): Promise<void> {
        // Handle user input commands
        const [cmd, ...args] = command.trim().split(' ');
        
        switch (cmd) {
            case 'cd':
                await this._handleCdCommand(args[0]);
                break;
            case 'ls':
                await this._handleLsCommand();
                break;
            case 'qi':
                await this._handleQiCommand(args.join(' '));
                break;
            case 'help':
                await this._showHelp();
                break;
            default:
                await this._showError(`Unknown command: ${cmd}`);
        }
    }

    // ... Other command handling methods
}
```

### 2. **XTerm 终端前端**

**`media/terminal.js`**:
```javascript
class TerminAITerminal {
    constructor() {
        this.terminal = null;
        this.fitAddon = null;
        this.webLinksAddon = null;
        this.isReady = false;
        
        this.init();
    }

    async init() {
        // 初始化 XTerm.js
        this.terminal = new Terminal({
            theme: this.getTheme(),
            fontSize: 14,
            fontFamily: 'Consolas, "Courier New", monospace',
            cursorBlink: true,
            scrollback: 1000,
            convertEol: true
        });

        this.fitAddon = new FitAddon.FitAddon();
        this.webLinksAddon = new WebLinksAddon.WebLinksAddon();

        this.terminal.loadAddon(this.fitAddon);
        this.terminal.loadAddon(this.webLinksAddon);

        // 挂载到 DOM
        this.terminal.open(document.getElementById('terminal-container'));
        this.fitAddon.fit();

        // Set up event listeners
        this.setupEventListeners();
        
        // Notify backend that terminal is ready
        this.sendMessage({ type: 'ready' });
        this.isReady = true;

        this.showPrompt();
    }

    getTheme() {
        return {
            background: '#1e1e1e',
            foreground: '#cccccc',
            cursor: '#ffffff',
            cursorAccent: '#000000',
            selection: '#ffffff40',
            black: '#000000',
            red: '#cd3131',
            green: '#0dbc79',
            yellow: '#e5e510',
            blue: '#2472c8',
            magenta: '#bc3fbc',
            cyan: '#11a8cd',
            white: '#e5e5e5',
            brightBlack: '#666666',
            brightRed: '#f14c4c',
            brightGreen: '#23d18b',
            brightYellow: '#f5f543',
            brightBlue: '#3b8eea',
            brightMagenta: '#d670d6',
            brightCyan: '#29b8db',
            brightWhite: '#ffffff'
        };
    }

    setupEventListeners() {
        // Handle user input
        this.terminal.onData((data) => {
            this.handleUserInput(data);
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.fitAddon.fit();
        });

        // Handle messages from extension
        window.addEventListener('message', (event) => {
            this.handleExtensionMessage(event.data);
        });
    }

    handleUserInput(data) {
        switch (data) {
            case '\r': // Enter
                this.executeCommand();
                break;
            case '\u007f': // Backspace
                this.handleBackspace();
                break;
            case '\u0003': // Ctrl+C
                this.handleInterrupt();
                break;
            case '\u000c': // Ctrl+L
                this.clearTerminal();
                break;
            default:
                this.addToInputBuffer(data);
        }
    }

    executeCommand() {
        const command = this.inputBuffer.trim();
        this.terminal.write('\r\n');
        
        if (command) {
            this.sendMessage({
                type: 'executeCommand',
                command: command
            });
            
            // 添加到命令历史
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;
        }
        
        this.inputBuffer = '';
        this.showPrompt();
    }

    showPrompt() {
        this.terminal.write('terminai$ ');
    }

    writeOutput(text, isError = false) {
        const style = isError ? '\x1b[31m' : '\x1b[37m'; // Red error, white normal
        this.terminal.write(`\r\n${style}${text}\x1b[0m\r\n`);
        this.showPrompt();
    }

    clearTerminal() {
        this.terminal.clear();
        this.showPrompt();
    }

    sendMessage(message) {
        if (window.vscode && window.vscode.postMessage) {
            window.vscode.postMessage(message);
        }
    }

    handleExtensionMessage(message) {
        switch (message.type) {
            case 'commandOutput':
                this.writeOutput(message.output);
                break;
            case 'commandError':
                this.writeOutput(message.error, true);
                break;
            case 'themeChange':
                this.updateTheme(message);
                break;
            case 'aiResponse':
                this.showAIResponse(message);
                break;
        }
    }

    showAIResponse(message) {
        this.terminal.write('\r\n');
        this.terminal.write(`\x1b[36m[${message.ai}]\x1b[0m ${message.response}\r\n`);
        this.showPrompt();
    }
}

// Initialize terminal
const terminAITerminal = new TerminAITerminal();
```

### 3. **Package.json 配置**

```json
{
  "contributes": {
    "commands": [
      {
        "command": "terminai.openTerminal",
        "title": "Open TerminAI Terminal",
        "category": "TerminAI"
      }
    ],
    "views": {
      "explorer": [
        {
          "type": "webview",
          "id": "terminai.terminal",
          "name": "TerminAI Terminal"
        }
      ]
    },
    "configuration": {
      "title": "TerminAI Terminal",
      "properties": {
        "terminai.terminal.fontSize": {
          "type": "number",
          "default": 14,
          "description": "Terminal font size"
        },
        "terminai.terminal.fontFamily": {
          "type": "string",
          "default": "Consolas, 'Courier New', monospace",
          "description": "Terminal font family"
        },
        "terminai.terminal.cursorBlink": {
          "type": "boolean",
          "default": true,
          "description": "Enable cursor blinking"
        }
      }
    }
  },
  "dependencies": {
    "xterm": "^5.3.0",
    "xterm-addon-fit": "^0.8.0",
    "xterm-addon-web-links": "^0.9.0",
    "xterm-addon-search": "^0.11.0"
  }
}
```

### 4. **资源文件准备**

将以下文件复制到 `media/` 目录：

- `xterm.js` (从 node_modules/xterm/lib/xterm.js)
- `xterm-addon-fit.js` (从 node_modules/xterm-addon-fit/lib/xterm-addon-fit.js)
- `xterm-addon-web-links.js` (从 node_modules/xterm-addon-web-links/lib/xterm-addon-web-links.js)

### 5. **VS Code 主题集成**

```typescript
// 获取 VS Code 主题颜色
private getVSCodeTerminalTheme(): any {
    const config = vscode.workspace.getConfiguration();
    
    return {
        background: this.getColor(config.get('terminal.background')),
        foreground: this.getColor(config.get('terminal.foreground')),
        cursor: this.getColor(config.get('terminalCursor.foreground')),
        selection: this.getColor(config.get('terminal.selectionBackground')),
        // 更多颜色映射...
    };
}

private getColor(colorSetting: any): string {
    if (typeof colorSetting === 'string') {
        return colorSetting;
    }
    return colorSetting?.toString() || '';
}
```

## 🎨 高级特性

### 1. **终端标签页**
```typescript
// 创建多个终端实例
const terminals = new Map<string, vscode.WebviewPanel>();

function createTerminalSession(name: string): void {
    const terminal = vscode.window.createWebviewPanel(
        `terminai-${name}`,
        `TerminAI - ${name}`,
        vscode.ViewColumn.One,
        webviewOptions
    );
    terminals.set(name, terminal);
}
```

### 2. **命令自动补全**
```javascript
// 在 terminal.js 中添加
setupAutocomplete() {
    this.terminal.attachCustomKeyEventHandler((event) => {
        if (event.key === 'Tab' && !event.ctrlKey && !event.altKey) {
            this.handleTabCompletion();
            return false;
        }
        return true;
    });
}
```

### 3. **命令历史**
```javascript
class CommandHistory {
    constructor() {
        this.history = [];
        this.index = 0;
    }
    
    add(command) {
        if (command && command !== this.history[this.history.length - 1]) {
            this.history.push(command);
        }
        this.index = this.history.length;
    }
    
    getPrevious() {
        if (this.index > 0) {
            this.index--;
        }
        return this.history[this.index] || '';
    }
    
    getNext() {
        if (this.index < this.history.length - 1) {
            this.index++;
            return this.history[this.index];
        }
        this.index = this.history.length;
        return '';
    }
}
```

## 🚀 优势

1. **原生体验** - 使用与 VS Code 相同的 XTerm.js 库
2. **主题集成** - 自动适配 VS Code 颜色主题
3. **高性能** - 虚拟 DOM 和高效渲染
4. **可访问性** - 支持屏幕阅读器和键盘导航
5. **可扩展** - 易于添加新功能和命令

这样的实现会让您的 TerminAI 终端看起来和用起来都与 VS Code 内置终端几乎一模一样，同时保持完全的自定义控制！
