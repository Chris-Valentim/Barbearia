import { render, screen } from '@testing-library/react'
import ContainerWithBackground from './ContainerWithBackground'

describe('ContainerWithBackground', () => {
  it('renderiza o conteúdo filho', () => {
    render(
      <ContainerWithBackground image="/banners/servicos.webp">
        <p>Conteúdo interno</p>
      </ContainerWithBackground>,
    )

    expect(screen.getByText('Conteúdo interno')).toBeInTheDocument()
  })

  it('usa a imagem recebida como fundo', () => {
    render(
      <ContainerWithBackground image="/banners/servicos.webp">
        <span />
      </ContainerWithBackground>,
    )

    const imagem = screen.getByAltText('Background')
    expect(imagem).toBeInTheDocument()
    expect(imagem.getAttribute('src')).toContain('servicos.webp')
  })

  it('aceita múltiplos filhos', () => {
    render(
      <ContainerWithBackground image="/x.webp">
        <span>Primeiro</span>
        <span>Segundo</span>
      </ContainerWithBackground>,
    )

    expect(screen.getByText('Primeiro')).toBeInTheDocument()
    expect(screen.getByText('Segundo')).toBeInTheDocument()
  })
})
