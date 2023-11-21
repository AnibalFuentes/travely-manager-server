import { ApiProperty } from '@nestjs/swagger';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { TravelSale } from 'src/travel-sales/entities/travel-sale.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity()
export class PassengerTravelSale {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único de la venta de viaje del pasajero',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @ManyToOne(() => Passenger, (passenger) => passenger.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'Pasajero asociado con la venta de viaje',
    type: () => Passenger,
  })
  passenger: Passenger;

  @ManyToOne(() => TravelSale, (travelSale) => travelSale.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'Venta de viaje asociada con el pasajero',
    type: () => TravelSale,
  })
  travel: TravelSale;

  @CreateDateColumn()
  @ApiProperty({
    description:
      'Fecha y hora en que se creó el registro de la venta de viaje del pasajero',
    example: '2023-09-28T10:00:00Z',
  })
  createdAt: Date;
}
