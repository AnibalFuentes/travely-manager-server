import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmployeesOfficesService } from './employees-offices.service';
import { CreateEmployeeOfficeDto } from './dto/create-employee-office.dto';
import { UpdateEmployeeOfficeDto } from './dto/update-employee-office.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeeOffice } from './entities/employee-office.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.Admin)
@ApiBearerAuth()
@ApiTags('Empleados de Oficinas')
@Controller('employees-offices')
export class EmployeesOfficesController {
  constructor(
    private readonly employeesOfficesService: EmployeesOfficesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo jefe de empleado',
    description: 'Crea un nuevo jefe de empleado.',
  })
  @ApiResponse({
    status: 201,
    description: 'Jefe de empleado creado exitosamente.',
    type: EmployeeOffice,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  create(@Body() createEmployeeOfficeDto: CreateEmployeeOfficeDto) {
    return this.employeesOfficesService.create(createEmployeeOfficeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener una lista de jefes de empleados',
    description:
      'Obtiene una lista de todos los jefes de empleados en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de jefes de empleados obtenida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  findAll(@Body() paginationDto: PaginationDto) {
    return this.employeesOfficesService.findAll(paginationDto);
  }

  @Get(':idOrTerm')
  @ApiOperation({
    summary: 'Encontrar un jefe de empleado por ID o término de búsqueda',
    description:
      'Encuentra un jefe de empleado por su ID único o un término de búsqueda.',
  })
  @ApiResponse({
    status: 200,
    description: 'Jefe de empleado encontrado exitosamente.',
    type: EmployeeOffice,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Jefe de empleado no encontrado' })
  findOne(@Param('idOrTerm') idOrTerm: string) {
    return this.employeesOfficesService.findOne(idOrTerm);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un jefe de empleado por ID',
    description: 'Actualiza un jefe de empleado existente por su ID único.',
  })
  @ApiResponse({
    status: 200,
    description: 'El jefe de empleado se ha actualizado exitosamente.',
    type: EmployeeOffice,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Jefe de empleado no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateEmployeeOfficeDto: UpdateEmployeeOfficeDto,
  ) {
    return this.employeesOfficesService.update(id, updateEmployeeOfficeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un jefe de empleado por ID',
    description: 'Elimina un jefe de empleado del sistema por su ID único.',
  })
  @ApiResponse({
    status: 204,
    description: 'El jefe de empleado se ha eliminado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Jefe de empleado no encontrado' })
  remove(@Param('id') id: string) {
    return this.employeesOfficesService.remove(id);
  }
}
