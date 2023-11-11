import { PartialType } from '@nestjs/swagger';
import { CreateEmployeesChiefDto } from './create-employees-chief.dto';

export class UpdateEmployeesChiefDto extends PartialType(CreateEmployeesChiefDto) {}
