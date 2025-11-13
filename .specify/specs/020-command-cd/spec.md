# Feature Specification: CD Command

**Feature Branch**: `020-command-cd`  
**Created**: 2025-11-11  
**Status**: Draft  
**Input**: User description: "The 'cd' command allows users to switch between different AI chat services, similar to the Unix/Linux 'cd' (change directory) command but adapted for AI service context switching. When switching AI services, the command prompt updates to display the new AI service name followed by '>'."
**Parent Feature**: [020-command](../020-command/spec.md)

## Implementation Summary

This feature implements the `cd` command for the TerminAI terminal interface, allowing users to switch between different AI chat services. The command follows the familiar Unix/Linux `cd` (change directory) convention but adapts it for AI service context switching. When a user executes `cd <ai_service>`, the TerminAI extension communicates with the Playwright MCP server running in a Podman container to navigate the browser to the appropriate AI chat website.

The implementation involves parsing the `cd` command in the terminal interface, validating the requested AI service, and sending the appropriate navigation command to the MCP server. The command provides immediate feedback to the user about the success or failure of the context switch operation. **After a successful context switch, the terminal prompt updates to display the new AI service name followed by '>', for example: 'deepseek>'**.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch AI Service Context (Priority: P1)

As a developer using multiple AI chat services, I want to use the `cd` command to switch between different AI services so that I can easily move between services without re-authentication.

**Why this priority**: This is core functionality for the multi-AI experience.

**Independent Test**: Can be fully tested by switching between AI services and verifying that the MCP server navigates to the correct websites.

**Acceptance Scenarios**:

1. **Given** a user with a ready TerminAI terminal, **When** they type "cd deepseek", **Then** the MCP server should navigate to the DeepSeek chat website.
2. **Given** a user with a ready TerminAI terminal, **When** they type "cd qwen", **Then** the MCP server should navigate to the Qwen chat website.
3. **Given** a user with a ready TerminAI terminal, **When** they type "cd doubao", **Then** the MCP server should navigate to the Doubao chat website.
4. **Given** a user with a ready TerminAI terminal, **When** they type "cd nonexistent", **Then** the terminal should display an error message indicating the service is not supported.

### User Story 2 - Command Feedback and Validation (Priority: P1)

As a developer using TerminAI, I want immediate feedback when I use the `cd` command so that I know whether the context switch was successful.

**Why this priority**: This is essential for providing a responsive user experience.

**Independent Test**: Can be fully tested by executing the `cd` command and verifying appropriate feedback is provided.

**Acceptance Scenarios**:

1. **Given** a user executing a valid `cd` command, **When** the command completes, **Then** the terminal should display confirmation of the context switch.
2. **Given** a user executing an invalid `cd` command, **When** the command fails, **Then** the terminal should display an appropriate error message.
3. **Given** a user executing `cd` without parameters, **When** the command is processed, **Then** the terminal should display usage information or current context.

### User Story 3 - Tab Completion for AI Services (Priority: P2)

As a developer using TerminAI, I want tab completion for AI service names when using the `cd` command so that I can quickly and accurately switch between services.

**Why this priority**: This enhances usability but is not core functionality.

**Independent Test**: Can be tested by pressing tab after typing "cd " and verifying that available AI services are suggested.

**Acceptance Scenarios**:

1. **Given** a user typing "cd " and pressing tab, **When** tab completion is triggered, **Then** the terminal should display a list of available AI services.
2. **Given** a user typing "cd dee" and pressing tab, **When** tab completion is triggered, **Then** the terminal should complete the service name to "deepseek" if it's the only match.
3. **Given** a user with tab completion enabled, **When** they use the feature, **Then** it should not interfere with normal command execution.

### User Story 4 - Persistent Context Tracking (Priority: P2)

As a developer using TerminAI, I want the current AI service context to be tracked and displayed in the terminal prompt so that I always know which service I'm interacting with.

**Why this priority**: This enhances user experience by providing clear context awareness.

**Independent Test**: Can be tested by switching contexts and verifying the prompt updates correctly.

**Acceptance Scenarios**:

1. **Given** a user switching AI services with `cd`, **When** the context changes, **Then** the terminal prompt should update to reflect the current service.
2. **Given** a user restarting TerminAI, **When** the extension initializes, **Then** it should restore the last used AI service context.
3. **Given** a user with multiple terminal instances, **When** they switch contexts in one terminal, **Then** other terminals should maintain their individual contexts.

### Edge Cases

- What happens when the user provides an empty service name?
- How does the system handle service names with special characters?
- What happens when the MCP server is not responding during a context switch?
- How does the system handle very long service names that exceed reasonable limits?
- What happens when the user tries to switch to a service that requires re-authentication?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Extension MUST support `cd <ai_service>` command syntax
- **FR-002**: Extension MUST validate requested AI service names
- **FR-003**: Extension MUST send navigation commands to MCP server for valid services
- **FR-004**: Extension MUST provide immediate feedback for successful context switches
- **FR-005**: Extension MUST display error messages for invalid service names
- **FR-006**: Extension MUST update terminal prompt with current AI service name followed by '>' after successful context switch
- **FR-007**: Extension MUST handle MCP server communication failures gracefully
- **FR-008**: Extension MUST support tab completion for AI service names
- **FR-009**: Extension MUST provide usage information for `cd` command
- **FR-010**: Extension MUST maintain individual context for multiple terminal instances
- **FR-011**: Extension MUST restore last used context on restart
- **FR-012**: Extension MUST handle special characters in service names appropriately
- **FR-013**: Extension MUST limit service name length to prevent abuse
- **FR-014**: Extension MUST provide clear error messages for all failure scenarios
- **FR-015**: Extension MUST support case-insensitive service name matching
- **FR-016**: Extension MUST handle concurrent `cd` commands appropriately

### Key Entities

- **CDCommandHandler**: Processes `cd` commands and manages context switching
- **AIContextManager**: Tracks and manages current AI service context
- **ServiceRegistry**: Maintains list of supported AI services
- **PromptManager**: Updates terminal prompt with current context
- **TabCompletionProvider**: Provides tab completion for service names

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `cd` command processes valid service names successfully in 99% of cases
- **SC-002**: Invalid service names are rejected with appropriate error messages in 100% of cases
- **SC-003**: Terminal prompt updates to reflect current context with AI service name followed by '>' in 99% of cases
- **SC-004**: Tab completion provides accurate service name suggestions in 95% of cases
- **SC-005**: Context switching completes within 5 seconds in 95% of cases
- **SC-006**: Error messages for `cd` command failures are clear and actionable in 100% of cases
- **SC-007**: Last used context is restored on restart in 95% of cases
- **SC-008**: Multiple terminal instances maintain independent contexts in 100% of cases
- **SC-009**: Tab completion does not interfere with normal command execution in 100% of cases
- **SC-010**: Case-insensitive service name matching works correctly in 100% of cases
