import { Injectable } from '@nestjs/common';
import { LocationsService } from 'src/locations/locations.service';
import { initialData } from './data/seed.data';

@Injectable()
export class SeedService {
  constructor(private readonly locationsService: LocationsService) {}

  async run() {
    await this.insertData(this.locationsService, initialData.locations);
    return 'Semilla exitosa.';
  }

  private async insertData(service: any, data: any[]) {
    await service.removeAll();

    const insertPromises = data.map((item) => service.create(item));

    await Promise.all(insertPromises);

    return true;
  }
}
