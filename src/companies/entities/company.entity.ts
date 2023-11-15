import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para la ubicación.',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @Column()
  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'Acme Corporation',
  })
  name: string;

  @Column()
  @ApiProperty({
    description: 'Número de identificación de la empresa',
    example: '123456789',
  })
  idenficication: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si el cliente de tipo empresa está activo o no.',
    example: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó el cliente de tipo empresa.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
