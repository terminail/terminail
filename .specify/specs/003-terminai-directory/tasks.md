---
description: "Task list for TerminAI Configuration Directory implementation"
---

# Tasks: TerminAI Configuration Directory

**Input**: Design documents from `/specs/003-terminai-directory/`
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
- [ ] T006 [P] Implement utility functions for path handling in src/utils/pathUtils.ts
- [ ] T007 [P] Implement utility functions for file operations in src/utils/fileUtils.ts
- [ ] T008 Create base TerminAIDirectoryManager in src/terminaiDirectoryManager.ts
- [ ] T009 Setup basic configuration management in src/configurationManager.ts
- [ ] T010 Configure extension manifest (package.json) with required permissions

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Automatic Directory Creation (Priority: P1) 🎯 MVP

**Goal**: Provide automatic creation of `.terminai` directory in VS Code workspace root

**Independent Test**: Can be tested by opening the TerminAI extension in a workspace and verifying that the `.terminai` directory is created automatically

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Unit test for directory creation in tests/unit/terminaiDirectoryManager.test.ts
- [ ] T012 [P] [US1] Unit test for existing directory handling in tests/unit/terminaiDirectoryManager.test.ts
- [ ] T013 [P] [US1] Integration test for directory initialization in tests/integration/directoryInitialization.test.ts

### Implementation for User Story 1

- [ ] T014 [P] [US1] Implement directory creation logic in TerminAIDirectoryManager
- [ ] T015 [P] [US1] Implement permission verification in TerminAIDirectoryManager
- [ ] T016 [P] [US1] Implement existing directory detection in TerminAIDirectoryManager
- [ ] T017 [US1] Add error handling for directory creation failures
- [ ] T018 [US1] Add logging for directory operations
- [ ] T019 [US1] Integrate directory manager with extension initialization
- [ ] T020 [US1] Add user guidance for permission errors

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Configuration Storage (Priority: P1)

**Goal**: Enable storage and retrieval of configuration settings in `.terminai/config.json`

**Independent Test**: Can be fully tested by changing configuration settings and verifying they are saved to and loaded from the `.terminai` directory

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T021 [P] [US2] Unit test for configuration saving in tests/unit/configurationManager.test.ts
- [ ] T022 [P] [US2] Unit test for configuration loading in tests/unit/configurationManager.test.ts
- [ ] T023 [P] [US2] Integration test for configuration persistence in tests/integration/dataPersistence.test.ts

### Implementation for User Story 2

- [ ] T024 [P] [US2] Implement configuration file structure in src/configurationManager.ts
- [ ] T025 [P] [US2] Implement configuration saving logic
- [ ] T026 [P] [US2] Implement configuration loading logic
- [ ] T027 [US2] Add configuration validation on load
- [ ] T028 [US2] Add default configuration values
- [ ] T029 [US2] Add error handling for corrupted configuration files
- [ ] T030 [US2] Integrate configuration manager with directory manager

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Command History Storage (Priority: P2)

**Goal**: Enable storage and retrieval of command history in `.terminai/history.json`

**Independent Test**: Can be tested by executing commands and verifying they are saved to and loaded from the `.terminai` directory

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T031 [P] [US3] Unit test for history saving in tests/unit/historyManager.test.ts
- [ ] T032 [P] [US3] Unit test for history loading in tests/unit/historyManager.test.ts
- [ ] T033 [P] [US3] Integration test for history persistence in tests/integration/dataPersistence.test.ts

### Implementation for User Story 3

- [ ] T034 [P] [US3] Create HistoryManager in src/historyManager.ts
- [ ] T035 [P] [US3] Implement history file structure
- [ ] T036 [P] [US3] Implement history saving logic
- [ ] T037 [US3] Implement history loading logic
- [ ] T038 [US3] Add history file size limiting
- [ ] T039 [US3] Add error handling for corrupted history files
- [ ] T040 [US3] Integrate history manager with directory manager

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Created File Tracking (Priority: P2)

**Goal**: Enable tracking of files created through TerminAI commands in `.terminai/created-files.json`

**Independent Test**: Can be tested by creating files through TerminAI commands and verifying the file information is tracked

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [ ] T041 [P] [US4] Unit test for file tracking in tests/unit/fileManager.test.ts
- [ ] T042 [P] [US4] Integration test for file tracking in tests/integration/dataPersistence.test.ts

### Implementation for User Story 4

- [ ] T043 [P] [US4] Create FileManager in src/fileManager.ts
- [ ] T044 [P] [US4] Implement file tracking data structure
- [ ] T045 [P] [US4] Implement file tracking update logic
- [ ] T046 [US4] Implement file tracking query logic
- [ ] T047 [US4] Add handling for deleted tracked files
- [ ] T048 [US4] Add error handling for file tracking issues
- [ ] T049 [US4] Integrate file manager with directory manager

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: User Story 5 - Cross-Platform Directory Handling (Priority: P1)

**Goal**: Ensure consistent handling of `.terminai` directory across Windows, macOS, and Linux

**Independent Test**: Can be tested by running the extension on different operating systems and verifying consistent directory handling

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

- [ ] T050 [P] [US5] Unit test for Windows path handling in tests/unit/terminaiDirectoryManager.test.ts
- [ ] T051 [P] [US5] Unit test for macOS path handling in tests/unit/terminaiDirectoryManager.test.ts
- [ ] T052 [P] [US5] Unit test for Linux path handling in tests/unit/terminaiDirectoryManager.test.ts

### Implementation for User Story 5

- [ ] T053 [US5] Add Windows-specific directory handling
- [ ] T054 [US5] Add macOS-specific directory handling
- [ ] T055 [US5] Add Linux-specific directory handling
- [ ] T056 [US5] Add platform-specific file permissions
- [ ] T057 [US5] Add platform-specific error handling
- [ ] T058 [US5] Add cross-platform testing support

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Additional Features

**Purpose**: Implement additional features that enhance the user experience

- [ ] T059 [P] Implement configuration backup functionality
- [ ] T060 [P] Add configuration migration between versions
- [ ] T061 [P] Add history file rotation
- [ ] T062 Add directory cleanup on extension shutdown
- [ ] T063 Add temporary file management
- [ ] T064 Add concurrent access handling for configuration files

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T065 [P] Documentation updates in docs/
- [ ] T066 Code cleanup and refactoring
- [ ] T067 Performance optimization across all stories
- [ ] T068 [P] Additional unit tests (if requested) in tests/unit/
- [ ] T069 Security hardening
- [ ] T070 Run quickstart.md validation

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
- **User Story 5 (P1)**: Can start after Foundational (Phase 2) - May integrate with all other stories but should be independently testable

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
Task: "Unit test for directory creation in tests/unit/terminaiDirectoryManager.test.ts"
Task: "Unit test for existing directory handling in tests/unit/terminaiDirectoryManager.test.ts"
Task: "Integration test for directory initialization in tests/integration/directoryInitialization.test.ts"

# Launch all components for User Story 1 together:
Task: "Implement directory creation logic in TerminAIDirectoryManager"
Task: "Implement permission verification in TerminAIDirectoryManager"
Task: "Implement existing directory detection in TerminAIDirectoryManager"
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
4. Add User Story 5 → Test independently → Deploy/Demo
5. Add User Stories 3, 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 5
3. Additional developers work on User Stories 3, 4 and additional features
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