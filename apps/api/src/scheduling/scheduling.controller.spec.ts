import { Test, TestingModule } from '@nestjs/testing'
import { Scheduling } from '@barba/contracts'
import { SchedulingController } from './scheduling.controller'
import { RepositoryScheduling } from './scheduling.repository'

describe('SchedulingController', () => {
  let controller: SchedulingController
  let repo: jest.Mocked<Partial<RepositoryScheduling>>

  beforeEach(async () => {
    repo = {
      create: jest.fn().mockResolvedValue(undefined),
      searchByEmail: jest.fn().mockResolvedValue([]),
      searchByProfessionalAndDate: jest.fn().mockResolvedValue([]),
    }

    const modulo: TestingModule = await Test.createTestingModule({
      controllers: [SchedulingController],
      providers: [{ provide: RepositoryScheduling, useValue: repo }],
    }).compile()

    controller = modulo.get(SchedulingController)
  })

  it('é instanciado pelo container do Nest', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('delega o agendamento ao repositório', async () => {
      const novo = { emailClient: 'cliente@barba.com' } as Scheduling

      await controller.create(novo)

      expect(repo.create).toHaveBeenCalledWith(novo)
      expect(repo.create).toHaveBeenCalledTimes(1)
    })
  })

  describe('searchByEmail', () => {
    it('repassa o e-mail recebido na rota', async () => {
      await controller.searchByEmail('cliente@barba.com')

      expect(repo.searchByEmail).toHaveBeenCalledWith('cliente@barba.com')
    })

    it('devolve o que o repositório retornar', async () => {
      const esperado = [{ id: 1 }] as Scheduling[]
      repo.searchByEmail.mockResolvedValue(esperado)

      expect(await controller.searchByEmail('a@b.com')).toBe(esperado)
    })
  })

  describe('searchBusySchedules', () => {
    it('converte o id do profissional de string para número', async () => {
      await controller.searchBusySchedules('7', '2026-08-05')

      const [idRecebido] = repo.searchByProfessionalAndDate.mock.calls[0]
      expect(idRecebido).toBe(7)
      expect(typeof idRecebido).toBe('number')
    })

    it('converte a data da rota em Date', async () => {
      await controller.searchBusySchedules('1', '2026-08-05')

      const [, dataRecebida] = repo.searchByProfessionalAndDate.mock.calls[0]
      expect(dataRecebida).toBeInstanceOf(Date)
      expect((dataRecebida as Date).toISOString()).toContain('2026-08-05')
    })

    it('devolve lista vazia quando não há ocupação', async () => {
      const resultado = await controller.searchBusySchedules(
        '1',
        '2026-08-05',
      )

      expect(resultado).toEqual([])
    })

    it('expande os slots dos agendamentos encontrados', async () => {
      repo.searchByProfessionalAndDate.mockResolvedValue([
        {
          id: 1,
          emailClient: 'c@b.com',
          date: new Date(2026, 7, 5, 15, 0),
          professional: { id: 1 },
          services: [{ id: 1, slotsAmount: 2 }],
        } as Scheduling,
      ])

      const resultado = await controller.searchBusySchedules(
        '1',
        '2026-08-05',
      )

      expect(resultado).toEqual(['15:00', '15:15'])
    })
  })
})
