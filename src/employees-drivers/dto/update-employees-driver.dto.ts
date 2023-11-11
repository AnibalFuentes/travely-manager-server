import { PartialType } from '@nestjs/swagger';
import { CreateEmployeesDriverDto } from './create-employees-driver.dto';

export class UpdateEmployeesDriverDto extends PartialType(CreateEmployeesDriverDto) {}
