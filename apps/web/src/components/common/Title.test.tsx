import { render, screen } from '@testing-library/react'
import Title from './Title'

describe('Title', () => {
  it('exibe o título principal como h2', () => {
    render(<Title main="Nossos Brutos" secondary="Só os mais brabos" />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Nossos Brutos' }),
    ).toBeInTheDocument()
  })

  it('exibe o subtítulo como h3', () => {
    render(<Title main="Nossos Brutos" secondary="Só os mais brabos" />)

    expect(
      screen.getByRole('heading', { level: 3, name: 'Só os mais brabos' }),
    ).toBeInTheDocument()
  })

  it('exibe a tag quando informada', () => {
    render(<Title tag="Time" main="Nossos Brutos" secondary="..." />)

    expect(screen.getByText('Time')).toBeInTheDocument()
  })

  it('omite a tag quando não informada', () => {
    render(<Title main="Nossos Brutos" secondary="..." />)

    expect(screen.queryByText('Time')).not.toBeInTheDocument()
  })

  it('mantém a hierarquia de headings (h2 antes de h3)', () => {
    render(<Title main="Principal" secondary="Secundário" />)

    const headings = screen.getAllByRole('heading')
    expect(headings[0].tagName).toBe('H2')
    expect(headings[1].tagName).toBe('H3')
  })
})
