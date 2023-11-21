import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CreateEmployeeDto } from 'src/employees/dto/create-employee.dto';

export class CreateEmployeeChiefDto {
  @ApiProperty({
    description: 'Información sobre la persona asociada al jefe de empleado.',
    type: CreateEmployeeDto,
  })
  @IsNotEmpty()
  employee: CreateEmployeeDto;

  @ApiProperty({
    description: 'ID del usuario asociado (opcional)',
    example: 'u87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3d',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;
}
