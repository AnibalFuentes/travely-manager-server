import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    description: 'Departamento de la ubicación.',
    example: 'Cundinamarca',
  })
  @IsNotEmpty()
  @IsString()
  department: string;

  @ApiProperty({
    description: 'Ciudad de la ubicación.',
    example: 'Bogotá',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Coordenada de latitud de la ubicación.',
    example: 4.7111,
  })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Coordenada de longitud de la ubicación.',
    example: -74.0722,
  })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
