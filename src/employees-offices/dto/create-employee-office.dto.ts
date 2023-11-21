import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateEmployeeDto } from 'src/employees/dto/create-employee.dto';

export class CreateEmployeeOfficeDto {
  @ApiProperty({
    description: 'Información sobre la persona asociada al jefe de empleado.',
    type: CreateEmployeeDto,
  })
  @IsNotEmpty()
  employee: CreateEmployeeDto;

  @ApiProperty({
    description: 'ID de la oficina asociada',
    example: 'c87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3b',
  })
  @IsUUID()
  @IsNotEmpty()
  officeId: string;

  @ApiProperty({
    description: 'ID del empleado jefe (opcional)',
    example: 'a87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3c',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  adminId?: string;

  @ApiProperty({
    description: 'ID del usuario asociado (opcional)',
    example: 'u87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3d',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Estado del empleado de oficina',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
