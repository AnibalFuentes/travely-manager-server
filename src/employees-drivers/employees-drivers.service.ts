import { Injectable } from '@nestjs/common';
import { CreateEmployeesDriverDto } from './dto/create-employees-driver.dto';
import { UpdateEmployeesDriverDto } from './dto/update-employees-driver.dto';

@Injectable()
export class EmployeesDriversService {
  create(createEmployeesDriverDto: CreateEmployeesDriverDto) {
    return 'This action adds a new employeesDriver';
  }

  findAll() {
    return `This action returns all employeesDrivers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employeesDriver`;
  }

  update(id: number, updateEmployeesDriverDto: UpdateEmployeesDriverDto) {
    return `This action updates a #${id} employeesDriver`;
  }

  remove(id: number) {
    return `This action removes a #${id} employeesDriver`;
  }
}
