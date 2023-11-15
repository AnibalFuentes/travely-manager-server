import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.User)
@ApiBearerAuth()
@ApiTags('Locaciones')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('departments')
  @ApiOperation({
    summary: 'Obtener lista de departamentos',
    description: 'Devuelve una lista de departamentos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de departamentos recuperada exitosamente.',
    type: String, // Cambia el tipo según la respuesta real
    isArray: true,
  })
  async getDepartments() {
    return this.locationsService.getDepartments();
  }

  @Get('cities/:department')
  @ApiOperation({
    summary: 'Obtener lista de ciudades por departamento',
    description:
      'Devuelve una lista de ciudades para el departamento proporcionado.',
  })
  @ApiParam({
    name: 'department',
    description: 'Nombre del departamento para el cual se buscan las ciudades.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ciudades por departamento recuperada exitosamente.',
    type: String, // Cambia el tipo según la respuesta real
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description:
      'No se encontraron ciudades para el departamento proporcionado.',
  })
  async getCitiesByDepartment(@Param('department') department: string) {
    try {
      return this.locationsService.getCitiesByDepartment(department);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `No se encontraron ciudades para el departamento '${department}'`,
        );
      }
      throw error;
    }
  }

  @Get('distance/:cityOrigin/:destinationCity')
  @ApiOperation({
    summary: 'Calcular distancia entre ciudades',
    description: 'Calcula la distancia entre dos ciudades proporcionadas.',
  })
  @ApiParam({
    name: 'cityOrigin',
    description: 'Nombre de la ciudad de origen.',
  })
  @ApiParam({
    name: 'destinationCity',
    description: 'Nombre de la ciudad de destino.',
  })
  @ApiResponse({
    status: 200,
    description: 'Distancia calculada exitosamente.',
    type: Number, // Cambia el tipo según la respuesta real
  })
  @ApiResponse({
    status: 404,
    description: 'Una o más ciudades no fueron encontradas.',
  })
  async calculateDistance(
    @Param('cityOrigin') cityOrigin: string,
    @Param('destinationCity') destinationCity: string,
  ) {
    try {
      return this.locationsService.calculateDistance(
        cityOrigin,
        destinationCity,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'Una o más ciudades no fueron encontradas.',
        );
      }
      throw error;
    }
  }
}
