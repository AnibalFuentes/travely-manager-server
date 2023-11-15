import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';

export class CreateCustomerCompanyDto {
  @ApiProperty({
    description: 'Información sobre la persona asociada al jefe de empleado.',
    type: CreateCompanyDto,
  })
  @IsNotEmpty()
  company: CreateCompanyDto;
}
