import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Location } from './entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger('LocationsService');

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

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
      .select('city')
      .where('department = :department', { department })
      .execute();

    if (cities.length === 0) {
      throw new NotFoundException(
        `No se encontraron ciudades para el departamento '${department}'`,
      );
    }

    return cities.map((result) => result.city);
  }

  /**
   * @summary Calcular la distancia entre dos ciudades
   * @description Calcula la distancia en kilómetros entre dos ciudades.
   * @param cityOrigin Ciudad de origen.
   * @param destinationCity Ciudad de destino.
   * @returns Distancia en kilómetros entre las dos ciudades.
   * @throws NotFoundException Si una o ambas ciudades no se encuentran.
   */
  async calculateDistance(cityOrigin: string, destinationCity: string) {
    const [locationOrigin, location2] = await Promise.all([
      this.locationRepository.findOneBy({ city: cityOrigin }),
      this.locationRepository.findOneBy({ city: destinationCity }),
    ]);

    if (!locationOrigin || !location2) {
      throw new NotFoundException('Una o ambas ciudades no se encontraron');
    }

    const earthRadiusKm = 6371; // Radio de la Tierra en kilómetros

    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const deltaLat = toRadians(location2.latitude - locationOrigin.latitude);
    const deltaLon = toRadians(location2.longitude - locationOrigin.longitude);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(toRadians(locationOrigin.latitude)) *
        Math.cos(toRadians(location2.latitude)) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c;

    return distance;
  }
}
