import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Location } from './entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { validate as isUUID } from 'uuid';
@Injectable()
export class LocationsService {
  private readonly logger = new Logger('LocationsService');

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    try {
      const location = this.locationRepository.create(createLocationDto);
      await this.locationRepository.save(location);
      return location;
    } catch (error) {}
  }

  /**
   * @summary Obtener departamentos únicos
   * @description Obtiene una lista de departamentos únicos.
   * @returns Lista de departamentos únicos.
   */
  async getDepartments() {
    const departments = await this.locationRepository
      .createQueryBuilder()
      .select('DISTINCT department')
      .execute();

    return departments.map((result) => result.department);
  }

  /**
   * @summary Obtener ciudades por departamento
   * @description Obtiene una lista de ciudades para un departamento específico.
   * @param department Nombre del departamento.
   * @returns Lista de ciudades para el departamento especificado.
   * @throws NotFoundException Si no se encuentran ciudades para el departamento.
   */
  async getCitiesByDepartment(department: string) {
    const cities = await this.locationRepository
      .createQueryBuilder()
      .select(['id', 'city']) // Agregar 'id' a la selección
      .where('department = :department', { department })
      .execute();

    if (cities.length === 0) {
      throw new NotFoundException(
        `No se encontraron ciudades para el departamento '${department}'`,
      );
    }

    return cities;
  }

  /**
   * @summary Calcular la distancia entre dos ciudades
   * @description Calcula la distancia en kilómetros entre dos ciudades.
   * @param cityOrigin Ciudad de origen.
   * @param destinationCity Ciudad de destino.
   * @returns Distancia en kilómetros entre las dos ciudades.
   * @throws NotFoundException Si una o ambas ciudades no se encuentran.
   */
  async calculateDistanceAndDuration(
    cityOrigin: string,
    destinationCity: string,
    averageSpeedKmPerHour: number,
  ) {
    // Validación de parámetros
    if (
      typeof cityOrigin !== 'string' ||
      typeof destinationCity !== 'string' ||
      typeof averageSpeedKmPerHour !== 'number'
    ) {
      throw new BadRequestException('Parámetros inválidos');
    }

    try {
      // Obtener ubicaciones
      const [locationOrigin, location2] = await Promise.all([
        this.locationRepository.findOneBy({ city: cityOrigin }),
        this.locationRepository.findOneBy({ city: destinationCity }),
      ]);

      // Validar velocidad promedio
      if (averageSpeedKmPerHour <= 0) {
        throw new BadRequestException(
          'La velocidad promedio debe ser mayor que 0',
        );
      }

      // Validar ubicaciones
      if (!locationOrigin) {
        throw new NotFoundException(
          `La ciudad de origen '${cityOrigin}' no se encontró`,
        );
      }

      if (!location2) {
        throw new NotFoundException(
          `La ciudad de destino '${destinationCity}' no se encontró`,
        );
      }

      // Convertir grados a radianes
      const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

      // Calcular la diferencia en latitud y longitud en radianes
      const deltaLat = toRadians(location2.latitude - locationOrigin.latitude);
      const deltaLon = toRadians(
        location2.longitude - locationOrigin.longitude,
      );

      // Fórmula de Haversine para calcular la distancia
      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(toRadians(locationOrigin.latitude)) *
          Math.cos(toRadians(location2.latitude)) *
          Math.sin(deltaLon / 2) *
          Math.sin(deltaLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // Calcular la distancia en kilómetros
      const distance = 6371 * c; // Radio de la Tierra en kilómetros

      // Calcular la duración en horas
      const durationHours = distance / averageSpeedKmPerHour;

      // Redondear valores a 2 decimales
      const roundedDistance = Number(distance.toFixed(2));
      const roundedDuration = Number(durationHours.toFixed(2));

      return {
        distance: roundedDistance,
        duration: roundedDuration,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error al calcular la distancia y duración',
        );
      }
    }
  }

  async findOne(term: string) {
    let location: Location;

    if (isUUID(term)) {
      location = await this.locationRepository.findOneBy({ id: term });
    } else {
      const queryBuilder =
        this.locationRepository.createQueryBuilder('location');
      location = await queryBuilder
        .where('LOWER(location.city) = :term', {
          term: term.toLowerCase(),
        })
        .orWhere('LOWER(location.department) = :term', {
          term: term.toLowerCase(),
        })
        .getOne();
    }

    if (!location) {
      throw new NotFoundException(`Ubicación con ${term} no encontrada`);
    }

    return location;
  }

  async removeAll() {
    const query = this.locationRepository.createQueryBuilder('location');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {}
  }
}
