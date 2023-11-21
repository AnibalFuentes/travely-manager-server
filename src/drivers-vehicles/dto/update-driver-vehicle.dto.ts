import { PartialType } from '@nestjs/swagger';
import { CreateDriverVehicleDto as CreateDriverVehicleDto } from './create-driver-vehicle.dto';

export class UpdateDriverVehicleDto extends PartialType(
  CreateDriverVehicleDto,
) {}
