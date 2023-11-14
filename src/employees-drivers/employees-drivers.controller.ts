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
} from '@nestjs/common';
import { EmployeesDriversService } from './employees-drivers.service';
import { CreateEmployeeDriverDto } from './dto/create-employee-driver.dto';
import { UpdateEmployeeDriverDto } from './dto/update-employee-driver.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeeDriver } from './entities/employee-driver.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.Manager)
@ApiBearerAuth()
@ApiTags('Conductores')
@Controller('employees-drivers')
export class EmployeesDriversController {
  constructor(
    private readonly employeesDriversService: EmployeesDriversService,
  ) {}

  /**
   * @summary Crear un nuevo conductor
   * @description Crea un nuevo conductor.
   * @param createEmployeeDriverDto Datos para crear el conductor.
   * @returns Respuesta de éxito al crear el conductor.
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo conductor' })
  @ApiResponse({
    status: 201,
    description: 'El conductor ha sido creado exitosamente.',
    type: EmployeeDriver,
  })
  create(@Body() createEmployeeDriverDto: CreateEmployeeDriverDto) {
    return this.employeesDriversService.create(createEmployeeDriverDto);
  }

  /**
   * @summary Obtener una lista de conductores
   * @description Obtiene una lista de conductores.
   * @param paginationDto Datos de paginación.
   * @returns Lista de conductores recuperada exitosamente.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener una lista de conductores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de conductores recuperada exitosamente.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.employeesDriversService.findAll(paginationDto);
  }

  /**
   * @summary Obtener un conductor por ID
   * @description Obtiene un conductor por su ID.
   * @param id ID del conductor (UUID).
   * @returns Conductor recuperado por ID exitosamente.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un conductor por ID' })
  @ApiParam({ name: 'id', description: 'ID del conductor (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Conductor recuperado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Conductor no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesDriversService.findOne(id);
  }

  /**
   * @summary Actualizar un conductor por ID
   * @description Actualiza un conductor por su ID.
   * @param id ID del conductor (UUID).
   * @param updateEmployeeDriverDto Datos para actualizar el conductor.
   * @returns Conductor actualizado por ID exitosamente.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un conductor por ID' })
  @ApiParam({ name: 'id', description: 'ID del conductor (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Conductor actualizado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Conductor no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDriverDto: UpdateEmployeeDriverDto,
  ) {
    return this.employeesDriversService.update(id, updateEmployeeDriverDto);
  }

  /**
   * @summary Eliminar un conductor por ID
   * @description Elimina un conductor por su ID.
   * @param id ID del conductor (UUID).
   * @returns Conductor eliminado por ID exitosamente.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un conductor por ID' })
  @ApiParam({ name: 'id', description: 'ID del conductor (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Conductor eliminado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Conductor no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.employeesDriversService.remove(id);
  }
}
