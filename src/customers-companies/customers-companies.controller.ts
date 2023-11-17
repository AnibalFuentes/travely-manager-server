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
import { CustomersCompaniesService } from './customers-companies.service';
import { CreateCustomerCompanyDto } from './dto/create-customer-company.dto';
import { UpdateCustomerCompanyDto } from './dto/update-customer-company.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerCompany } from './entities/customer-company.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.User)
@ApiBearerAuth()
@ApiTags('Clientes de tipo empresa')
@Controller('customers-companies')
export class CustomersCompaniesController {
  constructor(
    private readonly customersCompaniesService: CustomersCompaniesService,
  ) {}

  /**
   * @summary Crear un nuevo cliente de tipo empresa
   * @description Crea un nuevo cliente de tipo empresa.
   * @param createCustomerCompanyDto Datos para crear el cliente de tipo empresa.
   * @returns Respuesta de éxito al crear el cliente de tipo empresa.
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente de tipo empresa' })
  @ApiResponse({
    status: 201,
    description: 'El cliente de tipo empresa ha sido creado exitosamente.',
    type: CustomerCompany,
  })
  create(@Body() createCustomerCompanyDto: CreateCustomerCompanyDto) {
    return this.customersCompaniesService.create(createCustomerCompanyDto);
  }

  /**
   * @summary Obtener una lista de clientes de tipo empresa
   * @description Obtiene una lista de clientes de tipo empresa.
   * @param paginationDto Datos de paginación.
   * @returns Lista de clientes de tipo empresa recuperada exitosamente.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener una lista de clientes de tipo empresa' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes de tipo empresa recuperada exitosamente.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.customersCompaniesService.findAll(paginationDto);
  }

  /**
   * @summary Obtener un cliente de tipo empresa por ID
   * @description Obtiene un cliente de tipo empresa por su ID.
   * @param id ID del cliente de tipo empresa (UUID).
   * @returns Cliente de tipo empresa recuperado por ID exitosamente.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente de tipo empresa por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente de tipo empresa (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente de tipo empresa recuperado por ID exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente de tipo empresa no encontrado.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersCompaniesService.findOne(id);
  }

  /**
   * @summary Actualizar un cliente de tipo empresa por ID
   * @description Actualiza un cliente de tipo empresa por su ID.
   * @param id ID del cliente de tipo empresa (UUID).
   * @param updateCustomerCompanyDto Datos para actualizar el cliente de tipo empresa.
   * @returns Cliente de tipo empresa actualizado por ID exitosamente.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente de tipo empresa por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente de tipo empresa (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente de tipo empresa actualizado por ID exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente de tipo empresa no encontrado.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerCompanyDto: UpdateCustomerCompanyDto,
  ) {
    return this.customersCompaniesService.update(id, updateCustomerCompanyDto);
  }

  /**
   * @summary Eliminar un cliente de tipo empresa por ID
   * @description Elimina un cliente de tipo empresa por su ID.
   * @param id ID del cliente de tipo empresa (UUID).
   * @returns Cliente de tipo empresa eliminado por ID exitosamente.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cliente de tipo empresa por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente de tipo empresa (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente de tipo empresa eliminado por ID exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente de tipo empresa no encontrado.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.customersCompaniesService.remove(id);
  }

  /**
   * @summary Descargar un informe PDF de clientes de tipo empresa
   * @description Descarga un informe en formato PDF que contiene la información de los clientes de tipo empresa.
   * @param res Respuesta HTTP.
   * @returns Archivo PDF descargado.
   */
  @Get('pdf/download')
  @ApiOperation({
    summary: 'Descargar un informe PDF de clientes de tipo empresa',
    description:
      'Descarga un informe en formato PDF que contiene la información de los clientes de tipo empresa.',
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
      const buffer =
        await this.customersCompaniesService.generateCustomerCompanyReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename=informe-clientes-empresas.pdf',
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
