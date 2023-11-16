import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { LoginsService } from './logins.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.Admin)
@ApiBearerAuth()
@ApiTags('Inicios de sesión')
@Controller('logins')
export class LoginsController {
  constructor(private readonly loginsService: LoginsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener una lista de inicios de sesión',
    description:
      'Obtiene una lista de todos los inicios de sesión en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de inicios de sesión obtenida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  findAll() {
    return this.loginsService.findAll();
  }

  @Get('by-date')
  @ApiOperation({
    summary: 'Obtener inicios de sesión por fecha',
    description:
      'Obtiene una lista de inicios de sesión para una fecha específica.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de inicios de sesión por fecha obtenida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  findByDate(@Query('date') date: Date) {
    return this.loginsService.findByDate(date);
  }

  @Get('today')
  @ApiOperation({
    summary: 'Obtener inicios de sesión del día de hoy',
    description: 'Obtiene una lista de inicios de sesión del día actual.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista de inicios de sesión del día de hoy obtenida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  findTodayLogins() {
    return this.loginsService.findTodayLogins();
  }

  @Get('by-user/:userId')
  @ApiOperation({
    summary: 'Obtener inicios de sesión por ID de usuario',
    description:
      'Obtiene una lista de inicios de sesión para un usuario específico.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista de inicios de sesión por ID de usuario obtenida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  findLoginsByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.loginsService.findLoginsByUserId(userId);
  }
}
