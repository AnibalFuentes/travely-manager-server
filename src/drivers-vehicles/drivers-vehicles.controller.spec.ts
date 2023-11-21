import { Test, TestingModule } from '@nestjs/testing';
import { DriversVehiclesController } from './drivers-vehicles.controller';
import { DriversVehiclesService } from './drivers-vehicles.service';

describe('DriversVehiclesController', () => {
  let controller: DriversVehiclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversVehiclesController],
      providers: [DriversVehiclesService],
    }).compile();

    controller = module.get<DriversVehiclesController>(
      DriversVehiclesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
