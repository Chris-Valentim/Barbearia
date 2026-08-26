/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  // Resolve @barba/contracts pelo código-fonte em vez do dist/, para que os
  // testes não dependam de um build prévio do pacote.
  moduleNameMapper: {
    '^@barba/contracts$': '<rootDir>/../contracts/src/index.ts',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
}
