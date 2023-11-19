import { ApiProperty } from '@nestjs/swagger';

import { CreatePersonDto } from 'src/people/dto/create-person.dto';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @IsOptional()
  @ApiProperty({
    description: 'Información de la persona.',
    type: CreatePersonDto,
  })
  person?: CreatePersonDto;

  @IsOptional()
  @ApiProperty({
    description: 'Información de la empresa.',
    type: CreateCompanyDto,
  })
  company?: CreateCompanyDto;
}
