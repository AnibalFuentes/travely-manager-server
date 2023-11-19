import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateOfficeDto {
  @ApiProperty({
    description: 'Nombre de la oficina.',
    example: 'Oficina Principal',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Dirección de la oficina',
    example: '123 Main Street, Cityville',
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'ID de la ubicación asociada a la oficina',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsUUID()
  @IsNotEmpty()
  locationId: string;

  @ApiProperty({
    description: 'Indica si la oficina está activa o no.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
