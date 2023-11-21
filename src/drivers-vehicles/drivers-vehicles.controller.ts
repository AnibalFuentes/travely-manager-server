import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { DriversVehiclesService } from './drivers-vehicles.service';
import { CreateDriverVehicleDto } from './dto/create-driver-vehicle.dto';
import { UpdateDriverVehicleDto } from './dto/update-driver-vehicle.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DriverVehicle } from './entities/driver-vehicle.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.Manager)
@ApiBearerAuth()
@ApiTags('Asignación de conductores y vehículos')
@Controller('drivers-vehicles')
export class DriversVehiclesController {
  constructor(private readonly assignVehiclesService: DriversVehiclesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva asignación de vehículo',
    description: 'Crea una nueva asignación de vehículo en el sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'La asignación de vehículo se ha creado exitosamente.',
    type: DriverVehicle,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  create(@Body() createDriverVehicleDto: CreateDriverVehicleDto) {
    return this.assignVehiclesService.create(createDriverVehicleDto);
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
    @Body() updateDriverVehicleDto: UpdateDriverVehicleDto,
  ) {
    return this.assignVehiclesService.update(id, updateDriverVehicleDto);
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
      const buffer =
        await this.assignVehiclesService.generateDriverVehicleReportPDF();

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
