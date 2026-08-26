import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Steps from './Steps'

const labels = ['Profissional', 'Serviços', 'Horário']

function renderSteps(props: Partial<React.ComponentProps<typeof Steps>> = {}) {
  const allowsNextStepChanged = jest.fn()

  render(
    <Steps
      labels={labels}
      allowsNextStep
      allowsNextStepChanged={allowsNextStepChanged}
      {...props}
    >
      <div>Passo um</div>
      <div>Passo dois</div>
      <div>Passo três</div>
    </Steps>,
  )

  return { allowsNextStepChanged }
}

describe('Steps', () => {
  it('lista todos os rótulos de etapa', () => {
    renderSteps()

    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it('numera as etapas a partir de 1', () => {
    renderSteps()

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('mostra apenas o conteúdo da etapa atual', () => {
    renderSteps()

    expect(screen.getByText('Passo um')).toBeInTheDocument()
    expect(screen.queryByText('Passo dois')).not.toBeInTheDocument()
  })

  it('desabilita "Anterior" na primeira etapa', () => {
    renderSteps()

    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled()
  })

  it('avança para a etapa seguinte ao clicar em "Próximo"', async () => {
    renderSteps()

    await userEvent.click(screen.getByRole('button', { name: /próximo/i }))

    expect(screen.getByText('Passo dois')).toBeInTheDocument()
    expect(screen.queryByText('Passo um')).not.toBeInTheDocument()
  })

  it('volta para a etapa anterior', async () => {
    renderSteps()

    await userEvent.click(screen.getByRole('button', { name: /próximo/i }))
    await userEvent.click(screen.getByRole('button', { name: /anterior/i }))

    expect(screen.getByText('Passo um')).toBeInTheDocument()
  })

  it('bloqueia o avanço quando allowsNextStep é falso', async () => {
    renderSteps({ allowsNextStep: false })

    expect(screen.getByRole('button', { name: /próximo/i })).toBeDisabled()
  })

  it('avisa que a próxima etapa ainda não está liberada ao avançar', async () => {
    const { allowsNextStepChanged } = renderSteps()

    await userEvent.click(screen.getByRole('button', { name: /próximo/i }))

    expect(allowsNextStepChanged).toHaveBeenCalledWith(false)
  })

  it('libera o avanço ao voltar, pois a etapa anterior já era válida', async () => {
    const { allowsNextStepChanged } = renderSteps()

    await userEvent.click(screen.getByRole('button', { name: /próximo/i }))
    await userEvent.click(screen.getByRole('button', { name: /anterior/i }))

    expect(allowsNextStepChanged).toHaveBeenLastCalledWith(true)
  })
})

describe('Steps — aparência dos botões', () => {
  // Regressão: o botão "Próximo" não tinha className nenhum, então o SVG do
  // ícone — que é display:block — caía para a linha de baixo do rótulo.
  it('alinha rótulo e ícone na mesma linha nos dois botões', () => {
    renderSteps()

    const anterior = screen.getByRole('button', { name: /anterior/i })
    const proximo = screen.getByRole('button', { name: /próximo/i })

    for (const botao of [anterior, proximo]) {
      expect(botao).toHaveClass('flex')
      expect(botao).toHaveClass('items-center')
    }
  })

  it('dá aos dois botões o mesmo tratamento visual', () => {
    renderSteps()

    const anterior = screen.getByRole('button', { name: /anterior/i })
    const proximo = screen.getByRole('button', { name: /próximo/i })

    for (const classe of ['gap-1', 'bg-zinc-700', 'rounded-md', 'px-4']) {
      expect(anterior).toHaveClass(classe)
      expect(proximo).toHaveClass(classe)
    }
  })

  it('esmaece o botão desabilitado', () => {
    renderSteps({ allowsNextStep: false })

    expect(screen.getByRole('button', { name: /próximo/i })).toHaveClass(
      'disabled:opacity-30',
    )
  })
})
