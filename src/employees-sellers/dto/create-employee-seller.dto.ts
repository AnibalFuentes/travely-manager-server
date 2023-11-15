import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateEmployeeDto } from 'src/employees/dto/create-employee.dto';

export class CreateEmployeeSellerDto {
  @ApiProperty({
    description: 'Información sobre la persona asociada al vendedor.',
    type: CreateEmployeeDto,
  })
  @IsNotEmpty()
  employee: CreateEmployeeDto;
}
