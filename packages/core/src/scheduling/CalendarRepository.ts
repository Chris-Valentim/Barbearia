import Scheduling from "./scheduling";

export default interface CalendarRepository {
  create(scheduling: Scheduling): Promise<void>
  searchByEmail(email: string): Promise<Scheduling[]>
  searchByProfessionalAndDate(professional: number, date: Date) : Promise<Scheduling[]>
}