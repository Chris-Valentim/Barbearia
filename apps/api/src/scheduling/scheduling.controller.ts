import Scheduling from "@barba/core/src/scheduling/scheduling";
import GetBusySchedules from '@barba/core/src/scheduling/GetBusySchedules'
import { RepositoryScheduling } from './scheduling.repository'
import { Body, Controller, Get, Param, Post } from "@nestjs/common";

@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly repo: RepositoryScheduling) {}

  @Post()
  create(@Body() scheduling: Scheduling) {
    return this.repo.create(scheduling)
  }

  @Get(':email')
  searchByEmail(@Param('email') email: string) {
    return this.repo.searchByEmail(email)
  }

  @Get('occupation/:professional/:date')
  searchOccupationByProfessionalAndDate(
    @Param('professional') professional: string,
    @Param('date') dateParams: string,
  ) {
    const useCase = new GetBusySchedules(this.repo)
    return useCase.execute(+professional, new Date(dateParams))
  }
}