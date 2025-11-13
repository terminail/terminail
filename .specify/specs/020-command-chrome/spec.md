# Feature Specification: Chrome Command

**Feature Branch**: `020-command-chrome`  
**Created**: 2025-11-11  
**Status**: Draft  
**Input**: User description: "The 'chrome' command launches a Chrome browser instance with remote debugging enabled, following the pattern described in terminai.md lines 1948-1949."
**Parent Feature**: [020-command](../020-command/spec.md)

## Implementation Summary

This feature implements the `chrome` command for the TerminAI terminal interface, allowing users to launch a Chrome browser instance with remote debugging enabled. The command follows the pattern described in terminai.md lines 1948-1949, launching Chrome with the `--remote-debugging-port=9222` and `--user-data-dir=/tmp/TerminAI` parameters. This enables the Playwright MCP server running in a Podman container to connect to the browser via Chrome DevTools Protocol (CDP) for automating interactions with AI chat websites.

The implementation involves parsing the `chrome` command in the terminal interface, validating system requirements, and executing the appropriate Chrome launch command for the user's operating system. The command provides immediate feedback to the user about the success or failure of the browser launch operation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Launch Chrome with Debugging (Priority: P1)

As a developer using TerminAI, I want to use the `chrome` command to launch a Chrome browser with remote debugging enabled so that the MCP server can connect to it for AI service automation.

**Why this priority**: This is core functionality for enabling browser automation.

**Independent Test**: Can be fully tested by executing the `chrome` command and verifying that Chrome launches with the correct parameters.

**Acceptance Scenarios**:

1. **Given** a user with a ready TerminAI terminal, **When** they type "chrome", **Then** the extension should launch Chrome with `--remote-debugging-port=9222` and `--user-data-dir=/tmp/TerminAI`.
2. **Given** a user on Windows, **When** they execute "chrome", **Then** the extension should launch Chrome using the Windows Chrome executable path.
3. **Given** a user on macOS, **When** they execute "chrome", **Then** the extension should launch Chrome using the macOS Chrome executable path.
4. **Given** a user on Linux, **When** they execute "chrome", **Then** the extension should launch Chrome using the Linux Chrome executable path.

### User Story 2 - Command Feedback and Validation (Priority: P1)

As a developer using TerminAI, I want immediate feedback when I use the `chrome` command so that I know whether the browser launch was successful.

**Why this priority**: This is essential for providing a responsive user experience.

**Independent Test**: Can be fully tested by executing the `chrome` command and verifying appropriate feedback is provided.

**Acceptance Scenarios**:

1. **Given** a user executing a valid `chrome` command, **When** the command completes, **Then** the terminal should display confirmation of the browser launch.
2. **Given** a user executing the `chrome` command when Chrome is already running with debugging, **When** the command processes, **Then** the terminal should display an appropriate message.
3. **Given** a user executing the `chrome` command when Chrome is not installed, **When** the command fails, **Then** the terminal should display an appropriate error message with installation guidance.

### User Story 3 - Chrome Process Management (Priority: P2)

As a developer using TerminAI, I want the extension to manage Chrome processes appropriately so that I don't end up with multiple debugging instances.

**Why this priority**: This enhances user experience by preventing resource conflicts.

**Independent Test**: Can be tested by launching Chrome multiple times and verifying process management.

**Acceptance Scenarios**:

1. **Given** a user executing "chrome" when no debugging Chrome is running, **When** the command processes, **Then** a new Chrome instance should be launched.
2. **Given** a user executing "chrome" when a debugging Chrome is already running, **When** the command processes, **Then** the terminal should indicate the existing instance.
3. **Given** a user closing the debugging Chrome, **When** they execute "chrome" again, **Then** a new instance should be launched.

### User Story 4 - Cross-Platform Chrome Launching (Priority: P1)

As a developer using TerminAI on different operating systems, I want the `chrome` command to work consistently across Windows, macOS, and Linux so that I can use TerminAI regardless of my platform.

**Why this priority**: This is essential for broad user adoption and accessibility.

**Independent Test**: Can be tested by running the extension on different operating systems and verifying consistent Chrome launching.

**Acceptance Scenarios**:

1. **Given** a user on Windows, **When** they execute "chrome", **Then** Chrome should launch with the correct parameters for Windows.
2. **Given** a user on macOS, **When** they execute "chrome", **Then** Chrome should launch with the correct parameters for macOS.
3. **Given** a user on Linux, **When** they execute "chrome", **Then** Chrome should launch with the correct parameters for Linux.
4. **Given** a user on any platform with Chrome installed in a non-standard location, **When** they execute "chrome", **Then** the extension should attempt to locate Chrome or provide guidance for configuration.

### Edge Cases

- What happens when Chrome is already running without debugging enabled?
- How does the system handle Chrome installation in non-standard locations?
- What happens when the user doesn't have permissions to launch Chrome?
- How does the system handle very long user data directory paths?
- What happens when the specified debugging port is already in use?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Extension MUST support `chrome` command syntax
- **FR-002**: Extension MUST launch Chrome with `--remote-debugging-port=9222` parameter
- **FR-003**: Extension MUST launch Chrome with `--user-data-dir=/tmp/TerminAI` parameter
- **FR-004**: Extension MUST provide immediate feedback for successful browser launch
- **FR-005**: Extension MUST display error messages for Chrome launch failures
- **FR-006**: Extension MUST handle existing Chrome debugging instances appropriately
- **FR-007**: Extension MUST support cross-platform Chrome launching (Windows, macOS, Linux)
- **FR-008**: Extension MUST locate Chrome executable on each supported platform
- **FR-009**: Extension MUST handle Chrome not found errors gracefully
- **FR-010**: Extension MUST handle permission errors appropriately
- **FR-011**: Extension MUST handle port conflicts gracefully
- **FR-012**: Extension MUST limit user data directory path length to prevent issues
- **FR-013**: Extension MUST handle special characters in paths appropriately
- **FR-014**: Extension MUST provide clear error messages for all failure scenarios
- **FR-015**: Extension MUST support case-insensitive command matching
- **FR-016**: Extension MUST handle concurrent `chrome` commands appropriately

### Key Entities

- **ChromeCommandHandler**: Processes `chrome` commands and manages browser launching
- **ChromeLauncher**: Handles cross-platform Chrome executable location and launch
- **ProcessManager**: Manages Chrome processes and detects existing debugging instances
- **PlatformDetector**: Detects the current operating system for platform-specific handling

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `chrome` command launches Chrome with correct parameters in 99% of cases
- **SC-002**: Windows Chrome launching works correctly in 95% of cases
- **SC-003**: macOS Chrome launching works correctly in 95% of cases
- **SC-004**: Linux Chrome launching works correctly in 95% of cases
- **SC-005**: Existing Chrome debugging instances are detected in 95% of cases
- **SC-006**: Chrome not found errors are handled with appropriate guidance in 100% of cases
- **SC-007**: Permission errors are handled gracefully in 100% of cases
- **SC-008**: Port conflicts are handled with appropriate error messages in 95% of cases
- **SC-009**: Immediate feedback is provided for command execution in 100% of cases
- **SC-010**: Concurrent `chrome` commands are handled without interference in 100% of cases