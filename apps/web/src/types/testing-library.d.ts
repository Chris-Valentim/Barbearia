// Registra os matchers do jest-dom (toBeInTheDocument, toHaveAttribute…) no
// namespace do jest. O require em jest.setup.js os instala em runtime, mas o
// TypeScript só os enxerga com esta importação.
import '@testing-library/jest-dom'

declare global {
  /**
   * Mocks de navegação expostos por jest.setup.js. O dublê de next/navigation
   * é global, então os testes precisam de uma referência estável para verificar
   * redirecionamentos.
   */
  // eslint-disable-next-line no-var
  var mocksDeNavegacao: {
    push: jest.Mock
    replace: jest.Mock
  }
}
