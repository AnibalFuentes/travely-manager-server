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
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Vehicle } from './entities/vehicle.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.Manager)
@ApiBearerAuth()
@ApiTags('Vehiculos')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  /**
   * @summary Crear un nuevo vehículo
   * @description Crea una nueva entidad de vehículo en el sistema.
   * @param createVehicleDto Datos para crear el vehículo.
   * @returns Respuesta de éxito al crear el vehículo.
   */
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo vehículo',
    description: 'Crea una nueva entidad de vehículo en el sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'El vehículo ha sido creado exitosamente.',
    type: Vehicle,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  /**
   * @summary Obtener una lista de vehículos con paginación
   * @description Obtiene una lista paginada de entidades de vehículos en el sistema.
   * @param paginationDto Datos de paginación.
   * @returns Lista de vehículos recuperada exitosamente.
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener una lista de vehículos con paginación',
    description:
      'Obtiene una lista paginada de entidades de vehículos en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de vehículos recuperada exitosamente.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página para paginación.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número de elementos por página.',
  })
  findAll(paginationDto: PaginationDto) {
    return this.vehiclesService.findAll(paginationDto);
  }

  /**
   * @summary Encontrar un vehículo por ID o término de búsqueda
   * @description Encuentra una entidad de vehículo por su ID único o un término de búsqueda.
   * @param term Término de búsqueda (placa, tarjeta de registro, número de motor o ID de la marca).
   * @returns Vehículo encontrado exitosamente.
   */
  @Get(':term')
  @ApiOperation({
    summary: 'Encontrar un vehículo por ID o término de búsqueda',
    description:
      'Encuentra una entidad de vehículo por su ID único o un término de búsqueda.',
  })
  @ApiParam({
    name: 'term',
    description: 'placa, tarjeta de registro, número de motor o ID de la marca',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehículo encontrado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  findOne(@Param('term') term: string) {
    return this.vehiclesService.findOne(term);
  }

  /**
   * @summary Encontrar vehículos por marca
   * @description Recupera vehículos por ID de marca.
   * @param brandId ID de la marca para filtrar vehículos.
   * @returns Vehículos recuperados exitosamente.
   */
  @Get('brand/:brandId/vehicles')
  @ApiOperation({
    summary: 'Encontrar vehículos por marca',
    description: 'Recupera vehículos por ID de marca.',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehículos recuperados exitosamente.',
    type: Vehicle,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  @ApiParam({
    name: 'brandId',
    description: 'ID de la marca para filtrar vehículos',
  })
  findVehiclesByBrand(@Param('brandId', ParseUUIDPipe) brandId: string) {
    return this.vehiclesService.findVehiclesByBrand(brandId);
  }

  /**
   * @summary Encontrar vehículos por modelo
   * @description Recupera vehículos por nombre de modelo.
   * @param model Nombre del modelo del vehículo.
   * @returns Vehículos recuperados exitosamente.
   */
  @Get('vehicles/model/:model')
  @ApiOperation({
    summary: 'Encontrar vehículos por modelo',
    description: 'Recupera vehículos por nombre de modelo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehículos recuperados exitosamente.',
    type: Vehicle,
    isArray: true,
  })
  @ApiParam({ name: 'model', description: 'Nombre del modelo del vehículo' })
  findVehiclesByModel(@Param('model') model: string) {
    return this.vehiclesService.findVehiclesByModel(model);
  }

  /**
   * @summary Encontrar vehículos por año de fabricación
   * @description Recupera vehículos por año de fabricación.
   * @param year Año de fabricación del vehículo.
   * @returns Vehículos recuperados exitosamente.
   */
  @Get('vehicles/year/:year')
  @ApiOperation({
    summary: 'Encontrar vehículos por año de fabricación',
    description: 'Recupera vehículos por año de fabricación.',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehículos recuperados exitosamente.',
    type: Vehicle,
    isArray: true,
  })
  @ApiParam({ name: 'year', description: 'Año de fabricación del vehículo' })
  findVehiclesByManufacturingYear(@Param('year') year: number) {
    return this.vehiclesService.findVehiclesByManufacturingYear(year);
  }

  /**
   * @summary Encontrar vehículos por estado de actividad
   * @description Recupera vehículos por su estado de actividad (activo o inactivo).
   * @param isActive Estado de actividad del vehículo (true o false).
   * @returns Vehículos recuperados exitosamente.
   */
  @Get('vehicles/active')
  @ApiOperation({
    summary: 'Encontrar vehículos por estado de actividad',
    description:
      'Recupera vehículos por su estado de actividad (activo o inactivo).',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehículos recuperados exitosamente.',
    type: Vehicle,
    isArray: true,
  })
  @ApiQuery({
    name: 'isActive',
    description: 'Estado de actividad del vehículo (true o false)',
  })
  findVehiclesByActivityStatus(@Query('isActive') isActive: boolean) {
    return this.vehiclesService.findVehiclesByActivityStatus(isActive);
  }

  /**
   * @summary Actualizar un vehículo por ID
   * @description Actualiza una entidad de vehículo existente por su ID único.
   * @param id ID único del vehículo (UUID).
   * @param updateVehicleDto Datos para actualizar el vehículo.
   * @returns Vehículo actualizado exitosamente.
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un vehículo por ID',
    description: 'Actualiza una entidad de vehículo existente por su ID único.',
  })
  @ApiResponse({
    status: 200,
    description: 'El vehículo ha sido actualizado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  /**
   * @summary Eliminar un vehículo por ID
   * @description Elimina una entidad de vehículo del sistema por su ID único.
   * @param id ID único del vehículo (UUID).
   * @returns El vehículo ha sido eliminado exitosamente.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un vehículo por ID',
    description: 'Elimina una entidad de vehículo del sistema por su ID único.',
  })
  @ApiResponse({
    status: 204,
    description: 'El vehículo ha sido eliminado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.remove(id);
  }

  /**
   * @summary Descargar un informe PDF de vehículos
   * @description Descarga un informe en formato PDF que contiene la información de los vehículos.
   * @param res Respuesta HTTP.
   * @returns Archivo PDF descargado.
   */
  @Get('pdf/download')
  @ApiOperation({
    summary: 'Descargar un informe PDF de vehículos',
    description:
      'Descarga un informe en formato PDF que contiene la información de los vehículos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo PDF de vehículos descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de vehículos.',
  })
  async downloadPDF(@Res() res): Promise<void> {
    try {
      const buffer = await this.vehiclesService.generateReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=informe-vehiculos.pdf',
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de vehículos.',
      });
    }
  }
}
