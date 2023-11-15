import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreatePersonDto } from 'src/people/dto/create-person.dto';

export class CreatePassengerDto {
  @ApiProperty({
    description: 'Information about the person associated with the passenger.',
    type: CreatePersonDto,
  })
  @IsNotEmpty()
  person: CreatePersonDto;

  @ApiProperty({
    description: 'ID of the associated travel',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsNotEmpty()
  @IsUUID()
  travelId: string;
}
