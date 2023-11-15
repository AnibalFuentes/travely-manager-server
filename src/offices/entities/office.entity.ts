import { ApiProperty } from '@nestjs/swagger';
import { EmployeeChief } from 'src/employees-chiefs/entities/employees-chief.entity';
import { EmployeeDriver } from 'src/employees-drivers/entities/employee-driver.entity';
import { EmployeeSeller } from 'src/employees-sellers/entities/employee-seller.entity';
import { Location } from 'src/locations/entities/location.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => Location, (location) => location.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'La ubicación de la oficina.',
    type: () => Location,
  })
  location: Location;

  @OneToMany(() => EmployeeChief, (chief) => chief.office)
  @ApiProperty({
    description: 'Lista de jefes de empleado asociados a la oficina.',
    type: () => [EmployeeChief],
  })
  chiefs: EmployeeChief[];

  @OneToMany(() => EmployeeDriver, (driver) => driver.office)
  @ApiProperty({
    description: 'Lista de conductores asociados a la oficina.',
    type: () => [EmployeeDriver],
  })
  drivers: EmployeeDriver[];

  @OneToMany(() => EmployeeSeller, (seller) => seller.office)
  @ApiProperty({
    description: 'Lista de vendedores asociados a la oficina.',
    type: () => [EmployeeSeller],
  })
  sellers: EmployeeSeller[];

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
