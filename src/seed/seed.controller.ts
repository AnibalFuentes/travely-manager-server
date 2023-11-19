import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
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
@ApiTags('Semilla de datos')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  /**
   * @summary Ejecutar el proceso de carga inicial de datos
   * @description Inicia el proceso de carga de datos para poblar el sistema con datos iniciales.
   * @returns Completado con éxito el proceso de carga de datos.
   */
  //@Get()
  //@ApiOperation({
  //  summary: 'Ejecutar el proceso de carga inicial de datos',
  //  description:
  //    'Inicia el proceso de carga de datos para poblar el sistema con datos iniciales.',
  //})
  //@ApiResponse({
  //  status: 200,
  //  description: 'Proceso de carga de datos completado con éxito.',
  //})
  //@ApiResponse({ status: 500, description: 'Error interno del servidor' })
  //execute() {
  //  return this.seedService.run();
  //}
}
