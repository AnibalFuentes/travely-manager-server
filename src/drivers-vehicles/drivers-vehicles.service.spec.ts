import { Test, TestingModule } from '@nestjs/testing';
import { DriversVehiclesService } from './drivers-vehicles.service';

describe('DriversVehiclesService', () => {
  let service: DriversVehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriversVehiclesService],
    }).compile();

    service = module.get<DriversVehiclesService>(DriversVehiclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
