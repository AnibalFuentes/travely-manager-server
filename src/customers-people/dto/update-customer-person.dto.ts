import { PartialType } from '@nestjs/swagger';
import { CreateCustomerPersonDto } from './create-customer-person.dto';

export class UpdateCustomerPersonDto extends PartialType(
  CreateCustomerPersonDto,
) {}
