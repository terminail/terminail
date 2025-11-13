# Auto Podman Build Specification

## Overview
This specification defines the automatic Podman image building capability for the TerminAI VS Code extension, enabling seamless container-based development with the Playwright MCP server.

## Related Documents
- Primary: `d:\git\6terminai\container\mcp_server` - Playwright MCP server implementation
- Reference: `d:\git\6terminai\container\Podmanfile` - Container definition
- Requirements: FR-002 from 001-podman-environment/spec.md (line 39)

## Functional Requirements

### FR-001: Automatic Image Detection
**Priority**: High
**Status**: Proposed
**Description**: The TerminAI extension must automatically detect the presence of container configuration files in the project workspace.

**Requirements**:
- MUST scan for `Podmanfile` in the project root
- MUST detect `container/mcp_server/` directory structure
- MUST validate MCP server implementation files (main.py, browser.py)
- SHOULD support additional container files (docker-compose.yml, container-specific configs)

### FR-002: Automatic Image Building
**Priority**: High
**Status**: Proposed
**Description**: The extension must automatically build the Podman image when container configuration is detected.

**Requirements**:
- MUST build image using detected `Podmanfile`
- MUST set appropriate image name (terminai-mcp-server:latest)
- MUST validate build process and report errors
- SHOULD support build progress tracking and user feedback
- SHOULD implement build caching for faster subsequent builds
- MUST handle network connectivity issues during build dependencies

### FR-003: Container Environment Validation
**Priority**: High
**Status**: Proposed
**Description**: The extension must validate that the built container environment is properly configured.

**Requirements**:
- MUST verify MCP server port 3000 is properly exposed
- MUST validate Playwright browser dependencies are installed
- MUST test container startup and health checks
- MUST verify browser automation capabilities are functional
- SHOULD provide detailed validation report

### FR-004: Seamless Container Integration
**Priority**: Medium
**Status**: Proposed
**Description**: The extension must integrate the built container with the MCP server functionality.

**Requirements**:
- MUST start container on-demand when MCP server features are used
- MUST expose container API endpoints to extension
- MUST handle container lifecycle (start, stop, restart)
- MUST manage container networking and port mapping
- SHOULD implement container health monitoring

### FR-005: Development Workflow Integration
**Priority**: Medium
**Status**: Proposed
**Description**: The extension must integrate with standard development workflows.

**Requirements**:
- MUST provide commands to manually trigger build process
- MUST support incremental builds when source files change
- MUST integrate with VS Code task system
- MUST provide container logs and status information
- SHOULD support debugging of containerized MCP server

## Technical Requirements

### TR-001: Build System Integration
**Type**: Technical Implementation
**Requirements**:
- Use native Podman CLI for image building
- Integrate with VS Code extension host process
- Implement proper error handling and logging
- Support both development and production build modes

### TR-002: File System Monitoring
**Type**: Technical Implementation
**Requirements**:
- Monitor `container/mcp_server/` directory for changes
- Trigger incremental builds on relevant file modifications
- Exclude unnecessary files from build context
- Implement efficient file change detection

### TR-003: Container Runtime Management
**Type**: Technical Implementation
**Requirements**:
- Manage container lifecycle (create, start, stop, remove)
- Handle container networking and port forwarding
- Implement container health checking
- Support container logs streaming

### TR-004: Configuration Management
**Type**: Technical Implementation
**Requirements**:
- Support configurable build parameters (image name, tags, etc.)
- Handle environment-specific configurations
- Support proxy settings for build dependencies
- Manage container resource limits

## Architecture Components

### Component 1: AutoBuild Detector
**Purpose**: Detect and validate container configuration
**Responsibilities**:
- Scan workspace for container files
- Validate MCP server implementation
- Check build prerequisites

### Component 2: Build Manager
**Purpose**: Handle automatic image building
**Responsibilities**:
- Execute Podman build commands
- Manage build process and progress
- Handle build errors and recovery
- Implement caching strategies

### Component 3: Container Controller
**Purpose**: Manage container lifecycle
**Responsibilities**:
- Start and stop containers
- Monitor container health
- Handle networking and port mapping
- Stream container logs

### Component 4: Integration Layer
**Purpose**: Connect extension with container functionality
**Responsibilities**:
- Provide API to extension commands
- Handle container events and notifications
- Manage container state synchronization
- Support debugging and development features

## Configuration Options

### Build Configuration
```json
{
  "terminai.container.autoBuild": {
    "enabled": true,
    "imageName": "terminai-mcp-server",
    "buildContext": "./",
    "dockerfilePath": "./container/Podmanfile",
    "buildOnSave": true,
    "incrementalBuild": true
  }
}
```

### Runtime Configuration
```json
{
  "terminai.container.runtime": {
    "containerName": "terminai-mcp-server-dev",
    "portMapping": {
      "mcpServer": 3000,
      "playwrightDebug": 9222
    },
    "resourceLimits": {
      "memory": "512m",
      "cpus": "1.0"
    },
    "healthCheck": {
      "enabled": true,
      "interval": 30,
      "timeout": 10
    }
  }
}
```

## User Experience Flow

1. **Initial Setup**:
   - User opens TerminAI project with container configuration
   - Extension detects container files automatically
   - System prompts user to enable auto-build feature
   - First build is executed automatically or manually

2. **Development Workflow**:
   - Extension monitors container source files for changes
   - Incremental builds are triggered when needed
   - Container is started automatically when MCP features are used
   - User can manually control build and container lifecycle

3. **Error Handling**:
   - Build failures are reported with detailed error messages
   - Container issues are automatically detected and reported
   - Recovery mechanisms attempt to resolve common problems
   - User is provided with troubleshooting guidance

## Implementation Notes

### Dependencies
- Podman CLI must be available in the system PATH
- VS Code Extension API access
- File system write permissions for build operations

### Security Considerations
- Container runs as non-root user (terminai)
- Build process uses minimal privileges
- Container networking is properly isolated
- Source code is not exposed in production containers

### Performance Considerations
- Build caching reduces subsequent build times
- Incremental builds only rebuild changed components
- Container startup is optimized for rapid development
- Resource limits prevent excessive system usage

## Testing Strategy

### Unit Tests
- AutoBuild Detector functionality
- Build Manager process handling
- Container Controller operations
- Configuration management

### Integration Tests
- End-to-end build and run workflow
- Multiple AI platform compatibility
- Error recovery scenarios
- Performance benchmarking

### Manual Testing
- Developer workflow validation
- Cross-platform compatibility
- User experience assessment
- Security and isolation verification

## Success Criteria

1. **Automatic Detection**: Extension successfully detects container configuration files
2. **Successful Builds**: Podman image builds complete without errors
3. **Functional Containers**: MCP server runs properly in container environment
4. **Developer Experience**: Smooth integration with existing development workflow
5. **Error Recovery**: Common build and runtime issues are handled gracefully
6. **Performance**: Build and startup times meet development requirements

## Future Enhancements

### Phase 2 Features
- Multi-container orchestration support
- Custom base image selection
- Build artifact caching across machines
- Container registry integration

### Phase 3 Features
- Kubernetes deployment support
- Cloud container runtime integration
- Advanced debugging capabilities
- Performance profiling tools

## References
- [Podman Documentation](https://podman.io/)
- [VS Code Extension Development](https://code.visualstudio.com/api)
- [Playwright Documentation](https://playwright.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)