import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Person } from './entities/person.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.User)
@ApiBearerAuth()
@ApiTags('Personas')
@Controller('persons')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  /**
   * @summary Crear una nueva persona
   * @description Crea una nueva entidad de persona en el sistema.
   * @param createPersonDto Datos de la persona a crear.
   * @returns La persona ha sido creada exitosamente.
   */
  @Post()
  @ApiOperation({
    summary: 'Crear una nueva persona',
    description: 'Crea una nueva entidad de persona en el sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'La persona ha sido creada exitosamente.',
    type: Person,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  /**
   * @summary Obtener una lista de personas con paginación
   * @description Recupera una lista paginada de entidades de persona en el sistema.
   * @param paginationDto Datos de paginación.
   * @returns Lista de personas recuperada exitosamente.
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener una lista de personas con paginación',
    description: 'Recupera una lista paginada de entidades de persona en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de personas obtenida exitosamente.',
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
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  findAll(paginationDto: PaginationDto) {
    return this.peopleService.findAll(paginationDto);
  }

  /**
   * @summary Encontrar una persona por ID o término de búsqueda
   * @description Encuentra una entidad de persona por su ID único o un término de búsqueda.
   * @param term Término de búsqueda (nombre, número de identificación, correo electrónico o ID).
   * @returns Persona encontrada exitosamente.
   */
  @Get(':term')
  @ApiOperation({
    summary: 'Encontrar una persona por ID o término de búsqueda',
    description: 'Encuentra una entidad de persona por su ID único o un término de búsqueda.',
  })
  @ApiParam({
    name: 'term',
    description: 'nombre, número de identificación, correo electrónico o ID de la persona',
  })
  @ApiResponse({ status: 200, description: 'Persona encontrada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  findOne(@Param('term') term: string) {
    return this.peopleService.findOne(term);
  }

  /**
   * @summary Actualizar una persona por ID
   * @description Actualiza una entidad de persona existente por su ID único.
   * @param id ID único de la persona a actualizar.
   * @param updatePersonDto Datos actualizados de la persona.
   * @returns La persona ha sido actualizada exitosamente.
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una persona por ID',
    description: 'Actualiza una entidad de persona existente por su ID único.',
  })
  @ApiResponse({
    status: 200,
    description: 'La persona ha sido actualizada exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return this.peopleService.update(id, updatePersonDto);
  }

  /**
   * @summary Eliminar una persona por ID
   * @description Elimina una entidad de persona del sistema por su ID único.
   * @param id ID único de la persona a eliminar.
   * @returns La persona ha sido eliminada exitosamente.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una persona por ID',
    description: 'Elimina una entidad de persona del sistema por su ID único.',
  })
  @ApiResponse({
    status: 204,
    description: 'La persona ha sido eliminada exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.peopleService.remove(id);
  }
}