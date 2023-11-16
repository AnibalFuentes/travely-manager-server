import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
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

  @Get(':cityOrigin/:destinationCity')
  @ApiOperation({
    summary: 'Calcular distancia y duración entre ciudades',
    description:
      'Calcula la distancia y duración entre dos ciudades proporcionadas.',
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
    description: 'Distancia y duración calculadas exitosamente.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'Una o más ciudades no fueron encontradas.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  async calculateDistanceAndDuration(
    @Param('cityOrigin') cityOrigin: string,
    @Param('destinationCity') destinationCity: string,
  ) {
    const result = await this.locationsService.calculateDistanceAndDuration(
      cityOrigin,
      destinationCity,
      60,
    );
    return result;
  }
}
