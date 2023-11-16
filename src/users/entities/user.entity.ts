import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único de un usuario',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @Column('varchar', { length: 100, nullable: true, unique: true })
  @ApiProperty({
    description: 'El correo electrónico del usuario',
    example: 'juan@example.com',
  })
  email: string;

  @Column('text', { nullable: false, select: false })
  @ApiProperty({
    description: 'La contraseña del usuario',
    example: 'P@ssw0rd123',
  })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  @ApiProperty({
    description: 'El rol del usuario',
    example: 'usuario',
    enum: Role,
  })
  role: Role;

  @Column('boolean', { default: true })
  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'La fecha y hora en que se creó el usuario.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
