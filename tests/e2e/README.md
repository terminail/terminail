# Terminail E2E Testing Framework

This directory contains the End-to-End (E2E) testing framework for the Terminail VS Code extension.

## Overview

The E2E testing framework provides comprehensive testing for:
- Terminal command execution (cd, ls, qi)
- Extension activation and command registration
- Integration with real MCP server
- Performance and reliability testing

## Test Structure

```
tests/e2e/
├── config/           # Test configuration files
├── helpers/         # Test utilities
├── specs/           # Test specifications
├── suite/           # VS Code test suite
└── runTest.js       # Main test runner
```

## Test Files

### Core Test Files
- `terminailCommands.test.js` - Tests for terminal commands (cd, ls, qi)
- `extension.test.js` - Extension activation and command tests
- `verifyCommands.test.js` - Command consistency verification

### Helper Files
- `testRunner.js` - Main test runner utility
- `setup.js` - Test environment setup
- `testConfig.js` - Test configuration

## Running Tests

### Individual Test Types
```bash
# Run all E2E tests
npm run test:e2e

# Run terminal command tests only
npm run test:e2e:terminal

# Run with UI reporter
npm run test:e2e:ui
```

### Full Test Suite
```bash
# Run complete E2E test suite
node tests/e2e/runTest.js
```

## Test Configuration

Configuration is managed in `tests/e2e/config/testConfig.js`:
- VS Code environment settings
- Mock server configuration
- Test data and expected outputs
- Performance thresholds
- CI/CD settings

## Real MCP Server Integration

The E2E tests now use the real MCP server with endpoints:
- `/health` - Health status check
- `/ais` - Available AI services
- `/switch` - AI service switching
- `/ask` - Question processing

## Test Coverage

### Terminal Commands
- Basic functionality (cd, ls, qi)
- Navigation commands
- File operations
- Complex command sequences
- Error handling
- Performance testing

### Real End-to-End Tests
- Terminal command execution with real VS Code environment
- Extension activation and command registration
- Performance and reliability testing

## CI/CD Integration

Tests are automatically run via GitHub Actions:
- On push to main/develop branches
- On pull requests
- Weekly scheduled runs
- Security scanning
- Performance testing

## Test Results

Results are available in:
- Console output during test execution
- HTML reports in `tests/e2e/reports/`
- CI/CD artifact uploads

## Troubleshooting

### Common Issues

1. **Extension not active** - Ensure VS Code is running with Terminail extension installed
2. **Module not found** - Check import paths in test files
3. **Timeout errors** - Increase timeout in test configuration

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=true npm run test:e2e:terminal
```

## Development

When adding new tests:
1. Follow existing patterns in test files
2. Update test configuration if needed
3. Test with real VS Code environment
4. Update this README with new functionality

## Dependencies

- Mocha - Test framework
- Chai - Assertion library
- Playwright - UI testing (optional)

## Contributing

Please ensure all new tests:
- Follow the established patterns
- Include proper error handling
- Have appropriate timeout settings
- Are documented in this README