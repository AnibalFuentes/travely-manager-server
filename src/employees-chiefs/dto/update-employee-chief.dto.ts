import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeChiefDto } from './create-employee-chief.dto';

export class UpdateEmployeeChiefDto extends PartialType(
  CreateEmployeeChiefDto,
) {}
