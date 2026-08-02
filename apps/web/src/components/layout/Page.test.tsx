import { render, screen } from '@testing-library/react'
import Page from './Page'

describe('Page', () => {
  it('renderiza o conteúdo dentro de <main>', () => {
    render(
      <Page>
        <h1>Conteúdo da página</h1>
      </Page>,
    )

    const main = screen.getByRole('main')
    expect(main).toContainElement(screen.getByText('Conteúdo da página'))
  })

  it('inclui o rodapé em toda página', () => {
    render(
      <Page>
        <span />
      </Page>,
    )

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('mantém o conteúdo antes do rodapé na ordem do documento', () => {
    render(
      <Page>
        <span>Topo</span>
      </Page>,
    )

    const main = screen.getByRole('main')
    const footer = screen.getByRole('contentinfo')

    expect(main.compareDocumentPosition(footer)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })
})
