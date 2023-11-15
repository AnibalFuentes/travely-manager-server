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
} from '@nestjs/common';
import { CustomersPeopleService } from './customers-people.service';
import { CreateCustomerPersonDto } from './dto/create-customer-person.dto';
import { UpdateCustomerPersonDto } from './dto/update-customer-person.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CustomerPerson } from './entities/customer-person.entity';

@Auth(Role.User)
@ApiBearerAuth()
@ApiTags('Clientes de tipo persona')
@Controller('customers-people')
export class CustomersPeopleController {
  constructor(
    private readonly customersPeopleService: CustomersPeopleService,
  ) {}

  /**
   * @summary Crear un nuevo cliente de tipo persona
   * @description Crea un nuevo cliente de tipo persona.
   * @param createCustomerPersonDto Datos para crear el cliente de tipo persona.
   * @returns Respuesta de éxito al crear el cliente de tipo persona.
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente de tipo persona' })
  @ApiResponse({
    status: 201,
    description: 'El cliente de tipo persona ha sido creado exitosamente.',
    type: CustomerPerson,
  })
  create(@Body() createCustomerPersonDto: CreateCustomerPersonDto) {
    return this.customersPeopleService.create(createCustomerPersonDto);
  }

  /**
   * @summary Obtener una lista de clientes de tipo persona
   * @description Obtiene una lista de clientes de tipo persona.
   * @param paginationDto Datos de paginación.
   * @returns Lista de clientes de tipo persona recuperada exitosamente.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener una lista de clientes de tipo persona' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes de tipo persona recuperada exitosamente.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.customersPeopleService.findAll(paginationDto);
  }

  /**
   * @summary Obtener un cliente de tipo persona por ID
   * @description Obtiene un cliente de tipo persona por su ID.
   * @param id ID del cliente de tipo persona (UUID).
   * @returns Cliente de tipo persona recuperado por ID exitosamente.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente de tipo persona por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente de tipo persona (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente de tipo persona recuperado por ID exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente de tipo persona no encontrado.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersPeopleService.findOne(id);
  }

  /**
   * @summary Actualizar un cliente de tipo persona por ID
   * @description Actualiza un cliente de tipo persona por su ID.
   * @param id ID del cliente de tipo persona (UUID).
   * @param updateCustomerPersonDto Datos para actualizar el cliente de tipo persona.
   * @returns Cliente de tipo persona actualizado por ID exitosamente.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente de tipo persona por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente de tipo persona (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente de tipo persona actualizado por ID exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente de tipo persona no encontrado.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerPersonDto: UpdateCustomerPersonDto,
  ) {
    return this.customersPeopleService.update(id, updateCustomerPersonDto);
  }

  /**
   * @summary Eliminar un cliente de tipo persona por ID
   * @description Elimina un cliente de tipo persona por su ID.
   * @param id ID del cliente de tipo persona (UUID).
   * @returns Cliente de tipo persona eliminado por ID exitosamente.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cliente de tipo persona por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente de tipo persona (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente de tipo persona eliminado por ID exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente de tipo persona no encontrado.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.customersPeopleService.remove(id);
  }
}
