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
import { PassengersService } from './passengers.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Passenger } from './entities/passenger.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.User)
@ApiBearerAuth()
@ApiTags('Pasajeros')
@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  /**
   * @summary Crear un nuevo pasajero
   * @description Crea un nuevo pasajero.
   * @param createPassengerDto Datos para crear el pasajero.
   * @returns Respuesta de éxito al crear el pasajero.
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pasajero' })
  @ApiResponse({
    status: 201,
    description: 'El pasajero ha sido creado exitosamente.',
    type: Passenger,
  })
  create(@Body() createPassengerDto: CreatePassengerDto) {
    return this.passengersService.create(createPassengerDto);
  }

  /**
   * @summary Obtener una lista de pasajeros
   * @description Obtiene una lista de pasajeros.
   * @param paginationDto Datos de paginación.
   * @returns Lista de pasajeros recuperada exitosamente.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener una lista de pasajeros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pasajeros recuperada exitosamente.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.passengersService.findAll(paginationDto);
  }

  /**
   * @summary Obtener un pasajero por ID
   * @description Obtiene un pasajero por su ID.
   * @param id ID del pasajero (UUID).
   * @returns Pasajero recuperado por ID exitosamente.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pasajero por ID' })
  @ApiParam({ name: 'id', description: 'ID del pasajero (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Pasajero recuperado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Pasajero no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.passengersService.findOne(id);
  }

  /**
   * @summary Actualizar un pasajero por ID
   * @description Actualiza un pasajero por su ID.
   * @param id ID del pasajero (UUID).
   * @param updatePassengerDto Datos para actualizar el pasajero.
   * @returns Pasajero actualizado por ID exitosamente.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un pasajero por ID' })
  @ApiParam({ name: 'id', description: 'ID del pasajero (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Pasajero actualizado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Pasajero no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePassengerDto: UpdatePassengerDto,
  ) {
    return this.passengersService.update(id, updatePassengerDto);
  }

  /**
   * @summary Eliminar un pasajero por ID
   * @description Elimina un pasajero por su ID.
   * @param id ID del pasajero (UUID).
   * @returns Pasajero eliminado por ID exitosamente.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un pasajero por ID' })
  @ApiParam({ name: 'id', description: 'ID del pasajero (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Pasajero eliminado por ID exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Pasajero no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.passengersService.remove(id);
  }

  // ... (otro código)

  /**
   * @summary Descargar un informe PDF de pasajeros
   * @description Descarga un informe en formato PDF que contiene la información de los pasajeros.
   * @param res Respuesta HTTP.
   * @returns Archivo PDF descargado.
   */
  @Get('pdf/download')
  @ApiOperation({
    summary: 'Descargar un informe PDF de pasajeros',
    description:
      'Descarga un informe en formato PDF que contiene la información de los pasajeros.',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo PDF de pasajeros descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de pasajeros.',
  })
  async downloadPDF(@Res() res): Promise<void> {
    try {
      const buffer = await this.passengersService.generateReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=informe-pasajeros.pdf',
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de pasajeros.',
      });
    }
  }
}
