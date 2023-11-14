import { ApiProperty } from '@nestjs/swagger';
import { Person } from 'src/people/entities/person.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
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

  @OneToOne(() => Person, { cascade: true })
  @JoinColumn()
  person: Person;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si el cliente está activo o no.',
    example: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó el cliente.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
