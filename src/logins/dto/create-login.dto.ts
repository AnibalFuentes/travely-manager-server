import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateLoginDto {
  @ApiProperty({
    description: 'ID del usuario al que se asocia el inicio de sesión',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsUUID()
  userId: string;
}
