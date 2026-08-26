import { render, screen } from '@testing-library/react'
import Header from './Header'

jest.mock('@/data/hooks/useUser', () => ({
  __esModule: true,
  default: () => ({ user: null, loading: false }),
}))

describe('Header', () => {
  it('exibe o título como h1', () => {
    render(<Header title="Agendamento de Serviço" description="..." />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Agendamento de Serviço' }),
    ).toBeInTheDocument()
  })

  it('exibe a descrição', () => {
    render(
      <Header
        title="Agendamento"
        description="Seja atendido no horário marcado."
      />,
    )

    expect(
      screen.getByText('Seja atendido no horário marcado.'),
    ).toBeInTheDocument()
  })

  it('inclui o menu superior', () => {
    render(<Header title="X" description="Y" />)

    expect(screen.getByText('Barba')).toBeInTheDocument()
  })

  it('renderiza o banner com texto alternativo', () => {
    render(<Header title="X" description="Y" />)

    expect(screen.getByAltText('Barbearia')).toBeInTheDocument()
  })
})
