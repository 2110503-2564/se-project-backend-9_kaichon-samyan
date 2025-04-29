module.exports = {
    // The root directory where Jest should look for test files
    rootDir: './',
    
    // The test environment - node for backend tests
    testEnvironment: 'node',
    
    // File extensions to consider as test files
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    
    // Indicates whether the coverage information should be collected
    collectCoverage: true,
    
    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',
    
    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: 'v8',
    
    // Add specific coverage thresholds to enforce
    coverageThreshold: {
      global: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
    
    // An array of regexp pattern strings that are matched against all file paths before executing the test
    testPathIgnorePatterns: ['/node_modules/'],
    
    // An array of file extensions your modules use
    moduleFileExtensions: ['js', 'json', 'node'],
    
    // Mock files for specific imports
    moduleNameMapper: {
      // Add any specific module mappings if needed
    },
    
    // Setup files that will be executed before each test
    setupFilesAfterEnv: ['./jest.setup.js']
  };