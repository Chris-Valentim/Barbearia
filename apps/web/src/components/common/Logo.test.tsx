import { render, screen } from '@testing-library/react'
import Logo from './Logo'

describe('Logo', () => {
  it('leva para a home', () => {
    render(<Logo />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/')
  })

  it('exibe o nome da marca', () => {
    render(<Logo />)

    expect(screen.getByText('Barba')).toBeInTheDocument()
    expect(screen.getByText('Brutal')).toBeInTheDocument()
  })

  it('renderiza a imagem com texto alternativo', () => {
    render(<Logo />)

    const imagens = screen.getAllByAltText('Logo')
    expect(imagens.length).toBeGreaterThan(0)
  })
})
