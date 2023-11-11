import { Injectable } from '@nestjs/common';
import { CreateAssignVehicleDto } from './dto/create-assign-vehicle.dto';
import { UpdateAssignVehicleDto } from './dto/update-assign-vehicle.dto';

@Injectable()
export class AssignVehiclesService {
  create(createAssignVehicleDto: CreateAssignVehicleDto) {
    return 'This action adds a new assignVehicle';
  }

  findAll() {
    return `This action returns all assignVehicles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assignVehicle`;
  }

  update(id: number, updateAssignVehicleDto: UpdateAssignVehicleDto) {
    return `This action updates a #${id} assignVehicle`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignVehicle`;
  }
}
