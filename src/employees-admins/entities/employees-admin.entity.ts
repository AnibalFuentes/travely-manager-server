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
export class EmployeeAdmin {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para un administrador de empleados',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @OneToOne(() => Employee, { cascade: true })
  @JoinColumn()
  @ApiProperty({
    description: 'Información del empleado asociado al administrador',
    type: () => Employee,
  })
  employee: Employee;

  @ManyToOne(() => Office, (office) => office.chiefs)
  @ApiProperty({
    description: 'Oficina a la que está asignado el administrador de empleados',
    type: () => Office,
  })
  office: Office;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si el administrador de empleados está activo o no.',
    example: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó el administrador de empleados.',
    example: '2023-09-29T12:00:00Z',
    type: Date,
  })
  createdAt: Date;
}
