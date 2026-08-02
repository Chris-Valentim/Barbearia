import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Summary from './Summary'

const schedule = jest.fn()
const mockUseScheduling = jest.fn()

jest.mock('@/data/hooks/useScheduling', () => ({
  __esModule: true,
  default: () => mockUseScheduling(),
}))

function agendamento(overrides = {}) {
  return {
    date: new Date(2026, 7, 5, 14, 0),
    professional: { id: 1, name: 'Marcão Machadada' },
    services: [{ id: 1, name: 'Corte Viking' }],
    totalPrice: () => 55,
    totalDuration: () => '0h 45m',
    schedule,
    ...overrides,
  }
}

describe('Summary — agendamento vazio', () => {
  beforeEach(() => {
    mockUseScheduling.mockReturnValue(
      agendamento({
        professional: null,
        services: [],
        totalPrice: () => 0,
        totalDuration: () => '0h 0m',
      }),
    )
  })

  it('indica profissional e serviços não selecionados', () => {
    render(<Summary />)

    expect(screen.getAllByText('Não selecionado')).toHaveLength(2)
  })

  it('desabilita o botão de finalizar', () => {
    render(<Summary />)

    expect(
      screen.getByRole('button', { name: /finalizar agendamento/i }),
    ).toBeDisabled()
  })
})

describe('Summary — agendamento completo', () => {
  beforeEach(() => {
    schedule.mockClear()
    mockUseScheduling.mockReturnValue(agendamento())
  })

  it('exibe o profissional escolhido', () => {
    render(<Summary />)

    expect(screen.getByText('Marcão Machadada')).toBeInTheDocument()
  })

  it('lista os serviços escolhidos', () => {
    render(<Summary />)

    expect(screen.getByText('Corte Viking')).toBeInTheDocument()
  })

  it('exibe duração e valor total', () => {
    render(<Summary />)

    expect(screen.getByText('0h 45m')).toBeInTheDocument()
    expect(screen.getByText(/55/)).toBeInTheDocument()
  })

  it('habilita o botão de finalizar', () => {
    render(<Summary />)

    expect(
      screen.getByRole('button', { name: /finalizar agendamento/i }),
    ).toBeEnabled()
  })

  it('efetiva o agendamento ao clicar em finalizar', async () => {
    render(<Summary />)

    await userEvent.click(
      screen.getByRole('button', { name: /finalizar agendamento/i }),
    )

    expect(schedule).toHaveBeenCalledTimes(1)
  })

  // BUG CONHECIDO — o push é para '/scheduling/sucess' (um "c"), enquanto a
  // rota existente é '/scheduling/success'. O usuário conclui o agendamento e
  // cai num 404.
  it.failing('leva para a página de sucesso após agendar', async () => {
    render(<Summary />)

    await userEvent.click(
      screen.getByRole('button', { name: /finalizar agendamento/i }),
    )

    expect(global.mocksDeNavegacao.push).toHaveBeenCalledWith(
      '/scheduling/success',
    )
  })

  it('documenta o comportamento atual: navega para a rota com typo', async () => {
    render(<Summary />)

    await userEvent.click(
      screen.getByRole('button', { name: /finalizar agendamento/i }),
    )

    expect(global.mocksDeNavegacao.push).toHaveBeenCalledWith(
      '/scheduling/sucess',
    )
  })
})

describe('Summary — horário fora do expediente', () => {
  it('bloqueia finalização antes das 8h', () => {
    mockUseScheduling.mockReturnValue(
      agendamento({ date: new Date(2026, 7, 5, 6, 0) }),
    )
    render(<Summary />)

    expect(
      screen.getByRole('button', { name: /finalizar agendamento/i }),
    ).toBeDisabled()
  })

  it('bloqueia finalização depois das 21h', () => {
    mockUseScheduling.mockReturnValue(
      agendamento({ date: new Date(2026, 7, 5, 22, 0) }),
    )
    render(<Summary />)

    expect(
      screen.getByRole('button', { name: /finalizar agendamento/i }),
    ).toBeDisabled()
  })
})
