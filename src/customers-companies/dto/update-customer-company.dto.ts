import { PartialType } from '@nestjs/swagger';
import { CreateCustomerCompanyDto } from './create-customer-company.dto';

export class UpdateCustomerCompanyDto extends PartialType(
  CreateCustomerCompanyDto,
) {}
