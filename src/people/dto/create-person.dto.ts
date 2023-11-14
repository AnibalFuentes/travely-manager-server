import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Gender, DocumentType } from 'src/common/enums/index';

export class CreatePersonDto {
  @ApiProperty({
    example: 'John',
    description: 'Nombre de pila de la persona.',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'James',
    description: 'Segundo nombre de la persona.',
  })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ example: 'Doe', description: 'Apellido de la persona.' })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'Smith',
    description: 'Segundo apellido de la persona.',
  })
  @IsOptional()
  @IsString()
  secondLastName?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Número de identificación de la persona.',
  })
  @IsOptional()
  @IsString()
  identificationNumber?: string;

  @ApiProperty({ example: 'Femenino', description: 'Género de la persona.' })
  @IsOptional()
  @IsString()
  gender?: Gender;

  @ApiProperty({
    example: 'Cédula de Ciudadanía',
    description: 'Tipo de documento de la persona.',
  })
  @IsOptional()
  @IsString()
  documentType?: DocumentType;

  @ApiProperty({
    example: '1990-01-15',
    description: 'Fecha de nacimiento de la persona.',
  })
  @IsOptional()
  @IsDateString()
  birthdate?: Date;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Correo electrónico de la persona.',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '+573023459685',
    description: 'Número de teléfono móvil de la persona.',
  })
  @IsOptional()
  @IsPhoneNumber('CO')
  mobilePhone?: string;
}
