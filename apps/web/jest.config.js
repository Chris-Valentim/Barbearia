const nextJest = require('next/jest')

// next/jest cuida do SWC, do CSS Modules, dos assets estáticos e do .env.
const createJestConfig = nextJest({ dir: './' })

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    // shadcn/ui é código de terceiros, colado no projeto
    '!src/components/ui/**',
  ],
}

module.exports = createJestConfig(config)
