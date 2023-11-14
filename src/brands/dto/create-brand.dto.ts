import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the brand',
    example: 'Mercedes Benz',
  })
  name: string;
}
