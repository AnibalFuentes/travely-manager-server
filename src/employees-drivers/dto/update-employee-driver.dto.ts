import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeDriverDto } from './create-employee-driver.dto';

export class UpdateEmployeeDriverDto extends PartialType(
  CreateEmployeeDriverDto,
) {}
