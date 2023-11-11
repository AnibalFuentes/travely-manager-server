import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeesChiefsService } from './employees-chiefs.service';
import { CreateEmployeesChiefDto } from './dto/create-employees-chief.dto';
import { UpdateEmployeesChiefDto } from './dto/update-employees-chief.dto';

@Controller('employees-chiefs')
export class EmployeesChiefsController {
  constructor(private readonly employeesChiefsService: EmployeesChiefsService) {}

  @Post()
  create(@Body() createEmployeesChiefDto: CreateEmployeesChiefDto) {
    return this.employeesChiefsService.create(createEmployeesChiefDto);
  }

  @Get()
  findAll() {
    return this.employeesChiefsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesChiefsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeesChiefDto: UpdateEmployeesChiefDto) {
    return this.employeesChiefsService.update(+id, updateEmployeesChiefDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesChiefsService.remove(+id);
  }
}
