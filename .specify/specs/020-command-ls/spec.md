# Feature Specification: LS Command

**Feature Branch**: `020-command-ls`  
**Created**: 2025-11-11  
**Status**: Draft  
**Input**: User description: "The 'ls' command allows users to list available AI chat services, similar to the Unix/Linux 'ls' (list) command but adapted for displaying supported AI services."
**Parent Feature**: [020-command](../020-command/spec.md)

## Implementation Summary

This feature implements the `ls` command for the Terminail terminal interface, allowing users to list available AI chat services. The command follows the familiar Unix/Linux `ls` (list) convention but adapts it for displaying supported AI services. When a user executes `ls`, the Terminail extension retrieves the list of supported AI services from the service registry and displays them in a clear, organized format in the terminal.

The implementation involves parsing the `ls` command in the terminal interface, retrieving the list of supported services, and formatting the output for display. The command provides immediate feedback to the user about available AI services, helping them discover and select services for interaction.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - List Available AI Services (Priority: P1)

As a developer exploring AI services, I want to use the `ls` command to see a list of supported AI chat websites so that I know which services I can interact with.

**Why this priority**: This is core functionality for service discovery.

**Independent Test**: Can be fully tested by running the `ls` command and verifying the output shows supported AI services.

**Acceptance Scenarios**:

1. **Given** a user with a ready Terminail terminal, **When** they type "ls", **Then** the terminal should display a list of supported AI services (deepseek, qwen, doubao).
2. **Given** a user with a ready Terminail terminal, **When** they type "ls" after adding new AI services, **Then** the terminal should show the updated list including new services.
3. **Given** a user with no configured AI services, **When** they type "ls", **Then** the terminal should display an appropriate message indicating no services are available.

### User Story 2 - Command Feedback and Formatting (Priority: P1)

As a developer using Terminail, I want the `ls` command output to be well-formatted and informative so that I can easily understand the available services.

**Why this priority**: This is essential for providing a user-friendly experience.

**Independent Test**: Can be fully tested by executing the `ls` command and verifying the output format and information.

**Acceptance Scenarios**:

1. **Given** a user executing the `ls` command, **When** services are available, **Then** the terminal should display them in a clear, organized format.
2. **Given** a user executing the `ls` command, **When** no services are available, **Then** the terminal should display a helpful message.
3. **Given** a user executing the `ls` command, **When** services have additional metadata, **Then** the terminal should display relevant information.

### User Story 3 - Service Details Display (Priority: P2)

As a developer using Terminail, I want the `ls` command to optionally show detailed information about AI services so that I can make informed decisions about which service to use.

**Why this priority**: This enhances usability by providing more information about services.

**Independent Test**: Can be tested by using the `ls` command with options and verifying detailed information is displayed.

**Acceptance Scenarios**:

1. **Given** a user executing "ls -l", **When** the command processes, **Then** the terminal should display detailed information about each service.
2. **Given** a user executing "ls --help", **When** the command processes, **Then** the terminal should display usage information for the `ls` command.
3. **Given** a user executing "ls" with an invalid option, **When** the command processes, **Then** the terminal should display an appropriate error message.

### User Story 4 - Dynamic Service Listing (Priority: P2)

As a developer using Terminail, I want the `ls` command to reflect dynamically added or removed services so that I always see the current list of available services.

**Why this priority**: This ensures the command stays current with service configuration changes.

**Independent Test**: Can be tested by adding/removing services and verifying the `ls` command reflects changes.

**Acceptance Scenarios**:

1. **Given** a user adding a new AI service, **When** they execute "ls", **Then** the new service should appear in the list.
2. **Given** a user removing an AI service, **When** they execute "ls", **Then** the removed service should no longer appear in the list.
3. **Given** a user with services that become temporarily unavailable, **When** they execute "ls", **Then** the terminal should indicate the availability status.

### Edge Cases

- What happens when the service registry is corrupted or unavailable?
- How does the system handle very large numbers of services?
- What happens when services have duplicate names?
- How does the system handle services with special characters in names?
- What happens when the terminal width is too narrow for the formatted output?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Extension MUST support `ls` command syntax
- **FR-002**: Extension MUST retrieve list of supported AI services from service registry
- **FR-003**: Extension MUST display services in a clear, organized format
- **FR-004**: Extension MUST handle case when no services are available
- **FR-005**: Extension MUST support `ls -l` for detailed service information
- **FR-006**: Extension MUST support `ls --help` for usage information
- **FR-007**: Extension MUST handle invalid command options gracefully
- **FR-008**: Extension MUST update display when services are added/removed
- **FR-009**: Extension MUST indicate service availability status
- **FR-010**: Extension MUST handle service registry errors gracefully
- **FR-011**: Extension MUST limit output width to terminal dimensions
- **FR-012**: Extension MUST handle duplicate service names appropriately
- **FR-013**: Extension MUST handle special characters in service names
- **FR-014**: Extension MUST provide clear error messages for all failure scenarios
- **FR-015**: Extension MUST support case-insensitive option matching
- **FR-016**: Extension MUST handle concurrent `ls` commands appropriately

### Key Entities

- **LSCommandHandler**: Processes `ls` commands and manages service listing
- **ServiceListFormatter**: Formats service list output for display
- **ServiceDetailsProvider**: Provides detailed information about services
- **HelpProvider**: Provides usage information for the `ls` command

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `ls` command displays available services successfully in 99% of cases
- **SC-002**: No services available scenario is handled with appropriate message in 100% of cases
- **SC-003**: Service list is formatted clearly and readably in 95% of cases
- **SC-004**: Detailed service information is displayed correctly with `ls -l` in 95% of cases
- **SC-005**: Usage information is provided with `ls --help` in 100% of cases
- **SC-006**: Invalid options are handled with appropriate error messages in 100% of cases
- **SC-007**: Dynamic service changes are reflected in output in 99% of cases
- **SC-008**: Service registry errors are handled gracefully in 95% of cases
- **SC-009**: Output is formatted appropriately for terminal dimensions in 100% of cases
- **SC-010**: Concurrent `ls` commands are handled without interference in 100% of cases