import { PartialType } from '@nestjs/swagger';
import { CreateEmployeesOfficeDto } from './create-employees-office.dto';

export class UpdateEmployeesOfficeDto extends PartialType(CreateEmployeesOfficeDto) {}
