import { Injectable } from "@nestjs/common";
import  CalendarRepository from '@barba/core/src/scheduling/CalendarRepository'; 
import Scheduling from "@barba/core/src/scheduling/scheduling";
import { PrismaService } from "src/db/prisma.service";

@Injectable()
export class RepositoryScheduling implements CalendarRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(scheduling: Scheduling): Promise<void> {
    await this.prismaService.scheduling.create({
      date: {
        date: scheduling.date,
        emailClient: scheduling.emailClient, 
        professional: { connect: { id: scheduling.professional.id}},
        services: {
          connect: scheduling.services.map((service) => ({ id: service.id }))
        }
      }
    })
  }

  async searchByEmail(email: string): Promise<Scheduling[]> {
    return this.prismaService.scheduling.findMany({
      where: {
        emailClient: email,
        date: {
          gte: new Date(),
        },
      },
      include: {
        services: true,
        professional: true,
      },
      orderBy: {
        date: 'desc'
      }
    })
  }

  async searchByProfessionalAndDate(
    professional: number,
    date: Date,
  ): Promise<Scheduling[]> {
    const year = date.getFullYear()
    const month = date.getUTCMonth()
    const day = date.getUTCDay()

    const startDay = new Date(year, month, day, 0, 0, 0)
    const endDay = new Date(year, month, day, 23, 59, 59)

    const result: any = await this.prismaService.scheduling.findMany({
      where: {
        professionalId: professional,
        date: {
          gte: startDay,
          lte: endDay,
        }
      },
      include: { services: true }
    }) 
    return result
  }
}
