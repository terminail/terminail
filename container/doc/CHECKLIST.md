# TerminAI MCP Server Container Checklist

This checklist is based on the TerminAI project structure and requirements for the MCP server container implementation.

## Project Structure

- [ ] Follow the recommended project structure:
  ```
  container/
  ├── mcp_server/
  │   ├── __init__.py          # Python package initialization
  │   ├── main.py              # FastAPI web server and entry point
  │   ├── browser.py           # Browser automation with Playwright
  │   └── utils.py             # Utility functions
  ├── tests/
  │   ├── unit/                # Unit tests for individual components
  │   ├── integration/         # Integration tests for component interactions
  │   ├── e2e/                 # End-to-end tests for complete workflows
  │   └── conftest.py          # Test configuration and fixtures
  ├── Containerfile            # Podman/Docker container definition
  ├── config.yaml              # Container configuration file
  ├── pyproject.toml           # Python project dependencies
  └── README.md                # Container documentation
  ```
- [ ] File and folder names should reflect business intention and be descriptive
- [ ] Related code files should be placed under the same folder

## MCP Server Implementation

- [ ] Implement FastAPI web server in `main.py` that:
  - [ ] Provides health check endpoint at `/health`
  - [ ] Implements browser initialization endpoint at `/init`
  - [ ] Implements AI service listing endpoint at `/ais`
  - [ ] Implements AI service switching endpoint at `/switch`
  - [ ] Implements question asking endpoint at `/ask`
  - [ ] Configures proper CORS middleware
  - [ ] Implements application lifecycle management with lifespan context
  - [ ] Uses proper logging configuration
  - [ ] Handles errors gracefully with appropriate HTTP status codes

## Browser Automation Implementation

- [ ] Implement `BrowserManager` class in `browser.py` that:
  - [ ] Connects to host browser via Chrome DevTools Protocol (CDP)
  - [ ] Manages browser lifecycle (connect, close)
  - [ ] Implements `ask_ai()` method for sending questions to AI services
  - [ ] Implements `switch_ai()` method for navigating to different AI services
  - [ ] Loads AI service URLs from configuration
  - [ ] Uses proper selectors for input fields and send buttons
  - [ ] Implements proper waiting mechanisms for responses
  - [ ] Handles browser disconnection gracefully

## Configuration Management

- [ ] Implement proper configuration loading in `utils.py`:
  - [ ] Load AI service configurations from `config.yaml`
  - [ ] Provide default values for all configuration options
  - [ ] Handle missing or malformed configuration files gracefully
  - [ ] Support both domestic and international AI services
  - [ ] Maintain proper sequence ordering of AI services

## Container Definition

- [ ] Implement `Containerfile` that:
  - [ ] Uses appropriate base image (Python slim)
  - [ ] Sets proper environment variables
  - [ ] Installs system dependencies required for Playwright
  - [ ] Copies and installs Python dependencies from `pyproject.toml`
  - [ ] Installs Playwright dependencies (not browsers)
  - [ ] Exposes proper port (3000)
  - [ ] Implements health check
  - [ ] Runs as non-root user for security
  - [ ] Uses proper CMD to start the server

## Python Project Configuration

- [ ] Implement `pyproject.toml` that:
  - [ ] Defines proper project metadata
  - [ ] Lists all required dependencies (fastapi, uvicorn, playwright, pyyaml)
  - [ ] Defines entry point for the application
  - [ ] Specifies proper Python version compatibility

## Configuration File

- [ ] Implement `config.yaml` that:
  - [ ] Defines server configuration (host, port, debug)
  - [ ] Defines browser configuration (debug port, timeouts)
  - [ ] Lists all supported AI services with proper metadata
  - [ ] Maintains proper sequence ordering
  - [ ] References main extension configuration for AI services
  - [ ] Defines logging configuration

## Testing Requirements

- [ ] Unit tests for every feature and update:
  - [ ] Test FastAPI endpoints in `main.py`
  - [ ] Test browser automation logic in `browser.py`
  - [ ] Test configuration loading in `utils.py`
  - [ ] Test error handling for all components
- [ ] Integration tests for component interactions:
  - [ ] Test browser connection and disconnection
  - [ ] Test AI service switching functionality
  - [ ] Test question asking workflow
  - [ ] Test configuration loading and parsing
- [ ] End-to-end tests for complete workflows:
  - [ ] Test complete server lifecycle (start, health check, stop)
  - [ ] Test browser automation from connection to response
  - [ ] Test all API endpoints in sequence
  - [ ] Test error scenarios and recovery

## Performance Considerations

- [ ] Minimize resource usage in browser automation
- [ ] Implement proper timeout handling
- [ ] Use efficient selectors for element finding
- [ ] Proper resource cleanup when browser is closed
- [ ] Handle long-running operations gracefully

## Security Considerations

- [ ] Run container as non-root user
- [ ] Expose only necessary ports
- [ ] Use official base images
- [ ] Keep dependencies up to date
- [ ] Validate input parameters
- [ ] Handle sensitive data appropriately

## Maintainability

- [ ] Separate concerns between web server, browser automation, and utilities
- [ ] Use clear, descriptive names for components and methods
- [ ] Document complex automation logic
- [ ] Keep configuration separate from code
- [ ] Implement proper logging for debugging

## Integration Testing

- [ ] Test container build process:
  - [ ] Verify Containerfile builds without errors
  - [ ] Verify all dependencies install correctly
  - [ ] Verify container starts correctly
  - [ ] Verify health check endpoint works
- [ ] Test browser automation:
  - [ ] Verify connection to host browser
  - [ ] Test navigation to AI services
  - [ ] Test question input and response extraction
  - [ ] Test switching between different AI services
- [ ] Test API endpoints:
  - [ ] Verify all endpoints return correct responses
  - [ ] Test error cases and edge conditions
  - [ ] Verify proper HTTP status codes
  - [ ] Test with various input parameters

## Build and Packaging

- [ ] Verify Containerfile properly defines the build process
- [ ] Test container with different Podman/Docker versions
- [ ] Verify container size is optimized
- [ ] Test container portability across platforms
- [ ] Verify container can be pushed to registry