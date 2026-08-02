import { render, screen } from '@testing-library/react'
import CustomerItem from './CustomerItem'

describe('CustomerItem', () => {
  it('exibe o nome do cliente', () => {
    render(<CustomerItem name="Ricardo Soundbar" testimony="Serviço top!" />)

    expect(screen.getByText('Ricardo Soundbar')).toBeInTheDocument()
  })

  it('exibe o depoimento', () => {
    render(<CustomerItem name="Ricardo" testimony="Brutais no corte." />)

    expect(screen.getByText('Brutais no corte.')).toBeInTheDocument()
  })

  it('aceita depoimento longo sem truncar no DOM', () => {
    const longo = 'a'.repeat(500)
    render(<CustomerItem name="Cliente" testimony={longo} />)

    expect(screen.getByText(longo)).toBeInTheDocument()
  })
})
