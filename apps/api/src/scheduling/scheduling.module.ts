import { Module } from "@nestjs/common";
import { SchedulingController } from './scheduling.controller'
import { RepositoryScheduling } from "./scheduling.repository";
import { DbModule } from "src/db/db.module";

@Module({
  imports: [DbModule],
  controllers: [SchedulingController],
  providers: [RepositoryScheduling],
})
export class ModuleScheduling {}