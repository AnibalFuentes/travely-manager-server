import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateAssignVehicleDto {
  @ApiProperty({
    description: 'ID del vehículo asignado.',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsUUID()
  vehicleId: string;

  @ApiProperty({
    description: 'ID del conductor principal asignado al vehículo.',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsUUID()
  driverOneId: string;

  @ApiProperty({
    description: 'ID del conductor secundario asignado al vehículo.',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  driverTwoId?: string;
}
