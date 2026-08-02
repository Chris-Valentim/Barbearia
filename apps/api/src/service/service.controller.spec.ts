import { Test, TestingModule } from '@nestjs/testing'
import { ServiceController } from './service.controller'
import { PrismaService } from '../db/prisma.service'

describe('ServiceController', () => {
  let controller: ServiceController
  let prisma: { service: { findMany: jest.Mock } }

  beforeEach(async () => {
    prisma = { service: { findMany: jest.fn().mockResolvedValue([]) } }

    const modulo: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile()

    controller = modulo.get(ServiceController)
  })

  it('é instanciado pelo container do Nest', () => {
    expect(controller).toBeDefined()
  })

  it('consulta todos os serviços', async () => {
    await controller.searchAll()

    expect(prisma.service.findMany).toHaveBeenCalledTimes(1)
  })

  it('devolve os serviços encontrados', async () => {
    const servicos = [
      { id: 1, name: 'Corte Viking', price: 55, slotsAmount: 3 },
      { id: 2, name: 'Barba de Lenhador', price: 45, slotsAmount: 2 },
    ]
    prisma.service.findMany.mockResolvedValue(servicos)

    expect(await controller.searchAll()).toEqual(servicos)
  })

  it('devolve lista vazia quando não há serviços cadastrados', async () => {
    expect(await controller.searchAll()).toEqual([])
  })
})
