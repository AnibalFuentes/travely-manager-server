import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  Get,
  Query,
  Patch,
  Res,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Customer } from './entities/customer.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiBearerAuth()
@ApiTags('Clientes')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /**
   * @summary Crear un nuevo cliente
   * @description Crea un nuevo cliente.
   * @param createCustomerDto Datos para crear el cliente.
   * @returns Cliente creado exitosamente.
   */
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo cliente',
    description: 'Crea un nuevo cliente en el sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'El cliente ha sido creado exitosamente.',
    type: Customer,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  /**
   * @summary Obtener todos los clientes con paginación
   * @description Obtiene una lista paginada de clientes.
   * @param paginationDto Datos de paginación.
   * @returns Lista de clientes con información de paginación.
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los clientes con paginación',
    description: 'Obtiene una lista paginada de clientes en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes recuperada exitosamente.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número de elementos por página.',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Número de elementos para omitir al principio.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.customersService.findAll(paginationDto);
  }

  /**
   * @summary Actualizar un cliente por ID
   * @description Actualiza un cliente existente por su ID.
   * @param id ID del cliente (UUID).
   * @param updateCustomerDto Datos para actualizar el cliente.
   * @returns Cliente actualizado exitosamente.
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un cliente por ID',
    description: 'Actualiza un cliente existente por su ID único.',
  })
  @ApiResponse({
    status: 200,
    description: 'El cliente ha sido actualizado exitosamente.',
    type: Customer,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  /**
   * @summary Eliminar un cliente por ID
   * @description Elimina un cliente del sistema por su ID.
   * @param id ID del cliente (UUID).
   * @returns Cliente eliminado exitosamente.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un cliente por ID',
    description: 'Elimina un cliente del sistema por su ID único.',
  })
  @ApiResponse({
    status: 204,
    description: 'El cliente ha sido eliminado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id);
  }

  @Get('pdf/download')
  @ApiOperation({
    summary: 'Descargar un informe PDF de clientes',
    description:
      'Descarga un informe en formato PDF que contiene la información de los clientes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo PDF de clientes descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de clientes.',
  })
  async downloadPDF(@Res() res): Promise<void> {
    try {
      const buffer = await this.customersService.generateCustomerReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=informe-clientes.pdf',
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de clientes.',
      });
    }
  }

  @Get('pdf/download/persons')
  @ApiOperation({
    summary: 'Descargar un informe PDF de clientes de tipo persona',
    description:
      'Descarga un informe en formato PDF que contiene la información de los clientes de tipo persona.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Archivo PDF de clientes de tipo persona descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de clientes de tipo persona.',
  })
  async downloadPDFPersons(@Res() res): Promise<void> {
    try {
      const buffer =
        await this.customersService.generateCustomerPersonReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename=informe-clientes-personas.pdf',
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de clientes de tipo persona.',
      });
    }
  }

  @Get('pdf/download/companies')
  @ApiOperation({
    summary: 'Descargar un informe PDF de clientes de tipo empresa',
    description:
      'Descarga un informe en formato PDF que contiene la información de los clientes de tipo empresa.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Archivo PDF de clientes de tipo empresa descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de clientes de tipo empresa.',
  })
  async downloadPDFCompanies(@Res() res): Promise<void> {
    try {
      const buffer =
        await this.customersService.generateCustomerCompanyReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename=informe-clientes-empresas.pdf',
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de clientes de tipo empresa.',
      });
    }
  }

  @Get('pdf/download/today')
  @ApiOperation({
    summary: 'Descargar un informe PDF de clientes registrados hoy',
    description:
      'Descarga un informe en formato PDF que contiene la información de los clientes registrados hoy.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Archivo PDF de clientes registrados hoy descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de clientes registrados hoy.',
  })
  async downloadPDFToday(@Res() res): Promise<void> {
    try {
      const buffer =
        await this.customersService.generateCustomerReportTodayPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=informe-clientes-hoy.pdf',
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de clientes registrados hoy.',
      });
    }
  }

  @Get('pdf/download/created/:date')
  @ApiOperation({
    summary: 'Descargar un informe PDF de clientes por fecha de creación',
    description:
      'Descarga un informe en formato PDF que contiene la información de los clientes creados en una fecha específica.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Archivo PDF de clientes por fecha de creación descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de clientes por fecha de creación.',
  })
  @ApiParam({
    name: 'date',
    description:
      'Fecha específica en la que se crearon los clientes (formato: YYYY-MM-DD)',
  })
  async downloadPDFByCreationDate(
    @Param('date') date: string,
    @Res() res,
  ): Promise<void> {
    try {
      const creationDate = new Date(date);
      const buffer =
        await this.customersService.generateCustomerReportByCreationDatePDF(
          creationDate,
        );

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=informe-clientes-creados-${date}.pdf`,
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de clientes por fecha de creación.',
      });
    }
  }
}
