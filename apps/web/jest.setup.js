require('@testing-library/jest-dom')

// O App Router não existe fora do Next, então os hooks de navegação precisam
// de dublê. Cada teste que se importa com navegação sobrescreve o retorno.
const push = jest.fn()
const replace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace, back: jest.fn(), refresh: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

global.mocksDeNavegacao = { push, replace }

beforeEach(() => {
  push.mockClear()
  replace.mockClear()
})
