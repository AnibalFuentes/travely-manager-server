import { ApiProperty } from '@nestjs/swagger';
import { Employee } from 'src/employees/entities/employee.entity';
import { Office } from 'src/offices/entities/office.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class EmployeeDriver {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para un conductor',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @OneToOne(() => Employee, { cascade: true })
  @JoinColumn()
  @ApiProperty({
    description: 'Información del empleado asociado al conductor.',
    type: () => Employee,
  })
  employee: Employee;

  @ManyToOne(() => Office, (office) => office.drivers)
  @ApiProperty({
    description: 'Oficina a la que está asignado el conductor.',
    type: () => Office,
  })
  office: Office;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({
    description: 'Número de licencia del conductor.',
    example: 'ABC123456',
  })
  licenseNumber: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty({
    description: 'Fecha de vencimiento de la licencia del conductor.',
    example: '2023-09-29T12:00:00Z',
  })
  licenseExpirationDate: Date;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si la licencia de conducir está activa o no.',
    example: true,
  })
  isLicenseActive: boolean;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si el conductor está activo o no.',
    example: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó el conductor.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
