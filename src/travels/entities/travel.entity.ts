import { ApiProperty } from '@nestjs/swagger';
import { AssignVehicle } from 'src/assign-vehicles/entities/assign-vehicle.entity';
import { TravelStatus } from 'src/common/enums';
import { Location } from 'src/locations/entities/location.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Travel {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único del viaje',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @ManyToOne(() => Location, (location) => location.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'Ubicación de origen del viaje.',
    type: () => Location,
  })
  origin: Location;

  @ManyToOne(() => Location, (location) => location.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'Ubicación de destino del viaje.',
    type: () => Location,
  })
  destination: Location;

  @ManyToOne(() => AssignVehicle, (assignVehicle) => assignVehicle.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'Vehículo asignado al viaje.',
    type: () => AssignVehicle,
  })
  assignVehicle: AssignVehicle;

  @OneToMany(() => Passenger, (passenger) => passenger.travel)
  passenger: Passenger[];

  @Column({ type: 'float' })
  @ApiProperty({
    description: 'Distancia total del viaje en kilómetros.',
    example: 150.5,
  })
  kilometers: number;

  @Column({ type: 'float' })
  @ApiProperty({
    description: 'Duración del viaje en horas.',
    example: 2.5,
  })
  duration: number;

  @Column({ type: 'float' })
  @ApiProperty({
    description: 'Precio del viaje.',
    example: 50.0,
  })
  price: number;

  @ManyToOne(() => Sale, (sale) => sale.travels)
  venta: Sale;

  @Column({ type: 'enum', enum: TravelStatus, default: TravelStatus.Pendiente })
  @ApiProperty({
    description: 'Estado actual del viaje.',
    enum: TravelStatus,
    default: TravelStatus.Pendiente,
  })
  status: TravelStatus;

  @Column({ type: 'datetime' })
  @ApiProperty({
    description: 'Fecha y hora de inicio del viaje.',
    example: '2023-01-01T12:00:00',
    format: 'date-time',
  })
  startDate: Date;
}
