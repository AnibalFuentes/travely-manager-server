import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @ApiProperty({
    description: 'El nombre de la marca',
    example: 'Mercedes Benz',
  })
  name: string;
}
