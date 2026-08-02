import { render, screen } from '@testing-library/react-native'
import { Scheduling } from '@barba/contracts'
import SchedulingItem from './SchedulingItem'

function agendamento(overrides: Partial<Scheduling> = {}): Scheduling {
  return {
    id: 1,
    emailClient: 'chris@barba.com',
    date: new Date(2026, 7, 5, 14, 30),
    professional: { id: 1, name: 'Marcão Machadada' },
    services: [
      { id: 1, name: 'Corte Viking', price: 55 },
      { id: 2, name: 'Barba de Lenhador', price: 45 },
    ],
    ...overrides,
  } as Scheduling
}

describe('SchedulingItem', () => {
  it('exibe o nome do profissional', () => {
    render(<SchedulingItem scheduling={agendamento()} />)

    expect(screen.getByText('Marcão Machadada')).toBeOnTheScreen()
  })

  it('usa "Não informado" quando o profissional não tem nome', () => {
    render(
      <SchedulingItem
        scheduling={agendamento({
          professional: { id: 1, name: '' } as Scheduling['professional'],
        })}
      />,
    )

    expect(screen.getByText('Não informado')).toBeOnTheScreen()
  })

  it('soma o preço de todos os serviços', () => {
    render(<SchedulingItem scheduling={agendamento()} />)

    expect(screen.getByText('R$ 100,00')).toBeOnTheScreen()
  })

  it('mostra zero quando não há serviços', () => {
    render(<SchedulingItem scheduling={agendamento({ services: [] })} />)

    expect(screen.getByText('R$ 0,00')).toBeOnTheScreen()
  })

  it('numera os serviços na listagem', () => {
    render(<SchedulingItem scheduling={agendamento()} />)

    expect(
      screen.getByText('1. Corte Viking, 2. Barba de Lenhador'),
    ).toBeOnTheScreen()
  })

  it('formata data e hora em pt-BR', () => {
    render(<SchedulingItem scheduling={agendamento()} />)

    expect(screen.getByText(/5 de agosto de 2026/)).toBeOnTheScreen()
    expect(screen.getByText(/14:30h/)).toBeOnTheScreen()
  })

  it('preenche a hora com zero à esquerda', () => {
    render(
      <SchedulingItem
        scheduling={agendamento({ date: new Date(2026, 7, 5, 8, 5) })}
      />,
    )

    expect(screen.getByText(/08:05h/)).toBeOnTheScreen()
  })

  it('aceita data serializada como string vinda da API', () => {
    render(
      <SchedulingItem
        scheduling={agendamento({
          date: '2026-08-05T14:30:00.000Z' as unknown as Date,
        })}
      />,
    )

    expect(screen.getByText(/agosto de 2026/)).toBeOnTheScreen()
  })
})
