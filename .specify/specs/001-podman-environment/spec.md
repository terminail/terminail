# Feature Specification: Podman Environment

**Feature Branch**: `001-podman-environment`  
**Created**: 2025-11-07  
**Status**: Draft  
**Input**: User description: "Replace Docker with Podman for enhanced security and rootless operation."

## Related Documents
- Extension: `d:\git\6terminail\terminail-vscode-extension`
- MCP Server: `d:\git\6terminail\mcp-server`
- Container Environment: `d:\git\6terminail\container`
- Playwright MCP Server: `d:\git\6terminail\container\mcp_server`
- Auto-Build Specification: `d:\git\6terminail\.specify\specs\010-auto-podman-build\spec.md`

## Implementation Summary

This feature implements integration with Podman containerization to run a Playwright MCP (Model Context Protocol) server for browser automation. The Podman environment provides a secure, isolated infrastructure for running the MCP server that controls browser interactions with AI chat websites. This approach enhances security by keeping browser automation within a container while also simplifying installation and improving startup performance.

The Playwright MCP server running in the Podman container connects to a host browser instance via Chrome DevTools Protocol (CDP) to automate interactions with pre-logged-in AI chat websites like DeepSeek, Qwen, and Doubao. This architecture allows the Terminail terminal extension to send natural language commands to control browser interactions without requiring direct browser automation from the extension.

**Note**: Podman is a **mandatory requirement** for this extension. The Playwright MCP server that enables browser automation for AI chat websites runs in a Podman container. The extension includes functionality for managing Podman containers for lightweight, daemonless operation, eliminating the need for users to manually manage the container.

**Critical Requirement**: The Terminail extension MUST perform comprehensive Podman environment checks at startup and before any Podman operations to ensure the container functionality is properly initialized and actively running. This is a critical requirement for the proper functioning of the browser automation features.

**Architecture Note**: The Terminail extension uses a single Podman container to run the Playwright MCP server:
1. **Terminail Podman Environment**: This is the infrastructure container that hosts the Playwright MCP server. The MCP server connects to a host browser instance via Chrome DevTools Protocol (CDP) to automate interactions with AI chat websites. This environment is managed by the Terminail extension.

The Terminail Podman Environment handles browser automation requests from the extension and translates them into Playwright commands that control the host browser. This architecture provides security isolation while maintaining the ability to interact with pre-logged-in AI websites.

## Enhancement: Persistent Installation Instructions

When Podman is not installed or not available on the user's system, the extension now displays persistent installation instructions directly in the Terminail terminal panel instead of transient popup dialogs. This enhancement improves the user experience by providing clear, always-visible guidance on how to resolve the Podman dependency issue.

The panel shows:
- Clear explanation of why Podman is required for browser automation
- Step-by-step installation instructions
- Direct links to platform-specific installation guides
- Troubleshooting options for common issues

This approach ensures users always know what to do when Podman is missing, rather than having to remember transient error messages.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initialize Terminail Podman Environment (Priority: P1)

As a developer using multiple AI chat services, I want the extension to automatically initialize the Podman container for the Playwright MCP server so that I can immediately start interacting with AI services through the terminal interface.

**Why this priority**: This is essential for providing a seamless user experience with the browser automation capabilities.

**Independent Test**: Can be fully tested by installing the extension and verifying that the Podman container for the MCP server is initialized automatically when the terminal is opened.

**Acceptance Scenarios**:

1. **Given** a fresh extension installation, **When** a user opens the Terminail terminal, **Then** the extension should automatically initialize the Podman container with the Playwright MCP server.
2. **Given** an existing Podman environment, **When** a user opens the terminal, **Then** the extension should verify the container is up-to-date and start it if needed.

### User Story 2 - Control Browser Through Podman Container Communication (Priority: P1)

As a developer using multiple AI chat services, I want the extension to communicate with the Podman container running the Playwright MCP server to control browser interactions so that I can automate interactions with AI chat websites securely.

**Why this priority**: This is the core functionality - enabling browser automation through containerized MCP server while keeping the extension secure.

**Independent Test**: Can be fully tested by sending commands through the terminal and verifying that the container controls browser interactions.

**Acceptance Scenarios**:

1. **Given** a user with the Terminail terminal open, **When** they send a command to switch AI services, **Then** the extension should communicate with the Podman container that controls browser navigation.
2. **Given** a user with the terminal ready, **When** they send a question to an AI service, **Then** the extension should communicate with the container to automate browser interactions and retrieve the response.

### User Story 3 - Access AI Services Through Terminal Commands (Priority: P1)

As a developer using multiple AI chat services, I want to interact with AI chat websites through terminal commands in VS Code so that I can efficiently work with multiple AI services without switching between browser tabs.

**Why this priority**: This is essential for the core user experience - users need to access AI services through familiar terminal commands.

**Independent Test**: Can be fully tested by using terminal commands and verifying that AI services are accessed through browser automation.

**Acceptance Scenarios**:

1. **Given** a user with the Terminail terminal open, **When** they use the 'cd' command to switch AI services, **Then** the browser should navigate to the appropriate AI chat website.
2. **Given** a user with the terminal ready, **When** they use the 'qi' command to send a question, **Then** they should receive the AI response directly in the terminal.

### User Story 4 - Secure Container Access with Authentication (Priority: P2)

As a course creator, I want the Podman container to require authentication for access so that unauthorized users cannot access the development environment.

**Why this priority**: This enhances security but is not core functionality.

**Independent Test**: Can be tested by attempting to access the container without proper authentication.

**Acceptance Scenarios**:

1. **Given** a user trying to access the container, **When** they don't provide the correct password, **Then** they should be denied access.
2. **Given** a user with the correct password, **When** they try to access the container, **Then** they should be granted access.

### User Story 5 - Manage Container Resources (Priority: P2)

As a C++ Primer 5th Edition learner, I want the Podman container to have appropriate resource limits so that it doesn't consume excessive system resources.

**Why this priority**: This enhances user experience by preventing resource abuse but is not core functionality.

**Independent Test**: Can be tested by monitoring container resource usage during intensive operations.

**Acceptance Scenarios**:

1. **Given** a user running intensive compilation tasks, **When** the container approaches resource limits, **Then** performance should be maintained within reasonable bounds.
2. **Given** multiple containers running, **When** system resources are monitored, **Then** each container should respect its allocated limits.

### User Story 6 - Critical Embedded Podman Environment Verification (Priority: P0)

As a learner using the Learning Buddy extension, I want the extension to immediately check if the embedded Podman is initialized and running so that I know right away if I can use the extension.

**Why this priority**: This is critical for user experience - users must know immediately if embedded Podman is missing or not running to avoid confusion and wasted time.

**Independent Test**: Can be tested by running the extension on systems with and without embedded Podman properly initialized, and with embedded Podman running and stopped.

**Acceptance Scenarios**:

1. **Given** a system where embedded Podman fails to initialize, **When** the extension starts, **Then** it should immediately display a clear error message with troubleshooting instructions and prevent all functionality.
2. **Given** a system with embedded Podman initialized but not running, **When** the extension starts, **Then** it should immediately display a clear error message with instructions to start embedded Podman and prevent all functionality.
3. **Given** a system with embedded Podman initialized and running, **When** the extension starts, **Then** it should proceed with normal initialization without any embedded Podman-related warnings.

### User Story 7 - Specify Custom Podman Installation Folder (Priority: P2)

As a system administrator or advanced user, I want to specify a custom Podman installation folder so that I can use Podman installed in non-standard locations or enterprise-managed installations.

**Why this priority**: This enhances flexibility for enterprise environments and advanced users but is not core functionality for typical users.

**Independent Test**: Can be tested by installing Podman in a non-standard location and verifying that the extension can use it when the folder is specified.

**Acceptance Scenarios**:

1. **Given** Podman installed in a non-standard directory, **When** the extension starts and cannot find Podman in standard locations, **Then** it should prompt the user to specify an installation folder.
2. **Given** a user specifies a custom Podman folder, **When** the folder contains a valid Podman executable, **Then** the extension should use that Podman installation.
3. **Given** a user specifies a custom Podman folder, **When** the folder does not contain a valid Podman executable, **Then** the extension should show an appropriate error message.

### User Story 8 - Cross-Platform Podman Support (Priority: P1)

As a learner using the Learning Buddy extension, I want the extension to work consistently across Windows, macOS, and Linux so that I can use it regardless of my operating system.

**Why this priority**: This is essential for broad user adoption and accessibility.

**Independent Test**: Can be tested by running the extension on different operating systems and verifying consistent behavior.

**Acceptance Scenarios**:

1. **Given** a user on Windows, **When** they install and run the extension, **Then** it should properly detect and use Podman.
2. **Given** a user on macOS, **When** they install and run the extension, **Then** it should properly detect and use Podman.
3. **Given** a user on Linux, **When** they install and run the extension, **Then** it should properly detect and use Podman.

### User Story 9 - Persistent Installation Instructions (Priority: P0)

As a learner using the Learning Buddy extension, I want to see persistent installation instructions in the panel when Podman is not available so that I always know what to do to resolve the issue.

**Why this priority**: This is critical for user experience - users must have clear, always-visible guidance when Podman is missing.

**Independent Test**: Can be tested by running the extension on systems without Podman installed and verifying that installation instructions are displayed in the panel.

**Acceptance Scenarios**:

1. **Given** a system where Podman is not installed, **When** the extension starts, **Then** it should display persistent installation instructions in the Learning Buddy panel.
2. **Given** a system where Podman is not installed, **When** the user clicks on installation instruction items, **Then** they should see detailed guidance.
3. **Given** a system where Podman is not installed, **When** the user clicks the support contact option, **Then** they should be directed to contact support.

### Edge Cases

- What happens when embedded Podman fails to initialize? (Answer: Extension must display clear error and guidance immediately at startup and prevent all functionality)
- How does the system handle network issues during environment initialization?
- What happens when the embedded Podman is not running? (Answer: Extension must detect and notify user immediately at startup and prevent all functionality)
- How does the system handle container initialization failures?
- What happens when there's insufficient disk space for the container?
- How does the system handle updates to the Podman environment?
- What happens when a custom Podman installation becomes invalid? (Answer: Extension must detect and prompt user for new location)
- How does the system handle platform-specific command syntax and file paths?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Extension MUST include embedded Podman functionality for lightweight, daemonless operation
- **FR-002**: Extension MUST initialize the Podman environment automatically, including automatic building of the Playwright MCP server image using the container/mcp_server directory
- **FR-003**: Extension MUST communicate with Podman containers to manage browser automation for AI service access
- **FR-004**: Extension MUST prevent browser automation data from being stored on the host filesystem
- **FR-005**: Extension MUST integrate with Terminail Terminal for seamless AI service access
- **FR-006**: Extension MUST provide secure container access with authentication
- **FR-007**: Extension MUST manage container resources with appropriate limits
- **FR-008**: Extension MUST verify embedded Podman functionality and provide clear error messages when Podman is not available
- **FR-009**: Extension MUST require embedded Podman to be initialized and running for all functionality
- **FR-010**: Extension MUST update the Podman environment when newer versions are available
- **FR-011**: Extension MUST perform Podman environment checks at startup before any other operations
- **FR-012**: Extension MUST verify embedded Podman is actively running
- **FR-013**: Extension MUST immediately block all functionality and display clear error messages if embedded Podman is not properly initialized or running
- **FR-014**: Extension MUST provide specific troubleshooting guidance for embedded Podman issues
- **FR-015**: Extension MUST continuously monitor Podman status during operation and handle Podman daemon stoppages gracefully
- **FR-016**: Extension MUST provide cross-platform support for Windows, macOS, and Linux
- **FR-017**: Extension MUST handle platform-specific command syntax and file paths
- **FR-018**: Extension MUST provide platform-appropriate error messages and installation guidance
- **FR-019**: Extension MUST prompt user to specify custom Podman installation folder when Podman is not found in standard locations
- **FR-020**: Extension MUST validate that the specified folder contains a valid Podman executable
- **FR-021**: Extension MUST remember the custom Podman installation folder between VS Code sessions
- **FR-022**: Extension MUST NOT provide a "Continue Anyway" option when Podman is not available as it is a mandatory requirement
- **FR-023**: Extension MUST support Podman Desktop and WSL2-based Podman on Windows
- **FR-024**: Extension MUST support Homebrew-installed Podman on macOS
- **FR-025**: Extension MUST support distribution package managers (apt, dnf, pacman) on Linux
- **FR-026**: Extension MUST handle case-sensitive file systems on macOS
- **FR-027**: Extension MUST support both Intel and Apple Silicon architectures on macOS
- **FR-028**: Extension MUST handle various shell environments (bash, zsh, etc.) on Linux
- **FR-029**: Extension MUST support systemd-based and non-systemd systems on Linux
- **FR-030**: Extension MUST handle user permissions for rootless Podman on Linux
- **FR-031**: Extension MUST display persistent installation instructions in the panel when Podman is not available
- **FR-032**: Extension MUST provide detailed installation guidance when users click on installation instruction items
- **FR-033**: Extension MUST provide a contact support option when Podman is not available
- **FR-034**: Extension MUST include platform-specific installation links in the installation guidance

### Key Entities

- **PodmanEnvironmentManager**: Manages initializing, and controlling the embedded Podman environment
- **ExtensionContainerInterface**: Simplified interface in the extension for communicating with containers (replaces ContentDownloader)
- **ContainerAccessController**: Manages secure access to the Podman container
- **ResourceMonitor**: Monitors and manages container resource usage
- **PodmanEnvironment**: The embedded Podman development environment
- **PodmanStatusChecker**: Critical component that verifies Podman installation and active status at startup and during operation

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Embedded Podman environment is initialized in 95% of cases within 30 seconds
- **SC-002**: Learning materials are accessed through the embedded container in 99% of cases
- **SC-003**: Protected content is not accessible from the host filesystem in 100% of cases
- **SC-004**: Container starts successfully in 98% of attempts
- **SC-005**: Resource limits are enforced in 100% of cases
- **SC-006**: Authentication prevents unauthorized access in 100% of cases
- **SC-007**: 90% of users can successfully access AI services through Terminail Terminal commands
- **SC-008**: Podman installation and status verification completes in 100% of cases within 2 seconds
- **SC-009**: Clear error messages are displayed for Podman issues in 100% of cases
- **SC-010**: Extension blocks all functionality when Podman is not available in 100% of cases
- **SC-011**: Podman status monitoring detects changes in daemon status in 95% of cases within 5 seconds
- **SC-012**: Cross-platform functionality works on Windows, macOS, and Linux in 95% of cases
- **SC-013**: Platform-specific error messages are displayed in 100% of error cases
- **SC-014**: Installation guidance leads to successful installation in 90% of cases
- **SC-015**: Custom Podman folder specification works on 100% of supported platforms
- **SC-016**: Custom Podman path is correctly saved and loaded in 100% of cases
- **SC-017**: Extension prevents all functionality when Podman is not available in 100% of cases
- **SC-018**: Windows-specific Podman support works in 95% of cases
- **SC-019**: macOS-specific Podman support works in 95% of cases
- **SC-020**: Linux-specific Podman support works in 95% of cases
- **SC-021**: Persistent installation instructions are displayed in 100% of cases when Podman is not available
- **SC-022**: Detailed installation guidance is provided in 100% of cases when users click on installation instruction items
- **SC-023**: Contact support option works in 100% of cases when Podman is not available
- **SC-024**: Platform-specific installation links work in 100% of cases