# Hybrid Html Template
Q: I found you embedded html directly in code, is there any template for vscode extension dev to seperate the code, data,template?

A: Excellent choice! A hybrid approach gives you the best of both worlds. Here's a clean, lightweight hybrid architecture that separates concerns while maintaining performance:

## Project Structure

```
learning-buddy/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── providers/
│   │   └── ChatViewProvider.ts
│   └── templates/           # Template modules
│       ├── index.ts         # Main template loader
│       ├── base.ts          # Base HTML structure
│       └── components.ts    # Reusable UI components
├── media/                   # Static assets
│   ├── chat-template.html   # Main HTML template
│   └── styles/
│       └── chat.css
└── package.json
```

## 1. Main Template Loader (`src/templates/index.ts`)

```typescript
import * as vscode from 'vscode';
import { baseTemplate } from './base';
import { contactList, messageBubble, inputArea } from './components';

export class TemplateEngine {
    private static _instance: TemplateEngine;
    
    public static getInstance(): TemplateEngine {
        if (!TemplateEngine._instance) {
            TemplateEngine._instance = new TemplateEngine();
        }
        return TemplateEngine._instance;
    }

    async renderMainTemplate(webview: vscode.Webview, extensionUri: vscode.Uri, data: any): Promise<string> {
        // Read external HTML template file
        const templatePath = vscode.Uri.joinPath(extensionUri, 'media', 'chat-template.html');
        const templateBytes = await vscode.workspace.fs.readFile(templatePath);
        let html = Buffer.from(templateBytes).toString('utf8');

        // Get resource URIs for webview
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'styles', 'chat.css'));
        
        // Replace placeholders with template snippets
        const templateData = {
            contacts: data.contacts || [],
            currentContact: data.currentContact || null,
            style_uri: styleUri.toString(),
            contact_list: this.renderContactList(data.contacts),
            chat_messages: this.renderChatMessages(data.currentContact?.messages || []),
            input_area: inputArea()
        };

        // Replace placeholders in the main template
        for (const [key, value] of Object.entries(templateData)) {
            const placeholder = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(placeholder, value);
        }

        return html;
    }

    private renderContactList(contacts: any[]): string {
        return contacts.map(contact => contactList(contact)).join('\n');
    }

    private renderChatMessages(messages: any[]): string {
        return messages.map(msg => messageBubble(msg)).join('\n');
    }
}
```

## 2. Base Template Structure (`src/templates/base.ts`)

```typescript
// Reusable base template snippets as template literals
export const baseTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learning Buddy</title>
    <link rel="stylesheet" href="{{style_uri}}">
</head>
<body>
    <div class="chat-container">
        <div class="contacts-panel" id="contacts-panel">
            <div class="contacts-header">
                <span>Contacts</span>
                <button class="add-contact-btn" onclick="addNewAI()">+</button>
            </div>
            <div class="contact-list">
                {{contact_list}}
            </div>
        </div>
        
        <div class="resizer" id="resizer"></div>
        
        <div class="chat-area">
            <div class="chat-header">
                <span id="current-contact-name">{{current_contact_name}}</span>
                <div class="contact-description">{{current_contact_description}}</div>
            </div>
            
            <div class="chat-messages" id="chat-messages">
                {{chat_messages}}
            </div>
            
            {{input_area}}
        </div>
    </div>
    
    <script>
        // Core JavaScript that doesn't change often
        {{core_scripts}}
    </script>
</body>
</html>
`;
```

## 3. Component Templates (`src/templates/components.ts`)

```typescript
// Dynamic UI components as template literals
export const contactList = (contact: any): string => `
<div class="contact-item ${contact.active ? 'active' : ''}" 
     data-contact-id="${contact.id}" 
     data-contact-type="${contact.type}"
     onclick="switchContact('${contact.id}')">
    <div class="contact-avatar ${contact.type}-avatar" 
         style="background: ${contact.avatarColor}">
        ${contact.avatar}
    </div>
    <div class="contact-info">
        <div class="contact-name">${contact.name}</div>
        <div class="contact-type">${contact.type === 'ai' ? 'AI Assistant' : 'Friend'}</div>
    </div>
</div>
`;

export const messageBubble = (message: any): string => `
<div class="message ${message.type}-message" data-contact="${message.contactId}">
    <div class="message-sender">
        <div class="sender-avatar" style="background: ${message.avatarColor}">
            ${message.avatar}
        </div>
        ${message.senderName}
    </div>
    <div class="message-content">${message.content}</div>
    <div class="message-time">${message.timestamp}</div>
</div>
`;

export const inputArea = (): string => `
<div class="input-container" id="input-container" style="display: none;">
    <textarea class="message-input" id="message-input" 
              placeholder="Type your message..." rows="3"></textarea>
    <button class="send-button" onclick="sendMessage()">Send</button>
</div>
`;

export const welcomeMessage = (contact: any): string => `
<div class="welcome-message" data-contact="${contact.id}">
    <h3>Welcome to Learning Buddy!</h3>
    <p>Start a conversation with ${contact.name}!</p>
    <p><small>${contact.description}</small></p>
</div>
`;
```

## 4. Updated Chat View Provider

```typescript
import * as vscode from 'vscode';
import { TemplateEngine } from '../templates';

export class ChatViewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    
    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'media')
            ]
        };

        this._updateWebview();
    }

    private async _updateWebview() {
        if (!this._view) {
            return;
        }

        // Get your data (contacts, messages, etc.)
        const appData = await this._getAppData();
        
        // Use the hybrid template engine
        const templateEngine = TemplateEngine.getInstance();
        const html = await templateEngine.renderMainTemplate(
            this._view.webview, 
            this._extensionUri, 
            appData
        );

        this._view.webview.html = html;
        
        // Set up message handling
        this._view.webview.onDidReceiveMessage(this._handleMessage.bind(this));
    }

    private async _getAppData() {
        // Return your application data
        return {
            contacts: [
                {
                    id: 'cpp-tutor',
                    name: 'C++ Tutor',
                    type: 'ai',
                    description: 'Specialized in C++ programming',
                    avatar: 'C++',
                    avatarColor: 'var(--vscode-charts-blue)',
                    active: true,
                    messages: [] // Load from storage
                }
                // ... more contacts
            ],
            currentContact: null
        };
    }

    private _handleMessage(message: any) {
        switch (message.type) {
            case 'sendMessage':
                // Handle message sending
                break;
            case 'switchContact':
                // Handle contact switching and update view
                this._updateWebview();
                break;
        }
    }
}
```

## 5. External HTML Template (`media/chat-template.html`)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learning Buddy</title>
    <link rel="stylesheet" href="{{style_uri}}">
</head>
<body>
    <div class="chat-container">
        <!-- Contacts panel will be injected here -->
        {{contact_list}}
        
        <div class="resizer" id="resizer"></div>
        
        <div class="chat-area">
            <div class="chat-header">
                <span id="current-contact-name">
                    {{#if currentContact}}{{currentContact.name}}{{else}}Select a contact{{/if}}
                </span>
                <div class="contact-description" id="current-contact-desc">
                    {{#if currentContact}}{{currentContact.description}}{{/if}}
                </div>
            </div>
            
            <div class="chat-messages" id="chat-messages">
                {{chat_messages}}
            </div>
            
            {{input_area}}
        </div>
    </div>

    <script>
        // Core application logic that doesn't change
        {{core_scripts}}
    </script>
</body>
</html>
```

## Benefits of This Hybrid Approach:

- **🚀 Performance**: Static HTML structure in files, dynamic components in code
- **🔧 Maintainability**: Clear separation between stable and changing parts
- **📦 Lightweight**: No external dependencies, uses VS Code native APIs
- **♻️ Reusable**: Component system for consistent UI patterns
- **🎯 Type Safety**: Full TypeScript support with proper interfaces

This gives you the performance of file-based templates for the main structure while keeping dynamic components in code for easy maintenance and type safety!