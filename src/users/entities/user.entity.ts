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
    description: 'The unique identifier for a user',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @Column('varchar', { length: 100, nullable: true, unique: true })
  @ApiProperty({
    description: 'The email of the user',
    example: 'juan@example.com',
  })
  email: string;

  @Column('text', { nullable: false, select: false })
  @ApiProperty({
    description: 'The password of the user',
    example: 'P@ssw0rd123',
  })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
  })
  role: Role;

  @Column('boolean', { default: true })
  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The date and time when the user was created.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
