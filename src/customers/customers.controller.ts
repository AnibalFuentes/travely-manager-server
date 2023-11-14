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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Customer } from './entities/customer.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.User)
@ApiBearerAuth()
@ApiTags('Clientes')
@Controller('clientes')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /**
   * @summary Crear un nuevo cliente
   * @description Crea un nuevo cliente con la información proporcionada.
   * @param createCustomerDto Datos para crear el cliente.
   * @returns Cliente creado exitosamente.
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({
    status: 201,
    description: 'El cliente se ha creado exitosamente.',
    type: Customer,
  })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  /**
   * @summary Obtener una lista de clientes con paginación
   * @description Obtiene una lista paginada de todos los clientes.
   * @param paginationDto Datos de paginación.
   * @returns Lista de clientes con información de paginación.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener una lista de clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes recuperada.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.customersService.findAll(paginationDto);
  }

  /**
   * @summary Obtener un cliente por ID
   * @description Obtiene un cliente por su ID.
   * @param id ID del cliente (UUID).
   * @returns Cliente encontrado exitosamente.
   * @throws NotFoundException si el cliente no existe.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({ name: 'id', description: 'UUID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente recuperado por ID.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  /**
   * @summary Actualizar un cliente por ID
   * @description Actualiza un cliente existente por su ID.
   * @param id ID del cliente (UUID).
   * @param updateCustomerDto Datos para actualizar el cliente.
   * @returns Cliente actualizado exitosamente.
   * @throws NotFoundException si el cliente no existe.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente por ID' })
  @ApiParam({ name: 'id', description: 'UUID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado por ID.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
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
   * @returns Promesa que se resuelve una vez que el cliente ha sido eliminado.
   * @throws NotFoundException si el cliente no existe.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cliente por ID' })
  @ApiParam({ name: 'id', description: 'UUID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado por ID.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.customersService.remove(id);
  }
}
