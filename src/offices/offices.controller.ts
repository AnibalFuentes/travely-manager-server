import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OfficesService } from './offices.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Office } from './entities/office.entity';
import { Role } from 'src/common/enums';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth(Role.Admin)
@ApiBearerAuth()
@ApiTags('Oficinas')
@Controller('offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  /**
   * @summary Crear una nueva oficina
   * @description Crea una nueva entidad de oficina en el sistema.
   * @param createOfficeDto Datos para crear la oficina.
   * @returns Respuesta de éxito al crear la oficina.
   */
  @Post()
  @ApiOperation({
    summary: 'Crear una nueva oficina',
    description: 'Crea una nueva entidad de oficina en el sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'La oficina se ha creado exitosamente.',
    type: Office,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  create(@Body() createOfficeDto: CreateOfficeDto) {
    return this.officesService.create(createOfficeDto);
  }

  /**
   * @summary Obtener una lista de oficinas
   * @description Obtiene una lista de todas las entidades de oficina en el sistema.
   * @returns Lista de oficinas obtenida exitosamente.
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener una lista de oficinas',
    description:
      'Obtiene una lista de todas las entidades de oficina en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de oficinas obtenida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  findAll() {
    return this.officesService.findAll();
  }

  /**
   * @summary Encontrar una oficina por ID o término de búsqueda
   * @description Encuentra una entidad de oficina por su ID único o un término de búsqueda.
   * @param term Nombre o ID de la oficina.
   * @returns Oficina encontrada exitosamente.
   */
  @Get(':term')
  @ApiOperation({
    summary: 'Encontrar una oficina por ID o término de búsqueda',
    description:
      'Encuentra una entidad de oficina por su ID único o un término de búsqueda.',
  })
  @ApiParam({ name: 'term', description: 'Nombre o ID de la oficina' })
  @ApiResponse({ status: 200, description: 'Oficina encontrada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Oficina no encontrada' })
  findOne(@Param('term') term: string) {
    return this.officesService.findOne(term);
  }

  /**
   * @summary Actualizar una oficina por ID
   * @description Actualiza una entidad de oficina existente por su ID único.
   * @param id ID único de la oficina (UUID).
   * @param updateOfficeDto Datos para actualizar la oficina.
   * @returns Oficina actualizada por ID exitosamente.
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una oficina por ID',
    description: 'Actualiza una entidad de oficina existente por su ID único.',
  })
  @ApiResponse({
    status: 200,
    description: 'La oficina se ha actualizado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Oficina no encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOfficeDto: UpdateOfficeDto,
  ) {
    return this.officesService.update(id, updateOfficeDto);
  }

  /**
   * @summary Eliminar una oficina por ID
   * @description Elimina una entidad de oficina del sistema por su ID único.
   * @param id ID único de la oficina (UUID).
   * @returns La oficina se ha eliminado exitosamente.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una oficina por ID',
    description: 'Elimina una entidad de oficina del sistema por su ID único.',
  })
  @ApiResponse({
    status: 204,
    description: 'La oficina se ha eliminado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Oficina no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.officesService.remove(id);
  }
}
