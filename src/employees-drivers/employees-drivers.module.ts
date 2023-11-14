import { Module } from '@nestjs/common';
import { EmployeesDriversService } from './employees-drivers.service';
import { EmployeesDriversController } from './employees-drivers.controller';
import { EmployeesModule } from 'src/employees/employees.module';
import { EmployeeDriver } from './entities/employee-driver.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [EmployeesDriversController],
  providers: [EmployeesDriversService],
  imports: [TypeOrmModule.forFeature([EmployeeDriver]), EmployeesModule],
})
export class EmployeesDriversModule {}
