import { Module } from '@nestjs/common';
import { EmployeesChiefsService } from './employees-chiefs.service';
import { EmployeesChiefsController } from './employees-chiefs.controller';
import { EmployeesModule } from 'src/employees/employees.module';
import { EmployeeChief } from './entities/employees-chief.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [EmployeesChiefsController],
  providers: [EmployeesChiefsService],
  exports: [EmployeesChiefsService],
  imports: [TypeOrmModule.forFeature([EmployeeChief]), EmployeesModule],
})
export class EmployeesChiefsModule {}
