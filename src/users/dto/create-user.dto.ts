import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'El correo electrónico del usuario',
    example: 'juan@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'La contraseña del usuario',
    example: 'P@ssw0rd123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
