import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SchedulesInput from './SchedulesInput'

const mockUseScheduling = jest.fn()

jest.mock('@/data/hooks/useScheduling', () => ({
  __esModule: true,
  default: () => mockUseScheduling(),
}))

function renderInput({
  busySchedules = [] as string[],
  hourlyQuantity = 1,
  date = new Date(2026, 7, 5, 0, 0),
} = {}) {
  mockUseScheduling.mockReturnValue({ busySchedules })
  const dateChanged = jest.fn()

  render(
    <SchedulesInput
      date={date}
      hourlyQuantity={hourlyQuantity}
      dateChanged={dateChanged}
    />,
  )

  return { dateChanged }
}

describe('SchedulesInput — grade de horários', () => {
  it('exibe os três períodos do dia', () => {
    renderInput()

    expect(screen.getByText('Manhã')).toBeInTheDocument()
    expect(screen.getByText('Tarde')).toBeInTheDocument()
    expect(screen.getByText('Noite')).toBeInTheDocument()
  })

  it('renderiza os horários da agenda', () => {
    renderInput()

    expect(screen.getByText('08:00')).toBeInTheDocument()
    expect(screen.getByText('14:00')).toBeInTheDocument()
    expect(screen.getByText('21:45')).toBeInTheDocument()
  })

  it('esconde o rótulo dos horários ocupados', () => {
    renderInput({ busySchedules: ['08:00'] })

    expect(screen.queryByText('08:00')).not.toBeInTheDocument()
    expect(screen.getByText('08:15')).toBeInTheDocument()
  })
})

describe('SchedulesInput — seleção', () => {
  // Regressão: a guarda do onClick estava invertida. Um horário livre não
  // satisfazia nenhuma condição e o clique era engolido; um horário ocupado
  // caía no return com dateChanged e acabava sendo selecionado.
  it('seleciona um horário livre', async () => {
    const { dateChanged } = renderInput()

    await userEvent.click(screen.getByText('09:00'))

    expect(dateChanged).toHaveBeenCalledTimes(1)
  })

  it('aplica o horário clicado sobre a data corrente', async () => {
    const { dateChanged } = renderInput({ date: new Date(2026, 7, 5, 0, 0) })

    await userEvent.click(screen.getByText('15:30'))

    const [dataRecebida] = dateChanged.mock.calls[0]
    expect(dataRecebida.getHours()).toBe(15)
    expect(dataRecebida.getMinutes()).toBe(30)
    expect(dataRecebida.getDate()).toBe(5)
  })

  it('não seleciona um horário ocupado', async () => {
    const { dateChanged } = renderInput({ busySchedules: ['10:00'] })

    // O horário ocupado renderiza um X no lugar do rótulo.
    const grade = screen.getByText('09:45').parentElement?.parentElement
    const ocupado = grade?.querySelector('.cursor-not-allowed')
    expect(ocupado).toBeTruthy()

    await userEvent.click(ocupado as Element)

    expect(dateChanged).not.toHaveBeenCalled()
  })

  it('permite selecionar qualquer horário livre da grade', async () => {
    const { dateChanged } = renderInput()

    for (const horario of ['08:00', '11:45', '14:00', '18:30', '21:45']) {
      await userEvent.click(screen.getByText(horario))
    }

    expect(dateChanged).toHaveBeenCalledTimes(5)
  })
})

describe('SchedulesInput — serviço que ocupa vários slots', () => {
  it('bloqueia o período que esbarra num horário ocupado', async () => {
    // 08:15 ocupado, serviço de 2 slots: começar às 08:00 tomaria 08:00 e 08:15.
    const { dateChanged } = renderInput({
      busySchedules: ['08:15'],
      hourlyQuantity: 2,
    })

    // A referência é guardada antes do hover: ao entrar num período bloqueado
    // o rótulo do horário dá lugar a um X, e o texto deixa de ser localizável.
    const celula = screen.getByText('08:00').closest('div') as Element
    await userEvent.hover(celula)
    await userEvent.click(celula)

    expect(dateChanged).not.toHaveBeenCalled()
  })

  it('libera um período de dois slots totalmente livre', async () => {
    const { dateChanged } = renderInput({ hourlyQuantity: 2 })

    const celula = screen.getByText('09:00').closest('div') as Element
    await userEvent.hover(celula)
    await userEvent.click(celula)

    expect(dateChanged).toHaveBeenCalledTimes(1)
  })
})
