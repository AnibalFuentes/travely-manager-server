import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AssignVehiclesService } from './assign-vehicles.service';
import { CreateAssignVehicleDto } from './dto/create-assign-vehicle.dto';
import { UpdateAssignVehicleDto } from './dto/update-assign-vehicle.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';
import { AssignVehicle } from './entities/assign-vehicle.entity';
import { ParseUUIDPipe } from '@nestjs/common';

@Auth(Role.Manager)
@ApiBearerAuth()
@ApiTags('Asignación de Vehículos')
@Controller('assign-vehicles')
export class AssignVehiclesController {
  constructor(private readonly assignVehiclesService: AssignVehiclesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva asignación de vehículo',
    description: 'Crea una nueva asignación de vehículo en el sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'La asignación de vehículo se ha creado exitosamente.',
    type: AssignVehicle,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  create(@Body() createAssignVehicleDto: CreateAssignVehicleDto) {
    return this.assignVehiclesService.create(createAssignVehicleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener una lista de asignaciones de vehículos',
    description:
      'Obtiene una lista de todas las asignaciones de vehículos en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de asignaciones de vehículos obtenida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  findAll() {
    return this.assignVehiclesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una asignación de vehículo por ID',
    description: 'Obtiene una asignación de vehículo por su ID único.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la asignación de vehículo (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Asignación de vehículo obtenida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({
    status: 404,
    description: 'Asignación de vehículo no encontrada',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignVehiclesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una asignación de vehículo por ID',
    description:
      'Actualiza una asignación de vehículo existente por su ID único.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la asignación de vehículo (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'La asignación de vehículo se ha actualizado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({
    status: 404,
    description: 'Asignación de vehículo no encontrada',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAssignVehicleDto: UpdateAssignVehicleDto,
  ) {
    return this.assignVehiclesService.update(id, updateAssignVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una asignación de vehículo por ID',
    description:
      'Elimina una asignación de vehículo del sistema por su ID único.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la asignación de vehículo (UUID)',
  })
  @ApiResponse({
    status: 204,
    description: 'La asignación de vehículo se ha eliminado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({
    status: 404,
    description: 'Asignación de vehículo no encontrada',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignVehiclesService.remove(id);
  }

  /**
   * @summary Descargar un informe PDF de asignaciones de vehículos
   * @description Descarga un informe en formato PDF que contiene la información de las asignaciones de vehículos a conductores.
   * @param res Respuesta HTTP.
   * @returns Archivo PDF descargado.
   */
  @Get('pdf/download')
  @ApiOperation({
    summary: 'Descargar un informe PDF de asignaciones de vehículos',
    description:
      'Descarga un informe en formato PDF que contiene la información de las asignaciones de vehículos a conductores.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Archivo PDF de asignaciones de vehículos descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de asignaciones de vehículos.',
  })
  async downloadPDF(@Res() res): Promise<void> {
    try {
      const buffer = await this.assignVehiclesService.generateReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename=informe-asignaciones-vehiculos.pdf',
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de asignaciones de vehículos.',
      });
    }
  }
}
