import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CreatePersonDto } from "src/people/dto/create-person.dto";

export class CreatePassengerDto {
    @ApiProperty({
        description: 'Information about the person associated with the passenger.',
        type: CreatePersonDto,
      })
      @IsNotEmpty()
      person: CreatePersonDto;
}
