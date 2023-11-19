import { Module } from '@nestjs/common';
import { EmployeesAdminsService } from './employees-admins.service';
import { EmployeesAdminsController } from './employees-admins.controller';
import { EmployeeAdmin } from './entities/employees-admin.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [EmployeesAdminsController],
  providers: [EmployeesAdminsService],
  imports: [TypeOrmModule.forFeature([EmployeeAdmin]), EmployeesModule],
})
export class EmployeesAdminsModule {}
