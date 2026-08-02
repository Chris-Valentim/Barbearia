/** @type {import('jest').Config} */
module.exports = {
  // O preset `jest-expo` puro é multi-projeto (ios + android + web) e ignora
  // configuração declarada na raiz — setup e moduleNameMapper nunca chegariam
  // aos projects. Para teste unitário de componente, uma plataforma basta.
  preset: 'jest-expo/ios',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // O yarn workspaces deixa duas cópias idênticas de react-native: uma
    // hoisted na raiz e outra em apps/mobile/node_modules. O `setupFiles` do
    // preset mocka os módulos nativos da cópia da RAIZ, mas os testes
    // resolveriam a cópia LOCAL — instâncias distintas, mock sem efeito, e
    // qualquer StyleSheet.create estoura em "Native module cannot be null".
    // Forçar as duas pontas na mesma instância resolve.
    '^react-native$': '<rootDir>/../../node_modules/react-native',
    '^react-native/(.*)$': '<rootDir>/../../node_modules/react-native/$1',
    // Pelo mesmo motivo, há três cópias de react no monorepo — 18.3.1 na raiz
    // e 18.2.0 em apps/mobile e dentro do próprio react-native. Com mais de uma
    // instância, o react-test-renderer e o react-native falam com Reacts
    // diferentes e todo render quebra. 18.2.0 é a versão que o app declara.
    '^react$': '<rootDir>/node_modules/react',
    '^react/(.*)$': '<rootDir>/node_modules/react/$1',
    '^react-test-renderer$': '<rootDir>/node_modules/react-test-renderer',
    '^react-test-renderer/(.*)$':
      '<rootDir>/node_modules/react-test-renderer/$1',
    // Os pacotes do monorepo são distribuídos como TypeScript, então precisam
    // apontar para o fonte em vez de um dist/ que não existe.
    '^@barba/contracts$': '<rootDir>/../../packages/contracts/src/index.ts',
    '^@barba/client-shared$':
      '<rootDir>/../../packages/client-shared/src/index.ts',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
}
