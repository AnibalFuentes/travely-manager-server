import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateEmployeeDto } from 'src/employees/dto/create-employee.dto';

export class CreateEmployeeAdminDto {
  @ApiProperty({
    description:
      'Información sobre la persona asociada al adminstrador de empleados.',
    type: CreateEmployeeDto,
  })
  @IsNotEmpty()
  employee: CreateEmployeeDto;
}
