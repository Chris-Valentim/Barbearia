import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Controller('service')
export class ServiceController {

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  searchAll() {
    return this.prisma.service.findMany()
  }
}
