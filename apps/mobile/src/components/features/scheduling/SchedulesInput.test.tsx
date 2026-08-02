import { render, screen, fireEvent } from '@testing-library/react-native'
import SchedulesInput from './SchedulesInput'

const mockUseScheduling = jest.fn()

jest.mock('../../../data/hooks/useScheduling', () => ({
  __esModule: true,
  default: () => mockUseScheduling(),
}))

function renderInput({
  busySchedules = [] as string[],
  numberOfHours = 1,
  date = new Date(2026, 7, 5, 0, 0),
} = {}) {
  mockUseScheduling.mockReturnValue({ busySchedules })
  const dateChanged = jest.fn()

  render(
    <SchedulesInput
      date={date}
      numberOfHours={numberOfHours}
      dateChanged={dateChanged}
    />,
  )

  return { dateChanged }
}

describe('SchedulesInput (mobile) — grade', () => {
  it('renderiza os horários da agenda', () => {
    renderInput()

    expect(screen.getByText('08:00')).toBeOnTheScreen()
    expect(screen.getByText('14:00')).toBeOnTheScreen()
    expect(screen.getByText('21:45')).toBeOnTheScreen()
  })

  it('esconde o rótulo dos horários ocupados', () => {
    renderInput({ busySchedules: ['08:00'] })

    expect(screen.queryByText('08:00')).not.toBeOnTheScreen()
    expect(screen.getByText('08:15')).toBeOnTheScreen()
  })
})

describe('SchedulesInput (mobile) — seleção', () => {
  it('seleciona um horário livre no primeiro toque', () => {
    const { dateChanged } = renderInput()

    fireEvent.press(screen.getByText('09:00'))

    expect(dateChanged).toHaveBeenCalledTimes(1)
  })

  it('aplica o horário tocado sobre a data corrente', () => {
    const { dateChanged } = renderInput()

    fireEvent.press(screen.getByText('15:30'))

    const [dataRecebida] = dateChanged.mock.calls[0]
    expect(dataRecebida.getHours()).toBe(15)
    expect(dataRecebida.getMinutes()).toBe(30)
  })

  it('não seleciona um horário ocupado', () => {
    const { dateChanged } = renderInput({ busySchedules: ['10:00'] })

    // O ocupado renderiza X no lugar do rótulo; há vários X na grade.
    screen.getAllByText('X').forEach((x) => fireEvent.press(x))

    expect(dateChanged).not.toHaveBeenCalled()
  })
})

describe('SchedulesInput (mobile) — serviço de vários slots', () => {
  // Regressão: a guarda derivava de `currentTime`, que só era gravado dentro
  // do próprio onPress. No primeiro toque o período era [] e nada bloqueava —
  // dava para marcar 08:00 com 08:15 já ocupado, gerando dupla reserva.
  it('recusa período que esbarra num horário ocupado', () => {
    const { dateChanged } = renderInput({
      busySchedules: ['08:15'],
      numberOfHours: 2,
    })

    fireEvent.press(screen.getByText('08:00'))

    expect(dateChanged).not.toHaveBeenCalled()
  })

  it('aceita período de dois slots totalmente livre', () => {
    const { dateChanged } = renderInput({ numberOfHours: 2 })

    fireEvent.press(screen.getByText('09:00'))

    expect(dateChanged).toHaveBeenCalledTimes(1)
  })

  it('recusa horário sem slots suficientes até o fim do turno', () => {
    // 11:45 é o último da manhã; um serviço de 2 slots não cabe.
    const { dateChanged } = renderInput({ numberOfHours: 2 })

    fireEvent.press(screen.getByText('11:45'))

    expect(dateChanged).not.toHaveBeenCalled()
  })

  it('decide igual em toques repetidos, sem depender do toque anterior', () => {
    const { dateChanged } = renderInput({
      busySchedules: ['08:15'],
      numberOfHours: 2,
    })

    fireEvent.press(screen.getByText('08:00'))
    fireEvent.press(screen.getByText('08:00'))
    fireEvent.press(screen.getByText('08:00'))

    expect(dateChanged).not.toHaveBeenCalled()
  })
})
