import { Module } from '@nestjs/common';
import { EmployeesOfficesService } from './employees-offices.service';
import { EmployeesOfficesController } from './employees-offices.controller';
import { EmployeeOffice } from './entities/employee-office.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { OfficesModule } from 'src/offices/offices.module';

@Module({
  controllers: [EmployeesOfficesController],
  providers: [EmployeesOfficesService],
  exports: [EmployeesOfficesService],
  imports: [
    TypeOrmModule.forFeature([EmployeeOffice]),
    UsersModule,
    OfficesModule,
    EmployeesModule,
  ],
})
export class EmployeesOfficesModule {}
