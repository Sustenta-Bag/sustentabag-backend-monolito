export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  verbose: true,
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  }
};