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
export class Passenger {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique identifier for a passenger',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @OneToOne(() => Person, { cascade: true, nullable: false })
  @JoinColumn()
  person: Person;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indicates whether the passenger is active or not.',
    example: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The date and time when the passenger was created.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
