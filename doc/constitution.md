# Zeromile Framework Constitution

This document outlines the governing principles and guidelines for the zeromile framework development and usage.

## Core Principles

1. **Communication Abstraction**: Provide a unified interface for distributed services that abstracts complex communication protocols like Zenoh, allowing business services to focus purely on domain logic without concern for underlying communication mechanisms.
2. **Infrastructure as Code**: Centralize infrastructure services (logging, database, email, configuration) as ready-to-use components that can be accessed through simple APIs without individual configuration.
3. **Service Orientation**: Enable business services to communicate through well-defined patterns using publish/subscribe and query/response mechanisms.
4. **Configuration-Driven Design**: Enable system behavior customization through YAML-based configuration files, allowing services to be customized without code changes.
5. **Observability**: Provide comprehensive health monitoring and performance tracking capabilities for all framework components and services.
6. **Extensibility**: Design systems with extensible architectures that support future growth and integration of new features.

## Framework Architecture Principles

### Service Layer
- Business logic services that use Zenoh messaging for communication
- Services focus purely on domain logic without communication concerns
- Services register with the framework for automatic discovery
- Services use convenience methods for different communication scopes (local vs. general)

### Infrastructure Layer
- Core infrastructure components accessed via direct API calls (database, logging, email, configuration)
- Components provide ready-to-use functionality without individual setup
- Components integrate with framework's security and monitoring systems
- Components follow consistent APIs and naming conventions

## Component Classification

1. **Infrastructure Components**: Accessed via direct API calls (database, logging, email, configuration)
2. **Infrastructure Services**: Services that use Zenoh-based communication (user management, party service, health monitoring)
3. **Business Services**: Custom business logic services that communicate through Zenoh messaging

### Hierarchical Component Governance

The framework follows a hierarchical naming convention where parent components govern child components:

#### Zenoh Governance
The Zenoh infrastructure component governs all communication-related sub-components:
- **zenoh-publisher** - Zenoh Publisher implementation
- **zenoh-queryable** - Zenoh Queryable implementation
- **zenoh-subscriber** - Zenoh Subscriber implementation

All Zenoh-related components start with the `zenoh-` prefix.

#### User Governance
The User Management Service governs all user-related sub-components:
- **user-authentication** - User authentication mechanisms
- **user-registration** - User registration processes
- **user-relation** - User relationship management
- **user-role** - User role and permission management

All user-related components start with the `user-` prefix.

#### Database Governance
The Database infrastructure component governs all database adapter sub-components:
- **database-duckdb** - DuckDB database adapter
- **database-sqlite** - SQLite database adapter

All database-related components start with the `database-` prefix.

## Communication Patterns

### Locality Control
- **Local Communication**: Methods prefixed with `get_local_*` for secure internal communication that never leaves the installation
- **General Communication**: Methods without `local` prefix for communication that can cross network boundaries
- **Security**: Built-in locality restrictions to ensure appropriate communication scope

### API Consistency
- Consistent naming patterns across all communication mechanisms
- Unified error handling and response formats
- Automatic resource management for all communication components

## Code Quality Principles

1. **Readability First**: Code should be written for humans first, machines second.
2. **Consistency**: Follow established patterns and conventions throughout the codebase.
3. **Simplicity**: Prefer simple solutions over complex ones.
4. **Documentation**: All public APIs and complex logic should be well-documented.
5. **Extensibility**: Design code with extensibility in mind, using interfaces and abstractions that allow for future enhancements.

## Testing Standards

1. **Test Coverage**: All new features should include appropriate unit tests.
2. **Integration Testing**: Critical user flows should be covered by integration tests.
3. **Test Organization**: Tests should be organized in a way that mirrors the codebase structure.
4. **Communication Testing**: Test both local and general communication patterns.
5. **Component Testing**: Test infrastructure components in isolation and in integration.

## Performance Requirements

1. **Response Time**: Framework APIs should respond in under 100ms for 95% of requests.
2. **Resource Usage**: Optimize for minimal memory and CPU usage, especially on limited hardware.
3. **Communication Efficiency**: Minimize overhead in communication patterns.
4. **Startup Time**: Framework initialization should complete quickly to enable fast service startup.

## Technical Stack Guidelines

1. **Python First**: Use Python 3.12+ as the primary implementation language.
2. **Modular Design**: Design systems with modular components that can be selectively used.
3. **Resource Efficiency**: Design systems to work efficiently on minimal hardware configurations.
4. **Health Monitoring Integration**: Integrate with the framework's Health Monitoring Service to provide comprehensive visibility.
5. **Extensible Design**: Implement plugin-based architectures and well-defined interfaces.
6. **Standardized Naming**: Follow the zeromile framework's standardized naming convention for all features and components (see [Feature Naming Convention](../../docs/FEATURE_NAMING_CONVENTION.md)).

## Security Practices

1. **Data Protection**: Sensitive data should be properly encrypted.
2. **Input Validation**: All user inputs should be validated and sanitized.
3. **Authentication**: Implement secure authentication mechanisms.
4. **Authorization**: Enforce strict access controls based on service roles.
5. **Communication Security**: Ensure secure communication between services.
6. **Configuration Security**: Protect sensitive configuration values.

## Configuration Management

1. **YAML First**: Use YAML as the primary configuration format for all system components.
2. **Schema Validation**: All configuration files must include JSON Schema validation.
3. **Environment Separation**: Maintain separate configuration files for development, testing, and production environments.
4. **Version Control**: Configuration files should be version controlled alongside code.
5. **Documentation**: All configuration options should be documented with clear descriptions and examples.

## Health Monitoring Integration

1. **Framework Integration**: Integrate with the zeromile framework's Health Monitoring Service as the primary monitoring solution.
2. **Comprehensive Metrics**: Collect metrics on system performance, resource usage, and business operations.
3. **Real-Time Visibility**: Provide real-time dashboards for service health and performance.
4. **Alerting**: Implement configurable alerting mechanisms for critical system events.
5. **Component Health Tracking**: Utilize the Health Monitoring Service's component registration and health tracking capabilities.

## Extensibility Practices

1. **Plugin Architecture**: Design systems with plugin-based architectures that allow for easy addition of new features.
2. **Well-Defined Interfaces**: Implement clear, well-documented interfaces between system components.
3. **Backward Compatibility**: Maintain backward compatibility when extending system functionality.
4. **Modular Components**: Enable individual components to be used or replaced without affecting the entire system.
5. **Third-Party Integration**: Provide mechanisms for integrating third-party tools and services.

## Version Control

1. **Commit Messages**: Use clear, descriptive commit messages.
2. **Branching Strategy**: Follow a consistent branching strategy.
3. **Code Reviews**: All changes should be reviewed before merging.
4. **Semantic Versioning**: Follow semantic versioning for releases.

## Documentation Standards

1. **Specification-Driven**: All features must have corresponding specifications in the `.specify` directory.
2. **Consistent Structure**: Follow standardized templates for specifications, plans, and tasks.
3. **Cross-References**: Maintain accurate cross-references between related components.
4. **Examples**: Provide practical examples for all major features.
5. **Naming Convention**: Follow the zeromile framework's naming convention for all documentation (see [Feature Naming Convention](../../docs/FEATURE_NAMING_CONVENTION.md)).