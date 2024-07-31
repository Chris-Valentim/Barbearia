import { TIME_SLOT } from '../constants'
import CalendarRepository from './CalendarRepository'
 
export default class GetBusySchedules {
  constructor(private readonly repo: CalendarRepository) {}

  async execute(professionalId: number, date: Date): Promise<string[]> {
    const schedules = await this.repo.searchByProfessionalAndDate(professionalId, date)
    const data = schedules
      .map((schedules) => {
        return {
          date: schedules.date,
          slots: schedules.services.reduce((total, s) => total + s.slotsAmount, 0),
        }
      })
      .reduce((busySchedules: Date[], data: any) => {
        const time = data.date
        const slots = data.slots
        const schedules = Array.from({ length: slots }, (_, i) =>
          this.addMinutes(time, i * TIME_SLOT)
        )
        return [...busySchedules, ...schedules]
      }, [])
      .map((d) => d.toTimeString().slice(0, 5))

    return data 
  }

  private addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000)
  }
}