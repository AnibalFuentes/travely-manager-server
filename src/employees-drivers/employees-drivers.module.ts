import { Module } from '@nestjs/common';
import { EmployeesDriversService } from './employees-drivers.service';
import { EmployeesDriversController } from './employees-drivers.controller';

@Module({
  controllers: [EmployeesDriversController],
  providers: [EmployeesDriversService],
})
export class EmployeesDriversModule {}
