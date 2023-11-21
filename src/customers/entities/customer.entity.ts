import { ApiProperty } from '@nestjs/swagger';
import { Company } from 'src/companies/entities/company.entity';
import { Person } from 'src/people/entities/person.entity';

import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Customer {
  // Clave primaria para la entidad Customer, generada como UUID
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para un cliente',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  // Relación Many-to-One con la entidad Company, que representa la empresa asociada con el cliente
  @ManyToOne(() => Company, (company) => company.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'La empresa asociada con el cliente.',
    type: () => Company,
  })
  company: Company;

  // Relación Many-to-One con la entidad Person, que representa la persona asociada con el cliente
  @ManyToOne(() => Person, (person) => person.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'La persona asociada con el cliente.',
    type: () => Person,
  })
  person: Person;

  // Columna para almacenar la fecha y hora de creación de la entidad cliente
  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó el cliente.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
