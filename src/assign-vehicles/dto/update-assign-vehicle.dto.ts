import { PartialType } from '@nestjs/swagger';
import { CreateAssignVehicleDto } from './create-assign-vehicle.dto';

export class UpdateAssignVehicleDto extends PartialType(CreateAssignVehicleDto) {}
