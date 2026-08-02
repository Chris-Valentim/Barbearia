import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserMenu from './UserMenu'

const signOut = jest.fn()

jest.mock('@/data/hooks/useUser', () => ({
  __esModule: true,
  default: () => ({ signOut, user: null, loading: false }),
}))

const usuario = { name: 'Christian', email: 'chris@barba.com' }

describe('UserMenu', () => {
  beforeEach(() => signOut.mockClear())

  it('exibe nome e e-mail do usuário', () => {
    render(<UserMenu user={usuario} />)

    expect(screen.getByText('Christian')).toBeInTheDocument()
    expect(screen.getByText('chris@barba.com')).toBeInTheDocument()
  })

  it('usa o nome do usuário como texto alternativo do avatar', () => {
    render(<UserMenu user={usuario} />)

    expect(screen.getByAltText('Christian')).toBeInTheDocument()
  })

  it('não renderiza nada sem usuário', () => {
    const { container } = render(
      <UserMenu user={null as unknown as typeof usuario} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('revela a opção de logout ao abrir o menu', async () => {
    render(<UserMenu user={usuario} />)

    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByText('Logout')).toBeInTheDocument()
  })

  it('encerra a sessão ao clicar em Logout', async () => {
    render(<UserMenu user={usuario} />)

    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(await screen.findByText('Logout'))

    expect(signOut).toHaveBeenCalledTimes(1)
  })
})
