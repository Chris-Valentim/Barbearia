import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('é um elemento contentinfo', () => {
    render(<Footer />)

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('lista os links institucionais', () => {
    render(<Footer />)

    expect(screen.getByText('Nossa História')).toBeInTheDocument()
    expect(screen.getByText('Política de Privacidade')).toBeInTheDocument()
    expect(screen.getByText('Termos de Uso')).toBeInTheDocument()
  })

  it('exibe a seção de contato', () => {
    render(<Footer />)

    expect(screen.getByText('Contato')).toBeInTheDocument()
    expect(screen.getByText('Whatsapp')).toBeInTheDocument()
  })

  it('mostra o ano corrente no aviso de direitos', () => {
    render(<Footer />)

    // O ano é interpolado dentro de "em {ano}", então a busca é por padrão.
    expect(
      screen.getByText(new RegExp(String(new Date().getFullYear()))),
    ).toBeInTheDocument()
  })

  it('exibe o aviso de direitos reservados', () => {
    render(<Footer />)

    expect(screen.getByText('Todos os direitos reservados')).toBeInTheDocument()
  })

  it('inclui a logo', () => {
    render(<Footer />)

    expect(screen.getByText('Barba')).toBeInTheDocument()
  })
})
