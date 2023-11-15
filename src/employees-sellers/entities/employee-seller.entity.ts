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
export class EmployeeSeller {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para un vendedor',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @OneToOne(() => Employee, { cascade: true })
  @JoinColumn()
  @ApiProperty({
    description: 'Información del empleado asociado al vendedor.',
    type: () => Employee,
  })
  employee: Employee;

  @ManyToOne(() => Office, (office) => office.sellers)
  @ApiProperty({
    description: 'Oficina a la que está asignado el vendedor.',
    type: () => Office,
  })
  office: Office;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si el vendedor está activo o no.',
    example: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó el vendedor.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
