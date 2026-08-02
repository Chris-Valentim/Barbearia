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
