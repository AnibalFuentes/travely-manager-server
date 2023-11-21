import { ApiProperty } from '@nestjs/swagger';
import { DriverVehicle } from 'src/drivers-vehicles/entities/driver-vehicle.entity';
import { EmployeeOffice } from 'src/employees-offices/entities/employee-office.entity';
import { Location } from 'src/locations/entities/location.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TravelSale {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único de la venta de viaje',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({
    description: 'Total de la venta',
    example: 100.0,
  })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({
    description: 'Total de kilómetros en el viaje',
    example: 150.5,
  })
  totalKilometers: number;

  @Column({ type: 'integer' })
  @ApiProperty({
    description: 'Duración del viaje en minutos',
    example: 120,
  })
  duration: number;

  @ManyToOne(() => Location, (origin) => origin.id, {
    eager: true,
    nullable: false,
  })
  @ApiProperty({
    description: 'Ubicación de origen del viaje',
    type: () => Location,
  })
  origin: Location;

  @ManyToOne(() => Location, (destination) => destination.id, {
    eager: true,
    nullable: false,
  })
  @ApiProperty({
    description: 'Ubicación de destino del viaje',
    type: () => Location,
  })
  destination: Location;

  @ManyToOne(() => DriverVehicle, (driverVehicle) => driverVehicle.id, {
    eager: true,
    nullable: false,
  })
  @ApiProperty({
    description: 'Vehículo utilizado en el viaje',
    type: () => DriverVehicle,
  })
  driverVehicle: DriverVehicle;

  @ManyToOne(() => EmployeeOffice, (seller) => seller.id, {
    eager: true,
    nullable: false,
  })
  @ApiProperty({
    description: 'Vendedor',
    type: () => EmployeeOffice,
  })
  seller: EmployeeOffice;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha de creación del registro de la venta de viaje',
    example: '2023-09-28T10:00:00Z',
  })
  createdAt: Date;
}
