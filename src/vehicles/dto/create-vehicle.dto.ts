import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Número de la tarjeta de registro del vehículo.',
    example: 'AB123CD',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  registrationCard?: string;

  @ApiProperty({
    description: 'Número de matrícula del vehículo.',
    example: 'XYZ789',
  })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({
    description: 'Nombre del modelo del vehículo.',
    example: 'Transit 2022',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  model?: string;

  @ApiProperty({
    description: 'Número de motor del vehículo.',
    example: 'E123456789CAR4D',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  engineNumber?: string;

  @ApiProperty({
    description: 'Año de fabricación del vehículo.',
    example: 2020,
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  manufacturingYear?: number;

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
