import { Injectable } from '@nestjs/common';
import { CreateEmployeesChiefDto } from './dto/create-employees-chief.dto';
import { UpdateEmployeesChiefDto } from './dto/update-employees-chief.dto';

@Injectable()
export class EmployeesChiefsService {
  create(createEmployeesChiefDto: CreateEmployeesChiefDto) {
    return 'This action adds a new employeesChief';
  }

  findAll() {
    return `This action returns all employeesChiefs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employeesChief`;
  }

  update(id: number, updateEmployeesChiefDto: UpdateEmployeesChiefDto) {
    return `This action updates a #${id} employeesChief`;
  }

  remove(id: number) {
    return `This action removes a #${id} employeesChief`;
  }
}
