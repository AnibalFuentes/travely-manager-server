import { Module } from '@nestjs/common';
import { EmployeesSellersService } from './employees-sellers.service';
import { EmployeesSellersController } from './employees-sellers.controller';
import { EmployeeSeller } from './entities/employee-seller.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [EmployeesSellersController],
  providers: [EmployeesSellersService],
  imports: [TypeOrmModule.forFeature([EmployeeSeller]), EmployeesModule],
})
export class EmployeesSellersModule {}
