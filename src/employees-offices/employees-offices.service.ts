import { Injectable } from '@nestjs/common';
import { CreateEmployeesOfficeDto } from './dto/create-employees-office.dto';
import { UpdateEmployeesOfficeDto } from './dto/update-employees-office.dto';

@Injectable()
export class EmployeesOfficesService {
  create(createEmployeesOfficeDto: CreateEmployeesOfficeDto) {
    return 'This action adds a new employeesOffice';
  }

  findAll() {
    return `This action returns all employeesOffices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employeesOffice`;
  }

  update(id: number, updateEmployeesOfficeDto: UpdateEmployeesOfficeDto) {
    return `This action updates a #${id} employeesOffice`;
  }

  remove(id: number) {
    return `This action removes a #${id} employeesOffice`;
  }
}
