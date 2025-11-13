# Implementation Plan: CD Command

**Branch**: `020-command-cd` | **Date**: 2025-11-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/020-command-cd/spec.md`
**Parent Feature**: [020-command](../020-command/spec.md)

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature implements the `cd` command for the TerminAI terminal interface, allowing users to switch between different AI chat services. The command follows the familiar Unix/Linux `cd` (change directory) convention but adapts it for AI service context switching. When a user executes `cd <ai_service>`, the TerminAI extension communicates with the Playwright MCP server running in a Podman container to navigate the browser to the appropriate AI chat website.

The implementation involves parsing the `cd` command in the terminal interface, validating the requested AI service, and sending the appropriate navigation command to the MCP server. The command provides immediate feedback to the user about the success or failure of the context switch operation.

## Technical Context

**Language/Version**: TypeScript (Node.js 18+)  
**Primary Dependencies**: VS Code Extension API, TerminAI Terminal components, MCP Client  
**Storage**: In-memory context tracking, configuration files in `.terminai` directory  
**Testing**: Mocha/Chai for unit tests, manual testing for integration  
**Target Platform**: VS Code extension running on Windows, macOS, and Linux  
**Project Type**: Single project (VS Code extension)  
**Performance Goals**: Command processing < 100ms, context switch < 5 seconds  
**Constraints**: Requires active MCP server connection, valid AI service configuration  
**Scale/Scope**: Single user, single command execution at a time

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the project constitution, this feature complies with all guidelines:
- Uses TypeScript as primary language
- Follows VS Code extension development patterns
- Integrates with existing TerminAI terminal architecture
- Maintains security through containerized MCP server communication
- Follows established testing practices

## Project Structure

### Documentation (this feature)

```text
specs/020-command-cd/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── extension.ts         # Extension entry point
├── commands/            # Command implementations
│   └── cdCommandHandler.ts  # CD command implementation
├── aiContextManager.ts  # AI service context management
├── serviceRegistry.ts   # Supported AI services registry
├── promptManager.ts     # Terminal prompt management
├── tabCompletionProvider.ts  # Tab completion for service names
└── utils/               # Utility functions
    └── commandUtils.ts  # Command parsing utilities

tests/
├── unit/                # Unit tests for individual components
│   ├── cdCommandHandler.test.ts
│   ├── aiContextManager.test.ts
│   ├── serviceRegistry.test.ts
│   └── tabCompletionProvider.test.ts
└── integration/         # Integration tests for complete workflows
    ├── cdCommandExecution.test.ts
    └── contextSwitching.test.ts
```

**Structure Decision**: Single project structure as this is a VS Code extension with integrated components. The command implementation is organized in a dedicated commands directory to separate command logic from core terminal functionality.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations identified. The feature follows established patterns for VS Code extensions and integrates properly with the existing TerminAI terminal architecture.