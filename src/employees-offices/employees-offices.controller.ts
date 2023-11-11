import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeesOfficesService } from './employees-offices.service';
import { CreateEmployeesOfficeDto } from './dto/create-employees-office.dto';
import { UpdateEmployeesOfficeDto } from './dto/update-employees-office.dto';

@Controller('employees-offices')
export class EmployeesOfficesController {
  constructor(private readonly employeesOfficesService: EmployeesOfficesService) {}

  @Post()
  create(@Body() createEmployeesOfficeDto: CreateEmployeesOfficeDto) {
    return this.employeesOfficesService.create(createEmployeesOfficeDto);
  }

  @Get()
  findAll() {
    return this.employeesOfficesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesOfficesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeesOfficeDto: UpdateEmployeesOfficeDto) {
    return this.employeesOfficesService.update(+id, updateEmployeesOfficeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesOfficesService.remove(+id);
  }
}
