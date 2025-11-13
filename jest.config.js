module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^vscode$': '<rootDir>/tests/__mocks__/vscode.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/out/',
    '/playwright-report/',
    '/.vscode/',
    '/.github/',
    '/.gitee/',
    '/.specify/',
    '/container/',
    '/doc/',
    '/media/',
    '/scripts/',
    '/playwright/',
    '/e2e/'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/out/',
    '<rootDir>/playwright-report/',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};