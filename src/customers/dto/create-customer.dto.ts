import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreatePersonDto } from 'src/people/dto/create-person.dto';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Información sobre la persona asociada al cliente.',
    type: CreatePersonDto,
  })
  @IsNotEmpty()
  person: CreatePersonDto;
}
