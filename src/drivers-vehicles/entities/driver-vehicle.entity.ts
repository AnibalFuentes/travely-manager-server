import { ApiProperty } from '@nestjs/swagger';
import { EmployeeDriver } from 'src/employees-drivers/entities/employee-driver.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class DriverVehicle {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para la asignación de vehículo',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id, {
    eager: true,
    nullable: false,
  })
  @ApiProperty({
    description: 'El vehículo asignado.',
    type: () => Vehicle,
  })
  vehicle: Vehicle;

  @ManyToOne(() => EmployeeDriver, (employeeDriver) => employeeDriver.id, {
    eager: true,
    nullable: false,
  })
  @ApiProperty({
    description: 'Primer conductor asignado al vehículo.',
    type: () => EmployeeDriver,
  })
  driver: EmployeeDriver;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si la asignación de vehículo está activa o no.',
    example: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó la asignación de vehículo.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
