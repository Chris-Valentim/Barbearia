import { render, screen } from '@testing-library/react'
import TopMenu from './TopMenu'

const mockUseUser = jest.fn()

jest.mock('@/data/hooks/useUser', () => ({
  __esModule: true,
  default: () => mockUseUser(),
}))

describe('TopMenu — visitante', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({ user: null, loading: false })
  })

  it('oferece o link de entrar', () => {
    render(<TopMenu />)

    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })

  it('aponta o link para /login', () => {
    render(<TopMenu />)

    // Regressão: já apontou para /singIn, rota que nunca existiu.
    expect(screen.getByText('Entrar').closest('a')).toHaveAttribute(
      'href',
      '/login',
    )
  })

  it('sempre exibe a logo', () => {
    render(<TopMenu />)

    expect(screen.getByText('Brutal')).toBeInTheDocument()
  })
})

describe('TopMenu — autenticado', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({
      user: { name: 'Christian', email: 'chris@barba.com' },
      loading: false,
      signOut: jest.fn(),
    })
  })

  it('troca o link de entrar pelo menu do usuário', () => {
    render(<TopMenu />)

    expect(screen.queryByText('Entrar')).not.toBeInTheDocument()
    expect(screen.getByText('Christian')).toBeInTheDocument()
  })

  it('exibe o e-mail do usuário', () => {
    render(<TopMenu />)

    expect(screen.getByText('chris@barba.com')).toBeInTheDocument()
  })
})
