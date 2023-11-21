import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeOfficeDto } from './create-employee-office.dto';

export class UpdateEmployeeOfficeDto extends PartialType(
  CreateEmployeeOfficeDto,
) {}
