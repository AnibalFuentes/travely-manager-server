import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@Auth(Role.Admin)
@ApiBearerAuth()
@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @summary Obtener todos los usuarios
   * @description Recupera una lista de todos los usuarios.
   * @returns Lista de usuarios recuperada exitosamente.
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Recupera una lista de todos los usuarios.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios recuperada exitosamente.',
    type: User,
    isArray: true,
  })
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * @summary Buscar un usuario por término
   * @description Recupera un usuario por término (nombre de usuario, correo electrónico o ID).
   * @param term Término de búsqueda (correo electrónico o ID del usuario).
   * @returns Usuario recuperado exitosamente.
   */
  @Get(':term')
  @ApiOperation({
    summary: 'Buscar un usuario por término',
    description:
      'Recupera un usuario por término (nombre de usuario, correo electrónico o ID).',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario recuperado exitosamente.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({
    name: 'term',
    description: 'Correo electrónico o ID del usuario',
  })
  findOne(@Param('term') term: string) {
    return this.usersService.findOne(term);
  }

  /**
   * @summary Actualizar un usuario por ID
   * @description Actualiza un usuario por ID.
   * @param id ID del usuario a actualizar.
   * @param updatePersonDto Datos actualizados del usuario.
   * @returns El usuario ha sido actualizado exitosamente.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido actualizado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePersonDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updatePersonDto);
  }

  /**
   * @summary Eliminar un usuario por ID
   * @description Elimina un usuario por ID.
   * @param id ID del usuario a eliminar.
   * @returns El usuario ha sido eliminado exitosamente.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiResponse({
    status: 204,
    description: 'El usuario ha sido eliminado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  /**
   * @summary Obtener la cantidad de usuarios activos
   * @description Recupera la cantidad de usuarios activos en el sistema.
   * @returns Cantidad de usuarios activos recuperada exitosamente.
   */
  @Get('active/count')
  @ApiOperation({
    summary: 'Obtener la cantidad de usuarios activos',
    description: 'Recupera la cantidad de usuarios activos en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de usuarios activos recuperada exitosamente.',
  })
  async getActiveUsersCount() {
    const activeUsersCount = await this.usersService.countActiveUsers();
    return activeUsersCount;
  }

  /**
   * @summary Descargar un informe PDF de usuarios
   * @description Descarga un informe en formato PDF que contiene la información de los usuarios.
   * @param res Respuesta HTTP.
   * @returns Archivo PDF descargado.
   */
  @Get('pdf/download')
  @ApiOperation({
    summary: 'Descargar un informe PDF de usuarios',
    description:
      'Descarga un informe en formato PDF que contiene la información de los usuarios.',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo PDF de usuarios descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de usuarios.',
  })
  async downloadPDF(@Res() res): Promise<void> {
    try {
      const buffer = await this.usersService.generateUserReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=informe-usuarios.pdf',
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de usuarios.',
      });
    }
  }

  /**
   * @summary Descargar un informe PDF de usuarios registrados hoy
   * @description Descarga un informe en formato PDF que contiene la información de los usuarios registrados hoy.
   * @param res Respuesta HTTP.
   * @returns Archivo PDF descargado.
   */
  @Get('pdf/download/today')
  @ApiOperation({
    summary: 'Descargar un informe PDF de usuarios registrados hoy',
    description:
      'Descarga un informe en formato PDF que contiene la información de los usuarios registrados hoy.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Archivo PDF de usuarios registrados hoy descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de usuarios registrados hoy.',
  })
  async downloadPDFToday(@Res() res): Promise<void> {
    try {
      const buffer = await this.usersService.generateUserReportTodayPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=informe-usuarios-hoy.pdf',
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de usuarios registrados hoy.',
      });
    }
  }

  /**
   * @summary Descargar un informe PDF de usuarios por fecha de creación
   * @description Descarga un informe en formato PDF que contiene la información de los usuarios creados en una fecha específica.
   * @param res Respuesta HTTP.
   * @param date Fecha específica en la que se crearon los usuarios (formato: YYYY-MM-DD).
   * @returns Archivo PDF descargado.
   */
  @Get('pdf/download/created/:date')
  @ApiOperation({
    summary: 'Descargar un informe PDF de usuarios por fecha de creación',
    description:
      'Descarga un informe en formato PDF que contiene la información de los usuarios creados en una fecha específica.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Archivo PDF de usuarios por fecha de creación descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de usuarios por fecha de creación.',
  })
  @ApiParam({
    name: 'date',
    description:
      'Fecha específica en la que se crearon los usuarios (formato: YYYY-MM-DD)',
  })
  async downloadPDFByCreationDate(
    @Param('date') date: string,
    @Res() res,
  ): Promise<void> {
    try {
      const creationDate = new Date(date);
      const buffer =
        await this.usersService.generateUserReportByCreationDatePDF(
          creationDate,
        );

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=informe-usuarios-creados-${date}.pdf`,
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de usuarios por fecha de creación.',
      });
    }
  }
}
