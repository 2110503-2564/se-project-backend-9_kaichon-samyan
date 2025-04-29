// This file sets up the testing environment for Jest

// Set timeout for tests (in milliseconds)
jest.setTimeout(10000);

// Mock environment variables that might be used in the code
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_EXPIRE = '1d';
process.env.JWT_COOKIE_EXPIRE = '1';
process.env.NODE_ENV = 'test';

// Silence console during tests (optional, remove if you want to see console output)
// global.console = {
//   log: jest.fn(),
//   error: jest.fn(),
//   warn: jest.fn(),
//   info: jest.fn(),
//   debug: jest.fn(),
// };

// Add global teardown to clean mocks after all tests
afterAll(() => {
  jest.resetAllMocks();
});