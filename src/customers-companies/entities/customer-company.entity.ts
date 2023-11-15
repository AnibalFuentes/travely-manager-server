import { ApiProperty } from '@nestjs/swagger';
import { Company } from 'src/companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CustomerCompany {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para un cliente de tipo empresa',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3b',
  })
  id: string;

  @OneToOne(() => Company, { cascade: true })
  @JoinColumn()
  company: Company;

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
