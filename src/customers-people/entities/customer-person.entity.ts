import { ApiProperty } from '@nestjs/swagger';
import { Person } from 'src/people/entities/person.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CustomerPerson {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para un cliente de tipo empresa',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3b',
  })
  id: string;

  @OneToOne(() => Person, { cascade: true })
  @JoinColumn()
  person: Person;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó el cliente de tipo empresa.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
