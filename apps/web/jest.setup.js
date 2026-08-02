require('@testing-library/jest-dom')

// O App Router não existe fora do Next, então os hooks de navegação precisam
// de dublê. Cada teste que se importa com navegação sobrescreve o retorno.
const push = jest.fn()
const replace = jest.fn()

// O objeto do router é criado UMA vez, não a cada chamada: o useRouter real do
// Next devolve sempre a mesma instância, e um dublê que devolvesse um objeto
// novo por render faria qualquer useEffect que dependa de `router` reexecutar
// sem parar — um falso positivo que não existe em produção.
const router = { push, replace, back: jest.fn(), refresh: jest.fn() }

jest.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

global.mocksDeNavegacao = { push, replace }

beforeEach(() => {
  push.mockClear()
  replace.mockClear()
})
