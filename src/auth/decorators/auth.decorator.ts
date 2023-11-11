import { UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from './role.decorator';

export function Auth(role: Role) {
  return applyDecorators(Roles(role), UseGuards(AuthGuard, RoleGuard));
}
