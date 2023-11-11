import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssignVehiclesService } from './assign-vehicles.service';
import { CreateAssignVehicleDto } from './dto/create-assign-vehicle.dto';
import { UpdateAssignVehicleDto } from './dto/update-assign-vehicle.dto';

@Controller('assign-vehicles')
export class AssignVehiclesController {
  constructor(private readonly assignVehiclesService: AssignVehiclesService) {}

  @Post()
  create(@Body() createAssignVehicleDto: CreateAssignVehicleDto) {
    return this.assignVehiclesService.create(createAssignVehicleDto);
  }

  @Get()
  findAll() {
    return this.assignVehiclesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignVehiclesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssignVehicleDto: UpdateAssignVehicleDto) {
    return this.assignVehiclesService.update(+id, updateAssignVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignVehiclesService.remove(+id);
  }
}
