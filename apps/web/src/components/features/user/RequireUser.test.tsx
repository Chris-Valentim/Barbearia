import { render, screen } from '@testing-library/react'
import RequireUser from './RequireUser'

const mockUseUser = jest.fn()

jest.mock('@/data/hooks/useUser', () => ({
  __esModule: true,
  default: () => mockUseUser(),
}))

describe('RequireUser', () => {
  it('mostra carregando enquanto a sessão é resolvida', () => {
    mockUseUser.mockReturnValue({ user: null, loading: true })

    render(
      <RequireUser>
        <p>Área restrita</p>
      </RequireUser>,
    )

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
    expect(screen.queryByText('Área restrita')).not.toBeInTheDocument()
  })

  it('libera o conteúdo para usuário autenticado', () => {
    mockUseUser.mockReturnValue({
      user: { email: 'chris@barba.com', name: 'Christian' },
      loading: false,
    })

    render(
      <RequireUser>
        <p>Área restrita</p>
      </RequireUser>,
    )

    expect(screen.getByText('Área restrita')).toBeInTheDocument()
  })

  it('redireciona quem não está autenticado', () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })

    render(
      <RequireUser>
        <p>Área restrita</p>
      </RequireUser>,
    )

    expect(global.mocksDeNavegacao.push).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Área restrita')).not.toBeInTheDocument()
  })

  it('redireciona para /login preservando o destino', () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })

    render(
      <RequireUser>
        <p>Área restrita</p>
      </RequireUser>,
    )

    const [destino] = global.mocksDeNavegacao.push.mock.calls[0]
    expect(destino).toContain('/login')
    expect(destino).toContain('destiny=')
  })

  it('avisa que está redirecionando', () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })

    render(
      <RequireUser>
        <p>Área restrita</p>
      </RequireUser>,
    )

    expect(screen.getByText('Direcionando...')).toBeInTheDocument()
  })
})
