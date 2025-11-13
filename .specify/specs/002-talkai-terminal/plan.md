# Implementation Plan: Terminail Terminal

**Branch**: `002-terminail-terminal` | **Date**: 2025-11-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-terminail-terminal/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature implements a terminal-like VS Code extension that allows users to interact with multiple AI chat services through natural language commands. The extension uses a Podman container running a Playwright MCP server to automate browser interactions with pre-logged-in AI websites. Users can switch between services (cd command), list available services (ls command), and send questions to AI services (qi command) with responses displayed directly in the terminal.

Technical approach:
1. VS Code extension with webview-based terminal interface
2. Podman container management for MCP server deployment
3. Browser automation via Playwright and Chrome DevTools Protocol (CDP)
4. Real-time communication between extension and MCP server

## Technical Context

**Language/Version**: TypeScript (Node.js 18+)  
**Primary Dependencies**: VS Code Extension API, Playwright, Express.js, Podman CLI  
**Storage**: N/A (stateless terminal interface)  
**Testing**: Mocha/Chai for unit tests, manual testing for integration  
**Target Platform**: VS Code extension running on Windows, macOS, and Linux  
**Project Type**: Single project (VS Code extension)  
**Performance Goals**: Terminal response time < 2 seconds, AI response time < 30 seconds  
**Constraints**: Requires Podman installation, Chrome/Chromium browser, internet connection  
**Scale/Scope**: Single user, single terminal instance per VS Code window

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the project constitution, this feature complies with all guidelines:
- Uses TypeScript as primary language
- Follows VS Code extension development patterns
- Maintains security by running browser automation in isolated container
- Preserves user privacy by keeping data within local environment
- Follows established testing practices

## Project Structure

### Documentation (this feature)

```text
specs/002-terminail-terminal/
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
├── terminailTerminal.ts    # Main terminal interface component
├── podmanManager.ts     # Podman container management
├── browserManager.ts    # Browser launch and connection management
├── mcpClient.ts         # Communication with MCP server
├── aiServiceManager.ts  # AI service context management
├── stateManager.ts      # Extension state tracking
└── utils/               # Utility functions
    ├── portUtils.ts     # Port detection and management
    └── platformUtils.ts # Cross-platform utilities

tests/
├── unit/                # Unit tests for individual components
│   ├── terminailTerminal.test.ts
│   ├── podmanManager.test.ts
│   ├── browserManager.test.ts
│   ├── mcpClient.test.ts
│   ├── aiServiceManager.test.ts
│   └── stateManager.test.ts
└── integration/         # Integration tests for complete workflows
    ├── terminalInitialization.test.ts
    ├── aiInteraction.test.ts
    └── errorHandling.test.ts
```

**Structure Decision**: Single project structure as this is a VS Code extension with integrated components. The modular approach separates concerns while maintaining simplicity.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations identified. The feature follows established patterns for VS Code extensions and maintains security through containerization.