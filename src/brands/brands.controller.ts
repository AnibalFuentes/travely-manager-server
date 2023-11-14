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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Brand } from './entities/brand.entity';
import { Role } from 'src/common/enums';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth(Role.Admin)
@ApiBearerAuth()
@ApiTags('Marcas')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  /**
   * @summary Crear una nueva marca
   * @description Crea una nueva entidad de marca en el sistema.
   * @param createBrandDto Datos para crear la marca.
   * @returns Respuesta de éxito al crear la marca.
   */
  @Post()
  @ApiOperation({
    summary: 'Crear una nueva marca',
    description: 'Crea una nueva entidad de marca en el sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'La marca se ha creado exitosamente.',
    type: Brand,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  /**
   * @summary Obtener una lista de marcas
   * @description Obtiene una lista de todas las entidades de marca en el sistema.
   * @returns Lista de marcas obtenida exitosamente.
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener una lista de marcas',
    description:
      'Obtiene una lista de todas las entidades de marca en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de marcas obtenida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  findAll() {
    return this.brandsService.findAll();
  }

  /**
   * @summary Encontrar una marca por ID o término de búsqueda
   * @description Encuentra una entidad de marca por su ID único o un término de búsqueda.
   * @param term Nombre o ID de la marca.
   * @returns Marca encontrada exitosamente.
   */
  @Get(':term')
  @ApiOperation({
    summary: 'Encontrar una marca por ID o término de búsqueda',
    description:
      'Encuentra una entidad de marca por su ID único o un término de búsqueda.',
  })
  @ApiParam({ name: 'term', description: 'Nombre o ID de la marca' })
  @ApiResponse({ status: 200, description: 'Marca encontrada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  findOne(@Param('term') term: string) {
    return this.brandsService.findOne(term);
  }

  /**
   * @summary Actualizar una marca por ID
   * @description Actualiza una entidad de marca existente por su ID único.
   * @param id ID único de la marca (UUID).
   * @param updateBrandDto Datos para actualizar la marca.
   * @returns Marca actualizada por ID exitosamente.
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una marca por ID',
    description: 'Actualiza una entidad de marca existente por su ID único.',
  })
  @ApiResponse({
    status: 200,
    description: 'La marca se ha actualizado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateBrandDto);
  }

  /**
   * @summary Eliminar una marca por ID
   * @description Elimina una entidad de marca del sistema por su ID único.
   * @param id ID único de la marca (UUID).
   * @returns La marca se ha eliminado exitosamente.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una marca por ID',
    description: 'Elimina una entidad de marca del sistema por su ID único.',
  })
  @ApiResponse({
    status: 204,
    description: 'La marca se ha eliminado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.remove(id);
  }
}
