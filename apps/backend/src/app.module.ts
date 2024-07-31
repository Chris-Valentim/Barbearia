import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ServiceModule } from './service/service.module';
import { ModuleScheduling } from './scheduling/scheduling.module'

@Module({
  imports: [DbModule, ServiceModule, ModuleScheduling],
  controllers: [],
  providers: [],
})
export class AppModule {}
