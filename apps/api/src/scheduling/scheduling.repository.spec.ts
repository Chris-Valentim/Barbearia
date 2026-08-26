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

    // Regressão do bug do getUTCDay(): a função usava o dia da SEMANA (0–6)
    // como se fosse o dia do mês. Reproduzido em execução real — um
    // agendamento gravado em 05/08/2026 só era encontrado ao consultar 07/08,
    // porque 07/08 é sexta-feira e getUTCDay() devolve 5.
    it('busca no dia do mês solicitado', async () => {
      await repo.searchByProfessionalAndDate(1, new Date(Date.UTC(2026, 7, 5)))

      const [{ where }] = prisma.scheduling.findMany.mock.calls[0]
      expect(where.date.gte.getDate()).toBe(5)
      expect(where.date.lte.getDate()).toBe(5)
    })

    it('funciona com a data no formato que chega da rota', async () => {
      // O controller faz new Date("2026-08-05"), que é meia-noite UTC.
      await repo.searchByProfessionalAndDate(1, new Date('2026-08-05'))

      const [{ where }] = prisma.scheduling.findMany.mock.calls[0]
      expect(where.date.gte.getDate()).toBe(5)
      expect(where.date.gte.getMonth()).toBe(7)
      expect(where.date.gte.getFullYear()).toBe(2026)
    })

    it('não erra o ano na virada, mesmo em fuso negativo', async () => {
      // Com getFullYear() local sobre uma data UTC de 1º de janeiro, o ano
      // resolvia para o anterior em qualquer fuso a oeste de Greenwich.
      await repo.searchByProfessionalAndDate(1, new Date('2027-01-01'))

      const [{ where }] = prisma.scheduling.findMany.mock.calls[0]
      expect(where.date.gte.getFullYear()).toBe(2027)
      expect(where.date.gte.getMonth()).toBe(0)
      expect(where.date.gte.getDate()).toBe(1)
    })

    it('cobre o último milissegundo do dia', async () => {
      await repo.searchByProfessionalAndDate(1, new Date('2026-08-05'))

      const [{ where }] = prisma.scheduling.findMany.mock.calls[0]
      expect(where.date.lte.getMilliseconds()).toBe(999)
    })

    it('cobre todos os dias do mês, não só de 1 a 6', async () => {
      // getUTCDay() só devolve 0–6, então dias 7 a 31 eram inalcançáveis.
      for (const dia of [7, 15, 28, 31]) {
        prisma.scheduling.findMany.mockClear()
        const iso = `2026-01-${String(dia).padStart(2, '0')}`

        await repo.searchByProfessionalAndDate(1, new Date(iso))

        const [{ where }] = prisma.scheduling.findMany.mock.calls[0]
        expect(where.date.gte.getDate()).toBe(dia)
      }
    })
  })
})
