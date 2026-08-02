import { Scheduling } from '@barba/contracts'
import { RepositoryScheduling } from './scheduling.repository'
import { PrismaService } from '../db/prisma.service'

describe('RepositoryScheduling', () => {
  let prisma: { scheduling: { create: jest.Mock; findMany: jest.Mock } }
  let repo: RepositoryScheduling

  beforeEach(() => {
    prisma = {
      scheduling: {
        create: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([]),
      },
    }
    repo = new RepositoryScheduling(prisma as unknown as PrismaService)
  })

  describe('create', () => {
    const novo: Scheduling = {
      id: 0,
      emailClient: 'cliente@barba.com',
      date: new Date(2026, 7, 5, 14, 0),
      professional: { id: 3 } as Scheduling['professional'],
      services: [{ id: 1 }, { id: 2 }] as Scheduling['services'],
    }

    it('envia o payload sob a chave `data` do Prisma', async () => {
      await repo.create(novo)

      const [argumento] = prisma.scheduling.create.mock.calls[0]
      expect(argumento).toHaveProperty('data')
    })

    it('grava e-mail e data do agendamento', async () => {
      await repo.create(novo)

      const [{ data }] = prisma.scheduling.create.mock.calls[0]
      expect(data.emailClient).toBe('cliente@barba.com')
      expect(data.date).toEqual(novo.date)
    })

    it('conecta o profissional pelo id em vez de recriá-lo', async () => {
      await repo.create(novo)

      const [{ data }] = prisma.scheduling.create.mock.calls[0]
      expect(data.professional).toEqual({ connect: { id: 3 } })
    })

    it('conecta todos os serviços selecionados', async () => {
      await repo.create(novo)

      const [{ data }] = prisma.scheduling.create.mock.calls[0]
      expect(data.services).toEqual({ connect: [{ id: 1 }, { id: 2 }] })
    })
  })

  describe('searchByEmail', () => {
    it('filtra pelo e-mail informado', async () => {
      await repo.searchByEmail('cliente@barba.com')

      const [{ where }] = prisma.scheduling.findMany.mock.calls[0]
      expect(where.emailClient).toBe('cliente@barba.com')
    })

    it('traz apenas agendamentos futuros', async () => {
      await repo.searchByEmail('cliente@barba.com')

      const [{ where }] = prisma.scheduling.findMany.mock.calls[0]
      expect(where.date.gte).toBeInstanceOf(Date)
    })

    it('inclui serviços e profissional', async () => {
      await repo.searchByEmail('cliente@barba.com')

      const [{ include }] = prisma.scheduling.findMany.mock.calls[0]
      expect(include).toEqual({ services: true, professional: true })
    })
  })

  describe('searchByProfessionalAndDate', () => {
    it('filtra pelo id do profissional', async () => {
      await repo.searchByProfessionalAndDate(7, new Date(2026, 7, 5))

      const [{ where }] = prisma.scheduling.findMany.mock.calls[0]
      expect(where.professionalId).toBe(7)
    })

    it('monta uma janela de um dia inteiro', async () => {
      await repo.searchByProfessionalAndDate(1, new Date(2026, 7, 5))

      const [{ where }] = prisma.scheduling.findMany.mock.calls[0]
      expect(where.date.gte.getHours()).toBe(0)
      expect(where.date.lte.getHours()).toBe(23)
      expect(where.date.lte.getMinutes()).toBe(59)
    })

    it('inclui os serviços, necessários para contar os slots', async () => {
      await repo.searchByProfessionalAndDate(1, new Date(2026, 7, 5))

      const [{ include }] = prisma.scheduling.findMany.mock.calls[0]
      expect(include).toEqual({ services: true })
    })

    // BUG CONHECIDO — o código usa date.getUTCDay(), que devolve o dia da
    // SEMANA (0–6), onde deveria usar getUTCDate(), o dia do mês. Com isso a
    // janela de busca aponta para um dia arbitrário entre 1 e 6.
    //
    // Reproduzido em execução real: um agendamento gravado em 05/08/2026 só
    // é encontrado ao consultar 07/08, porque 07/08 é sexta-feira e
    // getUTCDay() devolve 5.
    //
    // it.failing passa enquanto o bug existir e falha assim que for
    // corrigido — momento de trocar por it() comum.
    it.failing('busca no dia do mês solicitado', async () => {
      await repo.searchByProfessionalAndDate(1, new Date(Date.UTC(2026, 7, 5)))

      const [{ where }] = prisma.scheduling.findMany.mock.calls[0]
      expect(where.date.gte.getDate()).toBe(5)
      expect(where.date.lte.getDate()).toBe(5)
    })

    it('documenta o comportamento atual: usa o dia da semana como dia do mês', async () => {
      // 05/08/2026 é quarta-feira → getUTCDay() = 3
      await repo.searchByProfessionalAndDate(1, new Date(Date.UTC(2026, 7, 5)))

      const [{ where }] = prisma.scheduling.findMany.mock.calls[0]
      expect(where.date.gte.getDate()).toBe(3)
    })
  })
})
