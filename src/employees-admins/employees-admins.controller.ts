import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { EmployeesAdminsService } from './employees-admins.service';
import { UpdateEmployeeAdminDto } from './dto/update-employee-admin.dto';
import { CreateEmployeeAdminDto } from './dto/create-employee-admin.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeeAdmin } from './entities/employees-admin.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.Manager)
@ApiBearerAuth()
@ApiTags('Administradores')
@Controller('employees-admins')
export class EmployeesAdminsController {
  constructor(
    private readonly employeesAdminsService: EmployeesAdminsService,
  ) {}

  /**
   * @summary Crear un nuevo administador de empleado
   * @description Crea un nuevo administador de empleado.
   * @param createEmployeeAdminDto Datos para crear el administador de empleado.
   * @returns Respuesta de éxito al crear el administador de empleado.
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo administador de empleado' })
  @ApiResponse({
    status: 201,
    description: 'El administador de empleado ha sido creado exitosamente.',
    type: EmployeeAdmin,
  })
  create(@Body() createEmployeeAdminDto: CreateEmployeeAdminDto) {
    return this.employeesAdminsService.create(createEmployeeAdminDto);
  }

  /**
   * @summary Obtener una lista de administadors de empleado
   * @description Obtiene una lista de administadors de empleado.
   * @param paginationDto Datos de paginación.
   * @returns Lista de administadors de empleado recuperada exitosamente.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener una lista de administadors de empleado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de administadors de empleado recuperada exitosamente.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.employeesAdminsService.findAll(paginationDto);
  }

  /**
   * @summary Obtener un administador de empleado por ID
   * @description Obtiene un administador de empleado por su ID.
   * @param id ID del administador de empleado (UUID).
   * @returns Jefe de empleado recuperado por ID exitosamente.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un administador de empleado por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del administador de empleado (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Jefe de empleado recuperado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Jefe de empleado no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesAdminsService.findOne(id);
  }

  /**
   * @summary Actualizar un administador de empleado por ID
   * @description Actualiza un administador de empleado por su ID.
   * @param id ID del administador de empleado (UUID).
   * @param updateEmployeeAdminDto Datos para actualizar el administador de empleado.
   * @returns Jefe de empleado actualizado por ID exitosamente.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un administador de empleado por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del administador de empleado (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Jefe de empleado actualizado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Jefe de empleado no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeAdminDto: UpdateEmployeeAdminDto,
  ) {
    return this.employeesAdminsService.update(id, updateEmployeeAdminDto);
  }

  /**
   * @summary Eliminar un administador de empleado por ID
   * @description Elimina un administador de empleado por su ID.
   * @param id ID del administador de empleado (UUID).
   * @returns Jefe de empleado eliminado por ID exitosamente.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un administador de empleado por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del administador de empleado (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Jefe de empleado eliminado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Jefe de empleado no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesAdminsService.remove(id);
  }

  /**
   * @summary Descargar un informe PDF de administadors de empleado
   * @description Descarga un informe en formato PDF que contiene la información de los administadors de empleado.
   * @param res Respuesta HTTP.
   * @returns Archivo PDF descargado.
   */
  @Get('pdf/download')
  @ApiOperation({
    summary: 'Descargar un informe PDF de administadors de empleado',
    description:
      'Descarga un informe en formato PDF que contiene la información de los administadors de empleado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo PDF descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor al generar el informe PDF.',
  })
  async downloadPDF(@Res() res) {
    try {
      const buffer = await this.employeesAdminsService.generateReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename=informe-administadors-empleado.pdf',
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor al generar el informe PDF.',
      });
    }
  }
}
