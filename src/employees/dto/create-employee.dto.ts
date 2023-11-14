import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreatePersonDto } from 'src/people/dto/create-person.dto';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Información sobre la persona asociada al empleado.',
    type: CreatePersonDto,
  })
  @IsNotEmpty()
  person: CreatePersonDto;
}
