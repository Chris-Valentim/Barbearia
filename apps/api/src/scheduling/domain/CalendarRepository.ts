import { Scheduling } from '@barba/contracts'

/**
 * Porta de saída do domínio de agendamento. A implementação concreta vive em
 * scheduling.repository.ts, que conhece o Prisma — o domínio não.
 */
export default interface CalendarRepository {
  create(scheduling: Scheduling): Promise<void>
  searchByEmail(email: string): Promise<Scheduling[]>
  searchByProfessionalAndDate(
    professional: number,
    date: Date,
  ): Promise<Scheduling[]>
}
