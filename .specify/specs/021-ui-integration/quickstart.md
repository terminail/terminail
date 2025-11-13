# Quick Start: UI Integration for Sidebar Icon and Panel Placement

**Feature**: UI Integration for Sidebar Icon and Panel Placement  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)  
**Status**: Draft  

## Overview

This quick start guide provides step-by-step instructions for implementing UI integration in the TerminAI extension, including sidebar icon registration and panel placement in VS Code's default panel area. Follow these steps to enable quick access to TerminAI through a recognizable sidebar icon and integrate the terminal interface alongside PROBLEMS, OUTPUT, and TERMINAL panels.

## Prerequisites

Before implementing the UI integration, ensure you have:

1. VS Code Extension Development Environment set up
2. Node.js 18+ installed
3. TypeScript configured for the project
4. Access to VS Code Extension API
5. SVG icon assets for the sidebar icon

## Implementation Steps

### Step 1: Configure package.json

Add the necessary contributions to your extension's `package.json` file:

```json
{
  "contributes": {
    "viewsContainers": {
      "activitybar": [
        {
          "id": "terminai",
          "title": "TerminAI",
          "icon": "resources/icons/terminai-icon.svg"
        }
      ]
    },
    "views": {
      "terminai": [
        {
          "id": "terminai-terminal",
          "name": "Terminal",
          "type": "webview"
        }
      ]
    }
  }
}
```

### Step 2: Register the Sidebar Icon

In your extension's activation function, register the view container:

```typescript
// extension.ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Register the TerminAI view container
  const terminaiViewContainer = vscode.window.registerWebviewViewProvider(
    'terminai-terminal',
    new TerminAIViewProvider(context.extensionUri)
  );
  
  context.subscriptions.push(terminaiViewContainer);
}
```

### Step 3: Implement the View Provider

Create a webview view provider for the TerminAI terminal:

```typescript
// terminaiViewProvider.ts
import * as vscode from 'vscode';

export class TerminAIViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    // Return HTML content for the TerminAI terminal
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TerminAI Terminal</title>
      </head>
      <body>
        <!-- Terminal interface implementation -->
      </body>
      </html>
    `;
  }
}
```

### Step 4: Implement State Management

Add state management to preserve UI state between sessions:

```typescript
// uiStateManager.ts
import * as vscode from 'vscode';

export class UIStateManager {
  private static readonly STATE_KEY = 'terminai.uiState';

  static saveState(context: vscode.ExtensionContext, state: any): void {
    context.workspaceState.update(this.STATE_KEY, state);
  }

  static loadState(context: vscode.ExtensionContext): any {
    return context.workspaceState.get(this.STATE_KEY, {});
  }
}
```

### Step 5: Add Theme Support

Implement theme adaptation for the sidebar icon and panel:

```typescript
// themeAdapterManager.ts
import * as vscode from 'vscode';

export class ThemeAdapterManager {
  static getIconPath(extensionUri: vscode.Uri): vscode.Uri {
    const themeKind = vscode.window.activeColorTheme.kind;
    
    switch (themeKind) {
      case vscode.ColorThemeKind.Light:
        return vscode.Uri.joinPath(extensionUri, 'resources', 'icons', 'terminai-icon-light.svg');
      case vscode.ColorThemeKind.HighContrast:
        return vscode.Uri.joinPath(extensionUri, 'resources', 'icons', 'terminai-icon-hc.svg');
      default:
        return vscode.Uri.joinPath(extensionUri, 'resources', 'icons', 'terminai-icon-dark.svg');
    }
  }
}
```

### Step 6: Implement Accessibility Features

Add accessibility support for screen readers and keyboard navigation:

```typescript
// accessibilityManager.ts
import * as vscode from 'vscode';

export class AccessibilityManager {
  static setAriaLabel(element: HTMLElement, label: string): void {
    element.setAttribute('aria-label', label);
  }

  static registerKeyboardShortcuts(): void {
    // Register common keyboard shortcuts
    vscode.commands.registerCommand('terminai.focusSidebar', () => {
      // Focus the TerminAI sidebar icon
    });
  }
}
```

## Testing

### Manual Testing

1. **Sidebar Icon Visibility**:
   - Launch VS Code with the extension
   - Verify the TerminAI icon appears in the activity bar
   - Check icon visibility across different themes

2. **Panel Integration**:
   - Click the sidebar icon
   - Verify the TerminAI panel opens in the panel area
   - Check that it appears alongside PROBLEMS, OUTPUT, and TERMINAL

3. **State Persistence**:
   - Open the TerminAI panel
   - Resize the panel
   - Close and reopen VS Code
   - Verify the panel state is preserved

### Automated Testing

```typescript
// uiIntegration.test.ts
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('UI Integration Test Suite', () => {
  test('Sidebar icon should be registered', async () => {
    // Test that the sidebar icon is properly registered
    const view = await vscode.window.showViewColumn(vscode.ViewColumn.One);
    assert.ok(view);
  });

  test('Panel should integrate with default panels', async () => {
    // Test that the panel integrates correctly
    const panel = vscode.window.createWebviewPanel(
      'terminai',
      'TerminAI',
      vscode.ViewColumn.One
    );
    assert.ok(panel);
  });
});
```

## Common Issues and Solutions

### Issue 1: Icon Not Appearing
**Solution**: Verify the icon path in package.json and ensure the SVG file exists at the specified location.

### Issue 2: Panel Not Integrating
**Solution**: Check that the view container ID matches between `viewsContainers` and `views` sections in package.json.

### Issue 3: State Not Persisting
**Solution**: Ensure you're using the correct state API (`globalState` vs `workspaceState`) and that state is being saved properly.

### Issue 4: Theme Issues
**Solution**: Verify that all theme variants of the icon exist and that the theme adapter is correctly implemented.

## Next Steps

After implementing the basic UI integration:

1. **Enhance the Terminal Interface**: Implement the full terminal functionality within the webview
2. **Add Customization Options**: Allow users to customize the sidebar icon position and panel behavior
3. **Implement Advanced Features**: Add features like panel pinning, custom layouts, and additional views
4. **Optimize Performance**: Profile and optimize the UI for better responsiveness
5. **Conduct User Testing**: Gather feedback from users to improve the UI/UX

## References

- [VS Code Extension Guide](https://code.visualstudio.com/api)
- [View Containers API](https://code.visualstudio.com/api/extension-guides/webview)
- [Theming Guide](https://code.visualstudio.com/api/extension-capabilities/theming)
- [Accessibility Guidelines](https://code.visualstudio.com/api/references/vscode-api#Accessibility)