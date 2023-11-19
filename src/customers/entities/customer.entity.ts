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
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para un cliente',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @ManyToOne(() => Company, (company) => company.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'La marca del vehículo.',
    type: () => Company,
  })
  company: Company;

  @ManyToOne(() => Person, (person) => person.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'La marca del vehículo.',
    type: () => Person,
  })
  person: Person;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó el cliente.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
