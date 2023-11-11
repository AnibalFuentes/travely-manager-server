import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class RegisterAuthDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'juan@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'P@ssw0rd123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
    },
  )
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'Admin',
  })
  @IsOptional()
  role: Role;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
