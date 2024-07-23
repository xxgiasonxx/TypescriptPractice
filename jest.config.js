/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  // preset: 'ts-jest',
  // testEnvironment: 'node',
  // clearMocks: true,
  // maxWorkers: 1,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/.vscode/',
    '/.github/',
    '/.husky/',
    '/.vscode/',
    '/.yarn/',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '!**/__tests__/coverage/**',
    '!**/__tests__/utils/**',
    '!**/__tests__/images/**',
    '!**/__tests__/images/**',
  ],
};
