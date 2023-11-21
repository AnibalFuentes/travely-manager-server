import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateEmployeeDto } from 'src/employees/dto/create-employee.dto';

export class CreateEmployeeDriverDto {
  @ApiProperty({
    description: 'Información sobre la persona asociada al conductor.',
    type: CreateEmployeeDto,
  })
  @IsNotEmpty()
  employee: CreateEmployeeDto;

  @ApiProperty({
    description: 'Número de licencia del conductor.',
    example: 'ABC123456',
    required: false, // Puedes ajustar esto según tus necesidades
  })
  @IsOptional()
  @IsString()
  licenseNumber: string;

  @ApiProperty({
    description: 'Fecha de vencimiento de la licencia del conductor.',
    example: '2023-09-29T12:00:00Z',
    required: false, // Puedes ajustar esto según tus necesidades
  })
  @IsOptional()
  @IsDateString()
  licenseExpirationDate: string;

  @ApiProperty({
    description: 'Indica si la licencia de conducir está activa o no.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isLicenseActive: boolean;
}
