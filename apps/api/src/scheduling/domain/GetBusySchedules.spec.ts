import { Scheduling } from '@barba/contracts'
import GetBusySchedules from './GetBusySchedules'
import CalendarRepository from './CalendarRepository'

/** Repositório em memória — o caso de uso não deve conhecer Prisma. */
class RepositorioFake implements CalendarRepository {
  constructor(private readonly agendamentos: Scheduling[] = []) {}

  create = jest.fn(async () => undefined)
  searchByEmail = jest.fn(async () => this.agendamentos)
  searchByProfessionalAndDate = jest.fn(async () => this.agendamentos)
}

function agendamento(hora: Date, slots: number[]): Scheduling {
  return {
    id: 1,
    emailClient: 'cliente@barba.com',
    date: hora,
    professional: { id: 1 } as Scheduling['professional'],
    services: slots.map((slotsAmount, i) => ({
      id: i + 1,
      slotsAmount,
    })) as Scheduling['services'],
  }
}

describe('GetBusySchedules', () => {
  it('devolve lista vazia quando não há agendamentos', async () => {
    const casoDeUso = new GetBusySchedules(new RepositorioFake([]))

    expect(await casoDeUso.execute(1, new Date(2026, 7, 5))).toEqual([])
  })

  it('expande um serviço de 1 slot em um único horário', async () => {
    const repo = new RepositorioFake([
      agendamento(new Date(2026, 7, 5, 14, 0), [1]),
    ])
    const casoDeUso = new GetBusySchedules(repo)

    expect(await casoDeUso.execute(1, new Date(2026, 7, 5))).toEqual(['14:00'])
  })

  it('expande um serviço de 3 slots em três horários de 15 em 15 minutos', async () => {
    const repo = new RepositorioFake([
      agendamento(new Date(2026, 7, 5, 14, 0), [3]),
    ])
    const casoDeUso = new GetBusySchedules(repo)

    expect(await casoDeUso.execute(1, new Date(2026, 7, 5))).toEqual([
      '14:00',
      '14:15',
      '14:30',
    ])
  })

  it('soma os slots de vários serviços no mesmo agendamento', async () => {
    const repo = new RepositorioFake([
      agendamento(new Date(2026, 7, 5, 9, 0), [2, 2]),
    ])
    const casoDeUso = new GetBusySchedules(repo)

    expect(await casoDeUso.execute(1, new Date(2026, 7, 5))).toEqual([
      '09:00',
      '09:15',
      '09:30',
      '09:45',
    ])
  })

  it('atravessa a virada de hora corretamente', async () => {
    const repo = new RepositorioFake([
      agendamento(new Date(2026, 7, 5, 10, 45), [2]),
    ])
    const casoDeUso = new GetBusySchedules(repo)

    expect(await casoDeUso.execute(1, new Date(2026, 7, 5))).toEqual([
      '10:45',
      '11:00',
    ])
  })

  it('acumula horários de agendamentos distintos', async () => {
    const repo = new RepositorioFake([
      agendamento(new Date(2026, 7, 5, 8, 0), [1]),
      agendamento(new Date(2026, 7, 5, 18, 30), [2]),
    ])
    const casoDeUso = new GetBusySchedules(repo)

    expect(await casoDeUso.execute(1, new Date(2026, 7, 5))).toEqual([
      '08:00',
      '18:30',
      '18:45',
    ])
  })

  it('repassa profissional e data ao repositório', async () => {
    const repo = new RepositorioFake([])
    const data = new Date(2026, 7, 5)

    await new GetBusySchedules(repo).execute(7, data)

    expect(repo.searchByProfessionalAndDate).toHaveBeenCalledWith(7, data)
  })

  it('sempre devolve horários no formato HH:MM', async () => {
    const repo = new RepositorioFake([
      agendamento(new Date(2026, 7, 5, 8, 0), [4]),
    ])

    const horarios = await new GetBusySchedules(repo).execute(1, new Date())

    horarios.forEach((h) => expect(h).toMatch(/^\d{2}:\d{2}$/))
  })
})
