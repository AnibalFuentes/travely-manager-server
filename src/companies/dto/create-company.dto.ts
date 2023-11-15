import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'Acme Corporation',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Número de identificación de la empresa',
    example: '123456789',
  })
  @IsNotEmpty()
  identification: string;

  @ApiProperty({
    description: 'Indica si el cliente de tipo empresa está activo o no.',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;
}
