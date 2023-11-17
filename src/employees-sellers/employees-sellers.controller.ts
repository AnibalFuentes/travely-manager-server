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
import { EmployeesSellersService } from './employees-sellers.service';
import { CreateEmployeeSellerDto } from './dto/create-employee-seller.dto';
import { UpdateEmployeeSellerDto } from './dto/update-employee-seller.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/common/enums';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { EmployeeSeller } from './entities/employee-seller.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Auth(Role.Manager)
@ApiBearerAuth()
@ApiTags('Vendedores')
@Controller('employees-sellers')
export class EmployeesSellersController {
  constructor(
    private readonly employeesSellersService: EmployeesSellersService,
  ) {}

  /**
   * @summary Crear un nuevo vendedor
   * @description Crea un nuevo vendedor.
   * @param createEmployeeSellerDto Datos para crear el vendedor.
   * @returns Respuesta de éxito al crear el vendedor.
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo vendedor' })
  @ApiResponse({
    status: 201,
    description: 'El vendedor ha sido creado exitosamente.',
    type: EmployeeSeller,
  })
  create(@Body() createEmployeeSellerDto: CreateEmployeeSellerDto) {
    return this.employeesSellersService.create(createEmployeeSellerDto);
  }

  /**
   * @summary Obtener una lista de vendedores
   * @description Obtiene una lista de vendedores.
   * @param paginationDto Datos de paginación.
   * @returns Lista de vendedores recuperada exitosamente.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener una lista de vendedores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de vendedores recuperada exitosamente.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.employeesSellersService.findAll(paginationDto);
  }

  /**
   * @summary Obtener un vendedor por ID
   * @description Obtiene un vendedor por su ID.
   * @param id ID del vendedor (UUID).
   * @returns Vendedor recuperado por ID exitosamente.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un vendedor por ID' })
  @ApiParam({ name: 'id', description: 'ID del vendedor (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Vendedor recuperado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Vendedor no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesSellersService.findOne(id);
  }

  /**
   * @summary Actualizar un vendedor por ID
   * @description Actualiza un vendedor por su ID.
   * @param id ID del vendedor (UUID).
   * @param updateEmployeeSellerDto Datos para actualizar el vendedor.
   * @returns Vendedor actualizado por ID exitosamente.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un vendedor por ID' })
  @ApiParam({ name: 'id', description: 'ID del vendedor (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Vendedor actualizado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Vendedor no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeSellerDto: UpdateEmployeeSellerDto,
  ) {
    return this.employeesSellersService.update(id, updateEmployeeSellerDto);
  }

  /**
   * @summary Eliminar un vendedor por ID
   * @description Elimina un vendedor por su ID.
   * @param id ID del vendedor (UUID).
   * @returns Vendedor eliminado por ID exitosamente.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un vendedor por ID' })
  @ApiParam({ name: 'id', description: 'ID del vendedor (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Vendedor eliminado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Vendedor no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.employeesSellersService.remove(id);
  }

  /**
   * @summary Descargar un informe PDF de vendedores
   * @description Descarga un informe en formato PDF que contiene la información de los vendedores.
   * @param res Respuesta HTTP.
   * @returns Archivo PDF descargado.
   */
  @Get('pdf/download')
  @ApiOperation({
    summary: 'Descargar un informe PDF de vendedores',
    description:
      'Descarga un informe en formato PDF que contiene la información de los vendedores.',
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
      const buffer = await this.employeesSellersService.generateReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=informe-vendedores.pdf',
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
