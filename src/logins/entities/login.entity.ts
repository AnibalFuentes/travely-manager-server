import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Login {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para un empleado',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó el empleado.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.logins)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
