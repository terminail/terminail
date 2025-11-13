# Terminail Extension Tests

This directory contains the test suite for the Terminail VS Code extension, organized into three main categories following industry best practices:

## Test Categories

### 1. Unit Tests (`tests/unit/`)
Unit tests focus on individual components in isolation. These tests verify that each class and function behaves correctly with mocked dependencies.

**Key components tested:**
- `TerminailManager` - Core extension manager
- `ConfigurationManager` - Configuration management logic
- `PodmanManager` - Podman container management
- `AIService` - AI service integration
- `Extension commands` - Command registration and handling

### 2. Integration Tests (`tests/integration/`)
Integration tests verify that multiple components work together correctly. These tests often involve real VS Code API interactions with mocked external dependencies.

**Key integrations tested:**
- Extension activation and initialization
- Configuration management with VS Code settings
- Component-to-component communication
- VS Code API integration

### 3. End-to-End Tests (`tests/e2e/`)
End-to-end tests validate complete user workflows and scenarios in a near-production environment.

**Key scenarios tested:**
- Extension installation and activation
- Command execution workflows
- Complete functionality verification

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### E2E Tests Only
```bash
npm run test:e2e
```

## Test Structure

Each test file follows the naming convention `*.test.ts` or `*.test.js` and includes:

1. **Setup**: Mocking dependencies and creating test contexts
2. **Test Cases**: Specific scenarios with expected outcomes
3. **Teardown**: Cleanup of test resources

## Mocking Strategy

We use Jest's mocking capabilities to isolate components:
- VS Code API is mocked using `jest.mock('vscode', ...)` 
- File system operations are mocked when appropriate
- Network requests are mocked to avoid external dependencies

## Test Coverage

The test suite aims to provide comprehensive coverage of:
- Core functionality and business logic
- Error handling and edge cases
- Integration points with VS Code APIs
- Configuration and user interaction flows