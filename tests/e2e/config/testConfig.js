// E2E Test Configuration
const path = require('path');

module.exports = {
  // Test environment settings
  environment: {
    // VS Code settings for testing
    vscode: {
      version: '1.105.1',
      executablePath: process.env.VSCODE_EXECUTABLE_PATH,
      disableExtensions: true,
      userDataDir: path.join(__dirname, '../../.vscode-test/user-data'),
      extensionsDir: path.join(__dirname, '../../.vscode-test/extensions')
    },
    
    // Extension settings
    extension: {
      id: 'terminail',
      displayName: 'Terminail',
      publisher: 'terminail',
      version: '0.1.0'
    },
    
    // Test timeout settings
    timeouts: {
      extensionActivation: 30000, // 30 seconds
      commandExecution: 15000,    // 15 seconds
      terminalReady: 10000,       // 10 seconds
      mcpServerStartup: 5000,     // 5 seconds
      testTimeout: 30000          // 30 seconds
    }
  },
  
  // Real MCP server configuration
  mcpServer: {
    port: 3001,
    host: 'localhost',
    endpoints: {
      health: '/health',
      ais: '/ais',
      switch: '/switch',
      ask: '/ask'
    }
  },
  
  // Test data
  testData: {
    // Terminal commands to test
    commands: {
      basic: ['cd', 'ls', 'qi'],
      navigation: ['cd ..', 'cd /', 'cd ~'],
      fileOperations: ['touch test.txt', 'rm test.txt', 'mkdir test_dir'],
      complex: ['cd test_dir && ls', 'qi "what is the current directory?"']
    },
    
    // Expected outputs
    expectedOutputs: {
      cd: /changed directory|directory not found/i,
      ls: /total \d+|file not found/i,
      qi: /AI response|processing your question/i
    },
    
    // Error scenarios
    errorScenarios: {
      invalidCommand: 'invalid_command_123',
      nonExistentPath: '/non/existent/path',
      permissionDenied: '/root'
    }
  },
  
  // Performance thresholds
  performance: {
    extensionActivation: 5000,    // 5 seconds max
    commandExecution: 3000,       // 3 seconds max
    terminalStartup: 2000,        // 2 seconds max
    mcpResponse: 1000             // 1 second max
  },
  
  // CI/CD settings
  ci: {
    // Environment variables for CI
    envVars: {
      CI: 'true',
      DISPLAY: ':99',
      TEST_MODE: 'headless'
    },
    
    // Test retry settings
    retry: {
      maxAttempts: 3,
      delay: 2000
    }
  },
  
  // Reporting configuration
  reporting: {
    // Test reporters
    reporters: {
      console: 'spec',
      file: 'mochawesome',
      ci: 'junit'
    },
    
    // Output directories
    output: {
      reports: path.join(__dirname, '../reports'),
      screenshots: path.join(__dirname, '../screenshots'),
      logs: path.join(__dirname, '../logs')
    }
  }
};

// Helper function to get configuration for specific test type
module.exports.getConfigForTest = function(testType) {
  const config = { ...this };
  
  switch (testType) {
    case 'unit':
      config.environment.timeouts.testTimeout = 10000;
      break;
    case 'integration':
      config.environment.timeouts.testTimeout = 20000;
      break;
    case 'e2e':
      config.environment.timeouts.testTimeout = 30000;
      break;
    case 'performance':
      config.environment.timeouts.testTimeout = 60000;
      break;
    default:
      break;
  }
  
  return config;
};

// Helper function to validate configuration
module.exports.validateConfig = function() {
  const errors = [];
  
  // Check required environment variables
  if (process.env.CI && !process.env.DISPLAY) {
    errors.push('DISPLAY environment variable is required for CI');
  }
  
  // Check timeout values
  if (this.environment.timeouts.testTimeout < 10000) {
    errors.push('Test timeout should be at least 10 seconds');
  }
  
  // Check MCP server configuration
  if (this.mcpServer.port < 1024 || this.mcpServer.port > 65535) {
    errors.push('MCP server port must be between 1024 and 65535');
  }
  
  return errors.length === 0 ? null : errors;
};