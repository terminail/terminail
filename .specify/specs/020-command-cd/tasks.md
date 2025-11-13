---
description: "Task list for CD Command implementation"
---

# Tasks: CD Command

**Input**: Design documents from `/specs/004-cd-command/`
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
- [ ] T006 [P] Implement utility functions for command parsing in src/utils/commandUtils.ts
- [ ] T007 [P] Create base ServiceRegistry in src/serviceRegistry.ts
- [ ] T008 Create base AIContextManager in src/aiContextManager.ts
- [ ] T009 Setup basic configuration management
- [ ] T010 Configure extension manifest (package.json) with required commands

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Switch AI Service Context (Priority: P1) 🎯 MVP

**Goal**: Enable users to switch between different AI chat services using the `cd` command

**Independent Test**: Can be fully tested by switching between AI services and verifying that the MCP server navigates to the correct websites

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Unit test for CD command parsing in tests/unit/cdCommandHandler.test.ts
- [ ] T012 [P] [US1] Unit test for service validation in tests/unit/serviceRegistry.test.ts
- [ ] T013 [P] [US1] Integration test for context switching in tests/integration/contextSwitching.test.ts

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create CDCommandHandler in src/commands/cdCommandHandler.ts
- [ ] T015 [P] [US1] Implement command parsing logic
- [ ] T016 [P] [US1] Implement service name validation
- [ ] T017 [US1] Add MCP server communication for navigation
- [ ] T018 [US1] Add immediate feedback for successful context switches
- [ ] T019 [US1] Add error handling for invalid service names
- [ ] T020 [US1] Integrate CD command with terminal interface

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Command Feedback and Validation (Priority: P1)

**Goal**: Provide immediate feedback when users execute the `cd` command

**Independent Test**: Can be fully tested by executing the `cd` command and verifying appropriate feedback is provided

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T021 [P] [US2] Unit test for feedback generation in tests/unit/cdCommandHandler.test.ts
- [ ] T022 [P] [US2] Integration test for command feedback in tests/integration/cdCommandExecution.test.ts

### Implementation for User Story 2

- [ ] T023 [P] [US2] Implement usage information display
- [ ] T024 [P] [US2] Add detailed error messages for various failure scenarios
- [ ] T025 [US2] Add success confirmation messages
- [ ] T026 [US2] Add timeout handling for context switches
- [ ] T027 [US2] Add network error handling
- [ ] T028 [US2] Add service unavailable error handling

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Tab Completion for AI Services (Priority: P2)

**Goal**: Enable tab completion for AI service names when using the `cd` command

**Independent Test**: Can be tested by pressing tab after typing "cd " and verifying that available AI services are suggested

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T029 [P] [US3] Unit test for tab completion in tests/unit/tabCompletionProvider.test.ts
- [ ] T030 [P] [US3] Integration test for completion functionality in tests/integration/cdCommandExecution.test.ts

### Implementation for User Story 3

- [ ] T031 [P] [US3] Create TabCompletionProvider in src/tabCompletionProvider.ts
- [ ] T032 [P] [US3] Implement service name suggestions
- [ ] T033 [P] [US3] Implement partial name completion
- [ ] T034 [US3] Add case-insensitive completion matching
- [ ] T035 [US3] Add special character handling in completion
- [ ] T036 [US3] Add performance optimization for completion
- [ ] T037 [US3] Integrate tab completion with terminal input handling

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Persistent Context Tracking (Priority: P2)

**Goal**: Track and display current AI service context in the terminal prompt

**Independent Test**: Can be tested by switching contexts and verifying the prompt updates correctly

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [ ] T038 [P] [US4] Unit test for context persistence in tests/unit/aiContextManager.test.ts
- [ ] T039 [P] [US4] Integration test for prompt updates in tests/integration/contextSwitching.test.ts

### Implementation for User Story 4

- [ ] T040 [P] [US4] Implement PromptManager in src/promptManager.ts
- [ ] T041 [P] [US4] Add terminal prompt updates with current context
- [ ] T042 [P] [US4] Add last used context restoration on restart
- [ ] T043 [US4] Add independent context for multiple terminal instances
- [ ] T044 [US4] Add context persistence in `.terminail` directory
- [ ] T045 [US4] Add context validation on load
- [ ] T046 [US4] Add context cleanup on extension shutdown

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Additional Features

**Purpose**: Implement additional features that enhance the user experience

- [ ] T047 [P] Implement case-insensitive service name matching
- [ ] T048 [P] Add service name length limiting
- [ ] T049 [P] Add special character handling in service names
- [ ] T050 Add concurrent command handling
- [ ] T051 Add dynamic service registration
- [ ] T052 Add service metadata storage
- [ ] T053 Add service availability checking

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T054 [P] Documentation updates in docs/
- [ ] T055 Code cleanup and refactoring
- [ ] T056 Performance optimization across all stories
- [ ] T057 [P] Additional unit tests (if requested) in tests/unit/
- [ ] T058 Security hardening
- [ ] T059 Run quickstart.md validation

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
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable

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
Task: "Unit test for CD command parsing in tests/unit/cdCommandHandler.test.ts"
Task: "Unit test for service validation in tests/unit/serviceRegistry.test.ts"
Task: "Integration test for context switching in tests/integration/contextSwitching.test.ts"

# Launch all components for User Story 1 together:
Task: "Create CDCommandHandler in src/commands/cdCommandHandler.ts"
Task: "Implement command parsing logic"
Task: "Implement service name validation"
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
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Additional developers work on User Story 4 and additional features
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