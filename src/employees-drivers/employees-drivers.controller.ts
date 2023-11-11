import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeesDriversService } from './employees-drivers.service';
import { CreateEmployeesDriverDto } from './dto/create-employees-driver.dto';
import { UpdateEmployeesDriverDto } from './dto/update-employees-driver.dto';

@Controller('employees-drivers')
export class EmployeesDriversController {
  constructor(private readonly employeesDriversService: EmployeesDriversService) {}

  @Post()
  create(@Body() createEmployeesDriverDto: CreateEmployeesDriverDto) {
    return this.employeesDriversService.create(createEmployeesDriverDto);
  }

  @Get()
  findAll() {
    return this.employeesDriversService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesDriversService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeesDriverDto: UpdateEmployeesDriverDto) {
    return this.employeesDriversService.update(+id, updateEmployeesDriverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesDriversService.remove(+id);
  }
}
