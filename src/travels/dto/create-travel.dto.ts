import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumber, IsEnum, IsDate } from 'class-validator';
import { TravelStatus } from 'src/common/enums';

export class CreateTravelDto {
  @ApiProperty({
    description: 'Ubicación de origen del viaje (ID)',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsNotEmpty()
  @IsUUID()
  origin: string;

  @ApiProperty({
    description: 'Ubicación de destino del viaje (ID)',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsNotEmpty()
  @IsUUID()
  destination: string;

  @ApiProperty({
    description: 'Vehículo asignado al viaje (ID)',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsNotEmpty()
  @IsUUID()
  assignVehicle: string;

  @ApiProperty({
    description: 'Distancia total del viaje en kilómetros',
    example: 150.5,
  })
  @IsNotEmpty()
  @IsNumber()
  kilometers: number;

  @ApiProperty({
    description: 'Duración del viaje en horas',
    example: 2.5,
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: 'Precio del viaje',
    example: 50.0,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Estado actual del viaje',
    enum: TravelStatus,
    default: TravelStatus.Pendiente,
  })
  @IsNotEmpty()
  @IsEnum(TravelStatus)
  status: TravelStatus;

  @ApiProperty({
    description: 'Fecha y hora de inicio del viaje',
    example: '2023-01-01T12:00:00',
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;
}
