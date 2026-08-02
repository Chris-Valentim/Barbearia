import { render, screen, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import Steps from './Steps'

const labels = ['Profissional', 'Serviços', 'Horário']

function renderSteps(props: Partial<React.ComponentProps<typeof Steps>> = {}) {
  const allowsNextStepChanged = jest.fn()
  const finish = jest.fn()

  render(
    <Steps
      labels={labels}
      allowsNextStep
      allowsNextStepChanged={allowsNextStepChanged}
      finish={finish}
      {...props}
    >
      <Text>Passo um</Text>
      <Text>Passo dois</Text>
      <Text>Passo três</Text>
    </Steps>,
  )

  return { allowsNextStepChanged, finish }
}

describe('Steps (mobile)', () => {
  it('lista todos os rótulos de etapa', () => {
    renderSteps()

    labels.forEach((label) => expect(screen.getByText(label)).toBeOnTheScreen())
  })

  it('mostra apenas o conteúdo da etapa atual', () => {
    renderSteps()

    expect(screen.getByText('Passo um')).toBeOnTheScreen()
    expect(screen.queryByText('Passo dois')).not.toBeOnTheScreen()
  })

  it('avança para a etapa seguinte', () => {
    renderSteps()

    fireEvent.press(screen.getByText('Próximo'))

    expect(screen.getByText('Passo dois')).toBeOnTheScreen()
  })
})

describe('Steps (mobile) — botão Anterior', () => {
  // Regressão: renderButton recebe `enable`, e a condição era
  // `currentSteps === 0` — o inverso. O botão só respondia no primeiro passo,
  // onde levava o índice a -1 e deixava a tela em branco, e ficava inerte
  // exatamente nos passos em que o usuário precisa voltar.
  it('não volta além da primeira etapa', () => {
    renderSteps()

    fireEvent.press(screen.getByText('Anterior'))

    expect(screen.getByText('Passo um')).toBeOnTheScreen()
  })

  it('volta da segunda para a primeira etapa', () => {
    renderSteps()

    fireEvent.press(screen.getByText('Próximo'))
    expect(screen.getByText('Passo dois')).toBeOnTheScreen()

    fireEvent.press(screen.getByText('Anterior'))
    expect(screen.getByText('Passo um')).toBeOnTheScreen()
  })

  it('volta da terceira para a segunda etapa', () => {
    renderSteps()

    fireEvent.press(screen.getByText('Próximo'))
    fireEvent.press(screen.getByText('Próximo'))
    expect(screen.getByText('Passo três')).toBeOnTheScreen()

    fireEvent.press(screen.getByText('Anterior'))
    expect(screen.getByText('Passo dois')).toBeOnTheScreen()
  })

  it('nunca deixa a tela sem conteúdo ao voltar do início', () => {
    renderSteps()

    fireEvent.press(screen.getByText('Anterior'))
    fireEvent.press(screen.getByText('Anterior'))

    expect(screen.getByText('Passo um')).toBeOnTheScreen()
  })
})

describe('Steps (mobile) — conclusão', () => {
  it('chama finish na última etapa', () => {
    const { finish } = renderSteps()

    fireEvent.press(screen.getByText('Próximo'))
    fireEvent.press(screen.getByText('Próximo'))
    fireEvent.press(screen.getByText('Próximo'))

    expect(finish).toHaveBeenCalledTimes(1)
  })

  it('não avança quando a etapa não está liberada', () => {
    renderSteps({ allowsNextStep: false })

    fireEvent.press(screen.getByText('Próximo'))

    expect(screen.getByText('Passo um')).toBeOnTheScreen()
  })
})
