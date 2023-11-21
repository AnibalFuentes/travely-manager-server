import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsDecimal, IsInt, IsUUID } from 'class-validator';

export class CreateTravelSaleDto {
  @ApiProperty({
    description: 'Total de la venta',
    example: 100.0,
  })
  @IsDecimal({ decimal_digits: '1,2' })
  total: number;

  @ApiProperty({
    description: 'Monto recibido en la venta',
    example: 50.0,
  })
  @IsDecimal({ decimal_digits: '1,2' })
  amountReceived: number;

  @ApiProperty({
    description: 'Monto redimido en la venta',
    example: 30.0,
  })
  @IsDecimal({ decimal_digits: '1,2' })
  amountRedeemed: number;

  @ApiProperty({
    description: 'Total de kilómetros en el viaje',
    example: 150.5,
  })
  @IsDecimal({ decimal_digits: '1,2' })
  totalKilometers: number;

  @ApiProperty({
    description: 'Duración del viaje en minutos',
    example: 120,
  })
  @IsInt()
  duration: number;

  @ApiProperty({
    description: 'Ubicación de origen del viaje',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsUUID()
  originId: string;

  @ApiProperty({
    description: 'Ubicación de destino del viaje',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsUUID()
  destinationId: string;

  @ApiProperty({
    description: 'Vehículo utilizado en el viaje',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsUUID()
  driverVehicleId: string;

  @ApiProperty({
    description: 'Oficina del vendedor',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsUUID()
  sellerId: string;
}
