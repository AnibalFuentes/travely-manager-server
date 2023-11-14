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
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.Manager)
@ApiBearerAuth()
@ApiTags('Empleados')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  /**
   * @summary Crear un nuevo empleado
   * @description Crea un nuevo empleado.
   * @param createEmployeeDto Datos para crear el empleado.
   * @returns Respuesta de éxito al crear el empleado.
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo empleado' })
  @ApiResponse({
    status: 201,
    description: 'El empleado ha sido creado exitosamente.',
    type: Employee,
  })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  /**
   * @summary Obtener una lista de empleados
   * @description Obtiene una lista de empleados.
   * @param paginationDto Datos de paginación.
   * @returns Lista de empleados recuperada exitosamente.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener una lista de empleados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de empleados recuperada exitosamente.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.employeesService.findAll(paginationDto);
  }

  /**
   * @summary Obtener un empleado por ID
   * @description Obtiene un empleado por su ID.
   * @param id ID del empleado (UUID).
   * @returns Empleado recuperado por ID exitosamente.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un empleado por ID' })
  @ApiParam({ name: 'id', description: 'ID del empleado (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Empleado recuperado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.findOne(id);
  }

  /**
   * @summary Actualizar un empleado por ID
   * @description Actualiza un empleado por su ID.
   * @param id ID del empleado (UUID).
   * @param updateEmployeeDto Datos para actualizar el empleado.
   * @returns Empleado actualizado por ID exitosamente.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un empleado por ID' })
  @ApiParam({ name: 'id', description: 'ID del empleado (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Empleado actualizado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  /**
   * @summary Eliminar un empleado por ID
   * @description Elimina un empleado por su ID.
   * @param id ID del empleado (UUID).
   * @returns Empleado eliminado por ID exitosamente.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un empleado por ID' })
  @ApiParam({ name: 'id', description: 'ID del empleado (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Empleado eliminado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.employeesService.remove(id);
  }
}
