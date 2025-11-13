# Terminail Extension Coding Checklist

This checklist is based on the Terminail project structure and requirements for VS Code extension development.

## Project Structure

- [x] Follow the recommended project structure:
  ```
  terminail/
  ├── src/
  │   ├── extension.ts          # Main extension entry point
  │   ├── terminailManager.ts    # Webview terminal manager
  │   ├── aiService.ts          # AI service integration
  │   ├── configurationManager.ts # Configuration management
  │   └── podmanManager.ts      # Podman container management
  ├── container/               # MCP server container files
  │   ├── mcp_server/
  │   │   └── main.js          # Playwright MCP server implementation
  │   ├── Podmanfile           # Podman container definition
  │   └── package.json         # MCP server dependencies
  ├── media/                   # Static assets
  │   └── icon.png
  └── package.json
  ```
- [x] File and folder names should reflect business intention and be descriptive
- [x] Related code files should be placed under the same folder

## Webview Terminal Implementation

- [x] Implement `TerminailWebviewProvider` class that implements `vscode.WebviewViewProvider`
- [x] Implement `resolveWebviewView()` method that:
  - [x] Sets up webview options with `enableScripts: true` and `retainContextWhenHidden: true`
  - [x] Generates HTML content with terminal interface
  - [x] Sets up message handling with `webview.onDidReceiveMessage()`
- [x] Create terminal UI with command prompt showing current AI service name followed by '>'
- [x] Implement command history with up/down arrow navigation
- [x] Support real-time output display for long-running operations

## HTML Template Structure

- [x] Keep main HTML structure in the `getWebviewContent()` method
- [x] Use proper meta tags:
  ```html
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```
- [x] Include terminal styling with proper VS Code theme variables
- [x] Implement input handling for terminal commands

## Command System Implementation

- [x] Implement `cd <ai_service>` command for switching AI services
- [x] Implement `ls` command for listing supported AI services
- [x] Implement `qi <question>` command for asking questions to current AI
- [x] Implement `status` command for showing system status
- [x] Implement `help` command for showing available commands
- [x] Implement proper command validation and error handling

## Podman Container Management

- [x] Implement `PodmanManager` class for container operations
- [x] Implement `startContainer()` method to run MCP server in Podman
- [x] Implement `startBrowser()` method to launch browser with debug port
- [x] Implement status checking methods for container and browser
- [x] Handle container lifecycle (start, stop, restart)

## MCP Server Integration

- [x] Create Playwright MCP server in container/mcp_server/main.js
- [x] Implement connection to host browser via Chrome DevTools Protocol (CDP)
- [x] Implement API endpoints for switching AI services and asking questions
- [x] Handle browser automation requests from extension
- [x] Translate MCP commands into Playwright automation scripts

## JavaScript Implementation

- [x] Keep core application logic in external JavaScript within webview
- [x] Use event delegation for terminal input and display
- [x] Implement proper error handling for command execution
- [x] Add console logging for debugging
- [x] Implement command history navigation
- [x] Handle terminal scrolling for large outputs

## CSS Styling

- [x] Use VS Code CSS variables for consistency:
  ```css
  --vscode-editor-background
  --vscode-editor-foreground
  --vscode-button-background
  ```
- [x] Style terminal with monospace font for proper alignment
- [x] Implement proper color coding for different terminal elements

## Performance Considerations

- [x] Minimize DOM manipulation in terminal display
- [x] Efficient command history management
- [x] Proper resource cleanup when extension is deactivated
- [x] Use efficient string operations for terminal output

## Type Safety

- [x] Use TypeScript interfaces for data structures
- [x] Define proper types for terminal messages and commands
- [x] Use type checking for all method parameters
- [x] Implement proper error handling for missing data

## Maintainability

- [x] Separate concerns between UI (webview), business logic (manager), and external services (MCP server)
- [x] Use clear, descriptive names for components and methods
- [x] Document complex terminal and container logic
- [x] Keep terminal UI code separate from Podman management code

## Testing Requirements

- [x] Unit tests for every feature and update before build & package
- [x] Test webview functionality in isolation
- [x] Verify all UI components render correctly
- [x] Test all terminal commands (cd, ls, qi, status, help)
- [x] Verify message passing between extension and webview
- [x] Test with different screen sizes and VS Code themes
- [x] Verify proper error handling for container management
- [x] Test browser connection and automation
- [x] Validate Content Security Policy doesn't block legitimate content
- [x] Test error handling for network issues between extension and MCP server
- [x] Verify all configuration options work as expected
- [x] Run automated test suite with `npm test` or equivalent
- [x] Test cross-platform compatibility (Windows, macOS, Linux)
- [x] Verify extension doesn't cause memory leaks or performance issues

## Integration Testing
- [x] Auto install/uninstall extension using VS Code "code" command to verify real functionality:
  - [x] Package extension with `vsce package` or `npm run package`
  - [x] Install extension using `code --install-extension <extension-file>.vsix`
  - [x] Verify extension functionality in VS Code
  - [x] Test terminal commands work properly
  - [x] Verify Podman container starts correctly
  - [x] Uninstall extension using `code --uninstall-extension <publisher>.<extension-name>`
- [x] Run automated integration tests to verify extension components:
  - [x] Verify all terminal commands work as expected
  - [x] Validate package.json configuration
  - [x] Manually verify UI elements in VS Code as documented
  - [x] Test Podman container and browser integration
  - [x] Verify AI service switching functionality
  - [x] Test question answering workflow
- [x] Perform real behavior verification by installing and testing the extension in a clean VS Code environment using the `code` command:
  - [x] Package the extension using `npm run package`
  - [x] Install the extension using `code --install-extension terminail-0.1.0.vsix`
  - [x] Launch VS Code and verify all extension features work correctly in a real environment
  - [x] Test the Terminail terminal view appears correctly
  - [x] Verify the cd command switches AI services correctly
  - [x] Test the ls command lists AI services correctly
  - [x] Verify the qi command asks questions and displays responses
  - [x] Test all extension commands and UI interactions
  - [x] Uninstall the extension using `code --uninstall-extension terminail`
  - [x] Confirm the extension is completely removed and VS Code returns to its original state
  - [x] Run automated end-to-end tests using `npm run test` to verify complete extension lifecycle

## Other Testing Requirements
- [x] Test with extension disabled/enabled scenarios
- [x] Verify proper cleanup when extension is deactivated
- [x] Test terminal command history functionality
- [x] Verify proper handling of long-running AI requests
- [x] Test switching between different AI services (deepseek, qwen, doubao, chatgpt)
- [x] Verify proper error messages when Podman or browser is not available
- [x] Test command prompt updates to reflect current AI service context
- [x] When writing terminal commands, use Git Bash syntax and paths (not PowerShell) for cross-platform compatibility

## Build and Packaging Optimization
- [x] Implement optimized build script with size reduction
- [x] Remove unnecessary files (source maps, test files) from package
- [x] Minify JavaScript files for smaller package size
- [x] Verify .vscodeignore properly excludes development files
- [x] Use build:optimized script for production packages
- [x] Monitor package size during build process
- [x] Test functionality after size optimizations