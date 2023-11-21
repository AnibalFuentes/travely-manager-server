import { ApiProperty } from '@nestjs/swagger';
import { Employee } from 'src/employees/entities/employee.entity';
import { Office } from 'src/offices/entities/office.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class EmployeeOffice {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para un empleado de oficina',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @ManyToOne(() => Employee, (employee) => employee.id, {
    eager: true,
    nullable: false,
  })
  @ApiProperty({
    description: 'Información relacionada al empleado',
    type: () => Employee,
  })
  employee: Employee;

  @ManyToOne(() => Office, (office) => office.id, {
    eager: true,
    nullable: false,
  })
  @ApiProperty({
    description: 'La oficina a la que está asignado el empleado',
    type: () => Office,
  })
  office: Office;

  @ManyToOne(() => EmployeeOffice, (admin) => admin.id, {
    eager: true,
    nullable: true,
  })
  @ApiProperty({
    description: 'El empleado que es jefe de este empleado',
    type: () => EmployeeOffice,
    required: false,
  })
  admin: EmployeeOffice;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    nullable: false,
  })
  @ApiProperty({
    description: 'El usuario asociado al empleado de oficina',
    type: () => User,
  })
  user: User;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si el empleado de oficina está activo o no.',
    example: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó el empleado de oficina.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
