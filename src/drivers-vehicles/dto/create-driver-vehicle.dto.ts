import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateDriverVehicleDto {
  @ApiProperty({
    description: 'ID del vehículo asignado.',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsUUID()
  vehicleId: string;

  @ApiProperty({
    description: 'ID del conductor asignado al vehículo.',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsUUID()
  driverId: string;
}
