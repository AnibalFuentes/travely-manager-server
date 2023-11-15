import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeSellerDto } from './create-employee-seller.dto';

export class UpdateEmployeeSellerDto extends PartialType(
  CreateEmployeeSellerDto,
) {}
