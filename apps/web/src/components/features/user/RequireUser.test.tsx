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

    expect(global.mocksDeNavegacao.replace).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Área restrita')).not.toBeInTheDocument()
  })

  it('redireciona para /login preservando o destino', () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })

    render(
      <RequireUser>
        <p>Área restrita</p>
      </RequireUser>,
    )

    const [destino] = global.mocksDeNavegacao.replace.mock.calls[0]
    expect(destino).toContain('/login')
    expect(destino).toContain('destiny=')
  })

  // Regressão: router.push era chamado no corpo do componente. Isso é efeito
  // colateral em fase de render, e reemitia a navegação a cada re-render.
  it('não navega mais de uma vez em re-renders', () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })

    const { rerender } = render(
      <RequireUser>
        <p>Área restrita</p>
      </RequireUser>,
    )
    rerender(
      <RequireUser>
        <p>Área restrita</p>
      </RequireUser>,
    )
    rerender(
      <RequireUser>
        <p>Área restrita</p>
      </RequireUser>,
    )

    expect(global.mocksDeNavegacao.replace).toHaveBeenCalledTimes(1)
  })

  it('usa replace para não deixar a rota protegida no histórico', () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })

    render(
      <RequireUser>
        <p>Área restrita</p>
      </RequireUser>,
    )

    expect(global.mocksDeNavegacao.push).not.toHaveBeenCalled()
  })

  it('não navega enquanto a sessão ainda está carregando', () => {
    mockUseUser.mockReturnValue({ user: null, loading: true })

    render(
      <RequireUser>
        <p>Área restrita</p>
      </RequireUser>,
    )

    expect(global.mocksDeNavegacao.replace).not.toHaveBeenCalled()
  })

  it('não navega quando há usuário autenticado', () => {
    mockUseUser.mockReturnValue({
      user: { email: 'chris@barba.com', name: 'Christian' },
      loading: false,
    })

    render(
      <RequireUser>
        <p>Área restrita</p>
      </RequireUser>,
    )

    expect(global.mocksDeNavegacao.replace).not.toHaveBeenCalled()
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
