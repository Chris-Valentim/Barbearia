import { render, screen } from '@testing-library/react'
import Assessment from './Assessment'

/** Conta os SVGs de estrela renderizados, por classe do @tabler/icons-react. */
function contarEstrelas(container: HTMLElement) {
  const svgs = Array.from(container.querySelectorAll('svg'))
  return {
    cheias: svgs.filter((s) => s.classList.contains('tabler-icon-star-filled'))
      .length,
    meias: svgs.filter((s) =>
      s.classList.contains('tabler-icon-star-half-filled'),
    ).length,
    vazias: svgs.filter((s) => s.classList.contains('tabler-icon-star')).length,
    total: svgs.length,
  }
}

describe('Assessment', () => {
  it('sempre renderiza cinco estrelas', () => {
    const { container } = render(<Assessment value={3} amount={10} />)

    expect(contarEstrelas(container).total).toBe(5)
  })

  it('exibe a quantidade de avaliações', () => {
    render(<Assessment value={5} amount={87} />)

    expect(screen.getByText('87')).toBeInTheDocument()
  })

  it('preenche todas as estrelas na nota máxima', () => {
    const { container } = render(<Assessment value={5} amount={10} />)

    expect(contarEstrelas(container).cheias).toBe(5)
  })

  it('não preenche nenhuma estrela na nota zero', () => {
    const { container } = render(<Assessment value={0} amount={10} />)

    expect(contarEstrelas(container).cheias).toBe(0)
  })

  it('preenche exatamente as estrelas correspondentes à nota inteira', () => {
    const { container } = render(<Assessment value={3} amount={10} />)

    expect(contarEstrelas(container).cheias).toBe(3)
  })

  it('usa meia estrela em nota fracionada', () => {
    const { container } = render(<Assessment value={3.5} amount={10} />)
    const { cheias, meias } = contarEstrelas(container)

    expect(cheias).toBe(3)
    expect(meias).toBe(1)
  })

  it('exibe zero quando não há avaliações', () => {
    render(<Assessment value={0} amount={0} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
