import { render, screen } from '@testing-library/react'
import { Professional } from '@barba/contracts'
import ProfessionalItem from './ProfessionalItem'

const profissional: Professional = {
  id: 1,
  name: 'Marcão Machadada',
  description: 'Transforma juba de leão em corte de rei.',
  imageUrl: '/professionals/profissional-1.jpg',
  assessment: 5,
  assessmentAmount: 87,
}

describe('ProfessionalItem', () => {
  it('exibe nome e descrição', () => {
    render(<ProfessionalItem professional={profissional} />)

    expect(screen.getByText('Marcão Machadada')).toBeInTheDocument()
    expect(
      screen.getByText('Transforma juba de leão em corte de rei.'),
    ).toBeInTheDocument()
  })

  it('usa o nome como texto alternativo da foto', () => {
    render(<ProfessionalItem professional={profissional} />)

    expect(screen.getByAltText('Marcão Machadada')).toBeInTheDocument()
  })

  it('mostra a quantidade de avaliações', () => {
    render(<ProfessionalItem professional={profissional} />)

    expect(screen.getByText('87')).toBeInTheDocument()
  })

  it('renderiza as cinco estrelas de avaliação', () => {
    const { container } = render(
      <ProfessionalItem professional={profissional} />,
    )

    const estrelas = container.querySelectorAll('[class*="tabler-icon-star"]')
    expect(estrelas).toHaveLength(5)
  })
})
