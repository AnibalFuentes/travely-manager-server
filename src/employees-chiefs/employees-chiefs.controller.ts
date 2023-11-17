import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Res,
} from '@nestjs/common';
import { EmployeesChiefsService } from './employees-chiefs.service';
import { CreateEmployeeChiefDto } from './dto/create-employee-chief.dto';
import { UpdateEmployeeChiefDto } from './dto/update-employee-chief.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeeChief } from './entities/employees-chief.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.Manager)
@ApiBearerAuth()
@ApiTags('Jefes')
@Controller('employees-chiefs')
export class EmployeesChiefsController {
  constructor(
    private readonly employeesChiefsService: EmployeesChiefsService,
  ) {}

  /**
   * @summary Crear un nuevo jefe de empleado
   * @description Crea un nuevo jefe de empleado.
   * @param createEmployeeChiefDto Datos para crear el jefe de empleado.
   * @returns Respuesta de éxito al crear el jefe de empleado.
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo jefe de empleado' })
  @ApiResponse({
    status: 201,
    description: 'El jefe de empleado ha sido creado exitosamente.',
    type: EmployeeChief,
  })
  create(@Body() createEmployeeChiefDto: CreateEmployeeChiefDto) {
    return this.employeesChiefsService.create(createEmployeeChiefDto);
  }

  /**
   * @summary Obtener una lista de jefes de empleado
   * @description Obtiene una lista de jefes de empleado.
   * @param paginationDto Datos de paginación.
   * @returns Lista de jefes de empleado recuperada exitosamente.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener una lista de jefes de empleado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de jefes de empleado recuperada exitosamente.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.employeesChiefsService.findAll(paginationDto);
  }

  /**
   * @summary Obtener un jefe de empleado por ID
   * @description Obtiene un jefe de empleado por su ID.
   * @param id ID del jefe de empleado (UUID).
   * @returns Jefe de empleado recuperado por ID exitosamente.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un jefe de empleado por ID' })
  @ApiParam({ name: 'id', description: 'ID del jefe de empleado (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Jefe de empleado recuperado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Jefe de empleado no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesChiefsService.findOne(id);
  }

  /**
   * @summary Actualizar un jefe de empleado por ID
   * @description Actualiza un jefe de empleado por su ID.
   * @param id ID del jefe de empleado (UUID).
   * @param updateEmployeeChiefDto Datos para actualizar el jefe de empleado.
   * @returns Jefe de empleado actualizado por ID exitosamente.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un jefe de empleado por ID' })
  @ApiParam({ name: 'id', description: 'ID del jefe de empleado (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Jefe de empleado actualizado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Jefe de empleado no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeChiefDto: UpdateEmployeeChiefDto,
  ) {
    return this.employeesChiefsService.update(id, updateEmployeeChiefDto);
  }

  /**
   * @summary Eliminar un jefe de empleado por ID
   * @description Elimina un jefe de empleado por su ID.
   * @param id ID del jefe de empleado (UUID).
   * @returns Jefe de empleado eliminado por ID exitosamente.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un jefe de empleado por ID' })
  @ApiParam({ name: 'id', description: 'ID del jefe de empleado (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Jefe de empleado eliminado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Jefe de empleado no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.employeesChiefsService.remove(id);
  }

  /**
   * @summary Descargar un informe PDF de jefes de empleado
   * @description Descarga un informe en formato PDF que contiene la información de los jefes de empleado.
   * @param res Respuesta HTTP.
   * @returns Archivo PDF descargado.
   */
  @Get('pdf/download')
  @ApiOperation({
    summary: 'Descargar un informe PDF de jefes de empleado',
    description:
      'Descarga un informe en formato PDF que contiene la información de los jefes de empleado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo PDF descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor al generar el informe PDF.',
  })
  async downloadPDF(@Res() res): Promise<void> {
    try {
      const buffer = await this.employeesChiefsService.generateReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename=informe-jefes-empleado.pdf',
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
