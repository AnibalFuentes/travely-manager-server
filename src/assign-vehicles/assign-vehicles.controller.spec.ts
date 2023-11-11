import { Test, TestingModule } from '@nestjs/testing';
import { AssignVehiclesController } from './assign-vehicles.controller';
import { AssignVehiclesService } from './assign-vehicles.service';

describe('AssignVehiclesController', () => {
  let controller: AssignVehiclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignVehiclesController],
      providers: [AssignVehiclesService],
    }).compile();

    controller = module.get<AssignVehiclesController>(AssignVehiclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
