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
export class EmployeeChief {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para un jefe de empleado',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @OneToOne(() => Employee, { cascade: true })
  @JoinColumn()
  employee: Employee;

  @ManyToOne(() => Office, (office) => office.chiefs)
  office: Office;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si el jefe de empleado está activo o no.',
    example: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó el jefe de empleado.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
