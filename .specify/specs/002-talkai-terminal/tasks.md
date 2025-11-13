---
description: "Task list for Terminail Terminal implementation"
---

# Tasks: Terminail Terminal

**Input**: Design documents from `/specs/002-terminail-terminal/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize TypeScript project with VS Code extension dependencies
- [ ] T003 [P] Configure linting and formatting tools
- [ ] T004 [P] Set up testing framework (Mocha/Chai)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Setup VS Code extension entry point in src/extension.ts
- [ ] T006 [P] Implement utility functions for port management in src/utils/portUtils.ts
- [ ] T007 [P] Implement cross-platform utilities in src/utils/platformUtils.ts
- [ ] T008 Create base StateManager in src/stateManager.ts
- [ ] T009 Setup basic configuration management
- [ ] T010 Configure extension manifest (package.json) with required commands

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Initialize Terminail Terminal Environment (Priority: P1) 🎯 MVP

**Goal**: Provide terminal interface that automatically sets up Podman container and guides browser setup

**Independent Test**: Can be tested by installing the extension and verifying that the terminal initializes the Podman container and guides browser setup automatically

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Unit test for PodmanManager container startup in tests/unit/podmanManager.test.ts
- [ ] T012 [P] [US1] Unit test for BrowserManager browser launch in tests/unit/browserManager.test.ts
- [ ] T013 [P] [US1] Integration test for terminal initialization in tests/integration/terminalInitialization.test.ts

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create PodmanManager in src/podmanManager.ts
- [ ] T015 [P] [US1] Create BrowserManager in src/browserManager.ts
- [ ] T016 [P] [US1] Create MCPClient in src/mcpClient.ts
- [ ] T017 [US1] Implement TerminailTerminal in src/terminailTerminal.ts (depends on T014, T015, T016)
- [ ] T018 [US1] Implement terminal webview UI with basic prompt and output display
- [ ] T019 [US1] Add Podman container startup logic to PodmanManager
- [ ] T020 [US1] Add browser launch with debug port logic to BrowserManager
- [ ] T021 [US1] Add MCP server connection logic to MCPClient
- [ ] T022 [US1] Add terminal initialization workflow in TerminailTerminal
- [ ] T023 [US1] Add user guidance for browser setup in terminal interface
- [ ] T024 [US1] Add error handling for container and browser startup failures
- [ ] T025 [US1] Add logging for initialization operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Switch Between AI Services (Priority: P1)

**Goal**: Enable users to switch between different AI chat websites using the 'cd' command

**Independent Test**: Can be tested by switching between AI services and verifying that the MCP server navigates to the correct websites

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T026 [P] [US2] Unit test for AIServiceManager service switching in tests/unit/aiServiceManager.test.ts
- [ ] T027 [P] [US2] Integration test for 'cd' command in tests/integration/aiInteraction.test.ts

### Implementation for User Story 2

- [ ] T028 [P] [US2] Create AIServiceManager in src/aiServiceManager.ts
- [ ] T029 [US2] Implement AI service registry with DeepSeek, Qwen, Doubao
- [ ] T030 [US2] Add 'cd' command parsing to TerminailTerminal
- [ ] T031 [US2] Add service switching logic to AIServiceManager
- [ ] T032 [US2] Add MCP server command for service switching
- [ ] T033 [US2] Update terminal prompt with current AI service context
- [ ] T034 [US2] Add validation for valid AI service names
- [ ] T035 [US2] Add error handling for service switching failures

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - List Available AI Services (Priority: P2)

**Goal**: Enable users to see a list of supported AI chat websites using the 'ls' command

**Independent Test**: Can be tested by running the 'ls' command and verifying the output shows supported AI services

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T036 [P] [US3] Unit test for AIServiceManager service listing in tests/unit/aiServiceManager.test.ts
- [ ] T037 [P] [US3] Integration test for 'ls' command in tests/integration/aiInteraction.test.ts

### Implementation for User Story 3

- [ ] T038 [US3] Add 'ls' command parsing to TerminailTerminal
- [ ] T039 [US3] Add service listing logic to AIServiceManager
- [ ] T040 [US3] Add MCP server command for service listing
- [ ] T041 [US3] Add output formatting for service list
- [ ] T042 [US3] Add error handling for service listing failures

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Send Questions to AI Services (Priority: P1)

**Goal**: Enable users to send questions to the current AI service using the 'qi' command and receive responses in the terminal

**Independent Test**: Can be tested by sending questions and verifying that responses are received and displayed in the terminal

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [ ] T043 [P] [US4] Unit test for question sending in tests/unit/terminailTerminal.test.ts
- [ ] T044 [P] [US4] Integration test for 'qi' command in tests/integration/aiInteraction.test.ts

### Implementation for User Story 4

- [ ] T045 [US4] Add 'qi' command parsing to TerminailTerminal
- [ ] T046 [US4] Add question sending logic to MCPClient
- [ ] T047 [US4] Add MCP server endpoint for question processing
- [ ] T048 [US4] Add real-time response streaming display
- [ ] T049 [US4] Add timeout handling for long-running AI operations
- [ ] T050 [US4] Add error handling for question sending failures
- [ ] T051 [US4] Add response formatting for terminal display

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: User Story 5 - Handle Browser Disconnection (Priority: P2)

**Goal**: Automatically detect browser disconnection and guide user to reconnect

**Independent Test**: Can be tested by stopping and restarting the browser with debug port

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

- [ ] T052 [P] [US5] Unit test for browser disconnection handling in tests/unit/browserManager.test.ts
- [ ] T053 [P] [US5] Integration test for disconnection recovery in tests/integration/errorHandling.test.ts

### Implementation for User Story 5

- [ ] T054 [US5] Add browser connection monitoring to BrowserManager
- [ ] T055 [US5] Add disconnection detection logic
- [ ] T056 [US5] Add user guidance for browser reconnection
- [ ] T057 [US5] Add automatic reconnection logic
- [ ] T058 [US5] Add error handling for reconnection failures
- [ ] T059 [US5] Add status indicators for connection state

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: User Story 6 - Handle Podman Container Issues (Priority: P2)

**Goal**: Automatically detect Podman container issues and guide user to resolve

**Independent Test**: Can be tested by stopping and restarting the Podman container

### Tests for User Story 6 (OPTIONAL - only if tests requested) ⚠️

- [ ] T060 [P] [US6] Unit test for container issue handling in tests/unit/podmanManager.test.ts
- [ ] T061 [P] [US6] Integration test for container recovery in tests/integration/errorHandling.test.ts

### Implementation for User Story 6

- [ ] T062 [US6] Add container health monitoring to PodmanManager
- [ ] T063 [US6] Add container issue detection logic
- [ ] T064 [US6] Add user guidance for container recovery
- [ ] T065 [US6] Add automatic container restart logic
- [ ] T066 [US6] Add error handling for restart failures
- [ ] T067 [US6] Add status indicators for container state

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Additional Features

**Purpose**: Implement additional features that enhance the user experience

- [ ] T068 [P] Implement 'help' command with command documentation
- [ ] T069 [P] Implement 'status' command with system state information
- [ ] T070 [P] Add cross-platform browser launch support
- [ ] T071 Add resource cleanup on extension shutdown
- [ ] T072 Add persistent state management between sessions
- [ ] T073 Add configuration options for user preferences

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T074 [P] Documentation updates in docs/
- [ ] T075 Code cleanup and refactoring
- [ ] T076 Performance optimization across all stories
- [ ] T077 [P] Additional unit tests (if requested) in tests/unit/
- [ ] T078 Security hardening
- [ ] T079 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US4 but should be independently testable
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Core components before integration
- Implementation before error handling
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Unit test for PodmanManager container startup in tests/unit/podmanManager.test.ts"
Task: "Unit test for BrowserManager browser launch in tests/unit/browserManager.test.ts"
Task: "Integration test for terminal initialization in tests/integration/terminalInitialization.test.ts"

# Launch all components for User Story 1 together:
Task: "Create PodmanManager in src/podmanManager.ts"
Task: "Create BrowserManager in src/browserManager.ts"
Task: "Create MCPClient in src/mcpClient.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 4 → Test independently → Deploy/Demo
5. Add User Stories 3, 5, 6 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 4
3. Additional developers work on User Stories 3, 5, 6 and additional features
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence