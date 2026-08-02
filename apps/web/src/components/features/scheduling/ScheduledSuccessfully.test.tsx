import { render, screen } from '@testing-library/react'
import ScheduledSuccessfully from './ScheduledSuccessfully'

describe('ScheduledSuccessfully', () => {
  it('confirma o agendamento em destaque', () => {
    render(<ScheduledSuccessfully />)

    expect(
      screen.getByRole('heading', { level: 2, name: /tudo marcado/i }),
    ).toBeInTheDocument()
  })

  it('oferece caminho de volta para a home', () => {
    render(<ScheduledSuccessfully />)

    const link = screen.getByRole('link', { name: /voltar para o início/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('mostra a ilustração de confirmação', () => {
    render(<ScheduledSuccessfully />)

    expect(screen.getByAltText('Agendado com Sucesso')).toBeInTheDocument()
  })
})
