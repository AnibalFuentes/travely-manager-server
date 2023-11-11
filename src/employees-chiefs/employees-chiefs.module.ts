import { Module } from '@nestjs/common';
import { EmployeesChiefsService } from './employees-chiefs.service';
import { EmployeesChiefsController } from './employees-chiefs.controller';

@Module({
  controllers: [EmployeesChiefsController],
  providers: [EmployeesChiefsService],
})
export class EmployeesChiefsModule {}
