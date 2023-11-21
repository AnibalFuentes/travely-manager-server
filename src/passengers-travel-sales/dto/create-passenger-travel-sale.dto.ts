import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreatePassengerTravelSaleDto {
  @ApiProperty({
    description: 'Identificador único del pasajero',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsUUID('4', {
    message: 'El formato del identificador del pasajero no es válido',
  })
  passengerId: string;

  @ApiProperty({
    description: 'Identificador único de la venta de viaje',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsUUID('4', {
    message: 'El formato del identificador de la venta de viaje no es válido',
  })
  travelSaleId: string;
}
