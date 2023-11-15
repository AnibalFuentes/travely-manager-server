import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { PeopleModule } from 'src/people/people.module';

@Module({
  controllers: [],
  providers: [EmployeesService],
  exports: [EmployeesService],
  imports: [TypeOrmModule.forFeature([Employee]), PeopleModule],
})
export class EmployeesModule {}
