import { Module } from '@nestjs/common';
import { EmployeesOfficesService } from './employees-offices.service';
import { EmployeesOfficesController } from './employees-offices.controller';

@Module({
  controllers: [EmployeesOfficesController],
  providers: [EmployeesOfficesService],
})
export class EmployeesOfficesModule {}
