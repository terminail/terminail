# Feature Specification: TerminAI Terminal

**Feature Branch**: `002-terminai-terminal`  
**Created**: 2025-11-11  
**Status**: Draft  
**Input**: User description: "Create a terminal-like VS Code extension called TerminAI that supports commands like 'cd deepseek' for switching AI chat contexts, 'ls' for listing supported AI websites, and 'qi xxxx' for sending questions to AI websites through browser automation via MCP server running in Podman container."

## Implementation Summary

This feature implements a terminal-like interface within VS Code that allows users to interact with multiple AI chat websites through natural language commands. The extension leverages Playwright MCP (Model Context Protocol) server running in a Podman container to automate browser interactions with pre-logged-in AI websites. Users can switch between different AI services, send questions, and receive responses directly in the terminal interface.

The architecture consists of:
1. VS Code Extension with terminal-like UI
2. Podman container running Playwright MCP Server
3. Host browser instance with debug port for CDP (Chrome DevTools Protocol) connection
4. Pre-logged-in AI websites (DeepSeek, Qwen, Doubao, etc.)

Key technical approach:
- Extension automatically starts Podman container with MCP server
- Extension guides user to start browser with debug port
- MCP server connects to browser via CDP to control AI websites
- Terminal interface provides familiar command-line experience (cd, ls, qi commands)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initialize TerminAI Terminal Environment (Priority: P1)

As a developer using multiple AI services, I want to open the TerminAI terminal and have it automatically set up the required environment so that I can immediately start interacting with AI services without manual configuration.

**Why this priority**: This is essential for providing a seamless user experience with the terminal interface.

**Independent Test**: Can be fully tested by installing the extension and verifying that the terminal initializes the Podman container and guides browser setup automatically.

**Acceptance Scenarios**:

1. **Given** a fresh extension installation, **When** a user runs the "Open TerminAI Terminal" command, **Then** the extension should automatically start a Podman container with the MCP server.
2. **Given** the MCP server is running, **When** a user opens the terminal, **Then** they should be guided through starting a browser with debug port for CDP connection.
3. **Given** a browser with debug port is running, **When** the user completes setup, **Then** the terminal should show a ready state with available commands.

### User Story 2 - Switch Between AI Services (Priority: P1)

As a developer using multiple AI services, I want to switch between different AI chat websites using the 'cd' command so that I can easily move between services without re-authentication.

**Why this priority**: This is core functionality for the multi-AI experience.

**Independent Test**: Can be fully tested by switching between AI services and verifying that the MCP server navigates to the correct websites.

**Acceptance Scenarios**:

1. **Given** a user with a ready terminal, **When** they type "cd deepseek", **Then** the MCP server should navigate to the DeepSeek chat website.
2. **Given** a user with a ready terminal, **When** they type "cd qwen", **Then** the MCP server should navigate to the Qwen chat website.
3. **Given** a user with a ready terminal, **When** they type "cd doubao", **Then** the MCP server should navigate to the Doubao chat website.

### User Story 3 - List Available AI Services (Priority: P2)

As a developer exploring AI services, I want to see a list of supported AI chat websites using the 'ls' command so that I know which services I can interact with.

**Why this priority**: This enhances discoverability but is not core functionality.

**Independent Test**: Can be fully tested by running the 'ls' command and verifying the output shows supported AI services.

**Acceptance Scenarios**:

1. **Given** a user with a ready terminal, **When** they type "ls", **Then** the terminal should display a list of supported AI services (deepseek, qwen, doubao).
2. **Given** a user with a ready terminal, **When** they type "ls" after adding new AI services, **Then** the terminal should show the updated list including new services.

### User Story 4 - Send Questions to AI Services (Priority: P1)

As a developer seeking AI assistance, I want to send questions to the current AI service using the 'qi' command so that I can get answers directly in the terminal interface.

**Why this priority**: This is the core value proposition of the extension.

**Independent Test**: Can be fully tested by sending questions and verifying that responses are received and displayed in the terminal.

**Acceptance Scenarios**:

1. **Given** a user with a ready terminal and selected AI service, **When** they type "qi <question>", **Then** the MCP server should send the question to the AI website and display the response in the terminal.
2. **Given** a user with a ready terminal, **When** they send a question and the AI is generating a response, **Then** the terminal should show progress indicators or partial responses as they arrive.
3. **Given** a user with a ready terminal, **When** they send a question to an AI service that is not responding, **Then** the terminal should show appropriate timeout or error messages.

### User Story 5 - Handle Browser Disconnection (Priority: P2)

As a developer using TerminAI, I want the extension to automatically detect when the browser connection is lost and guide me to reconnect so that I can continue using the service without technical knowledge of the underlying system.

**Why this priority**: This enhances reliability but is not core functionality for initial use.

**Independent Test**: Can be tested by stopping and restarting the browser with debug port.

**Acceptance Scenarios**:

1. **Given** a user with a ready terminal, **When** the browser with debug port is closed, **Then** the terminal should detect the disconnection and guide the user to restart the browser.
2. **Given** a user with a disconnected browser, **When** they follow the guidance to restart the browser, **Then** the terminal should automatically reconnect and resume normal operation.

### User Story 6 - Handle Podman Container Issues (Priority: P2)

As a developer using TerminAI, I want the extension to automatically detect when the Podman container is not running and guide me to resolve the issue so that I can continue using the service.

**Why this priority**: This enhances reliability but is not core functionality for initial use.

**Independent Test**: Can be tested by stopping and restarting the Podman container.

**Acceptance Scenarios**:

1. **Given** a user with a ready terminal, **When** the Podman container is stopped, **Then** the terminal should detect the issue and guide the user to restart the container.
2. **Given** a user with a stopped container, **When** they follow the guidance to restart the container, **Then** the terminal should automatically reconnect and resume normal operation.

### Edge Cases

- What happens when the user has not logged into AI websites before using the extension?
- How does the system handle network issues during AI response generation?
- What happens when the selected AI service is temporarily unavailable?
- How does the system handle very long AI responses that exceed terminal display limits?
- What happens when multiple terminal instances are opened simultaneously?
- How does the system handle browser instances with multiple tabs open to different AI services?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Extension MUST provide terminal-like interface within VS Code with familiar command prompt
- **FR-002**: Extension MUST automatically start Podman container with Playwright MCP server on terminal initialization
- **FR-003**: Extension MUST guide user to start browser with debug port for CDP connection
- **FR-004**: Extension MUST connect to MCP server running in Podman container
- **FR-005**: Extension MUST send commands to MCP server to control browser via CDP
- **FR-006**: Extension MUST support 'cd <ai_service>' command to switch between AI chat websites
- **FR-007**: Extension MUST support 'ls' command to list available AI services
- **FR-008**: Extension MUST support 'qi <question>' command to send questions to current AI service
- **FR-009**: Extension MUST display AI responses in the terminal interface
- **FR-010**: Extension MUST handle browser disconnection and guide user to reconnect
- **FR-011**: Extension MUST handle Podman container issues and guide user to resolve
- **FR-012**: Extension MUST preserve browser login state between sessions using user data directory
- **FR-013**: Extension MUST support multiple AI services (DeepSeek, Qwen, Doubao as minimum)
- **FR-014**: Extension MUST provide real-time or progressive response display during AI generation
- **FR-015**: Extension MUST show clear error messages for timeout, network, or service issues
- **FR-016**: Extension MUST automatically detect and use available ports for browser debug and MCP server
- **FR-017**: Extension MUST provide help command or documentation for available commands
- **FR-018**: Extension MUST handle cross-platform differences (Windows, macOS, Linux) for browser launching
- **FR-019**: Extension MUST clean up resources (containers, browser processes) on shutdown
- **FR-020**: Extension MUST provide status command to show current system state

### Key Entities

- **TerminAITerminal**: Main terminal interface component that handles user input and displays output
- **PodmanManager**: Manages Podman container lifecycle for MCP server
- **BrowserManager**: Handles browser launching with debug port and connection status
- **MCPClient**: Communicates with MCP server in Podman container to send commands and receive responses
- **AIServiceManager**: Manages available AI services and current service context
- **StateManager**: Tracks extension state including current AI service, connection status, and system health

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Terminal initializes with Podman container and browser connection in 95% of cases within 30 seconds
- **SC-002**: AI service switching via 'cd' command completes successfully in 98% of attempts
- **SC-003**: Questions sent via 'qi' command receive responses in 95% of cases
- **SC-004**: Browser disconnection is detected and user is guided to reconnect in 90% of cases
- **SC-005**: Podman container issues are detected and user is guided to resolve in 90% of cases
- **SC-006**: AI responses are displayed in terminal with acceptable latency (under 5 seconds for initial response)
- **SC-007**: 90% of users can successfully send questions and receive responses within 2 minutes of first use
- **SC-008**: Extension handles cross-platform browser launching correctly in 95% of cases
- **SC-009**: Resource cleanup occurs properly in 99% of shutdown scenarios
- **SC-010**: Help documentation is accessible and accurate in 100% of cases