import { ApiProperty } from '@nestjs/swagger';
import { EmployeeChief } from 'src/employees-chiefs/entities/employees-chief.entity';

import { Location } from 'src/locations/entities/location.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Office {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para una oficina',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({
    description: 'Nombre de la oficina.',
    example: 'Oficina Principal',
  })
  name: string;

  @Column()
  @ApiProperty({
    description: 'Dirección de la oficina',
    example: '123 Main Street, Cityville',
  })
  address: string;

  @Column()
  @ApiProperty({
    description: 'Número de contacto de la oficina',
    example: '+573000001',
  })
  numberContact: string;

  @ManyToOne(() => Location, (location) => location.id, {
    eager: true,
    nullable: false,
  })
  @ApiProperty({
    description: 'La ubicación de la oficina.',
    type: () => Location,
  })
  location: Location;

  @ManyToOne(() => EmployeeChief, (employeeChief) => employeeChief.id, {
    eager: true,
    nullable: false,
  })
  @ApiProperty({
    description: 'El jefe de la oficina.',
    type: () => Location,
  })
  chief: EmployeeChief;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si la oficina está activa o no.',
    example: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó la oficina.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
