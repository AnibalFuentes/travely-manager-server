import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Número de matrícula del vehículo.',
    example: 'XYZ789',
  })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({
    description: 'Referencia del vehículo.',
    example: 'Corolla',
  })
  @IsString()
  @IsNotEmpty()
  reference?: string;

  @ApiProperty({
    description: 'Nombre del modelo del vehículo.',
    example: '2022',
  })
  @IsString()
  @IsNotEmpty()
  model?: string;

  @ApiProperty({ example: 'Autobus', description: 'tipo de vehículo' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Identificador único de la marca del vehículo.',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsUUID()
  brandId?: string;
}
