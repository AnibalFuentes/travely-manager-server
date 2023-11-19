import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeAdminDto } from './create-employee-admin.dto';

export class UpdateEmployeeAdminDto extends PartialType(
  CreateEmployeeAdminDto,
) {}
