import { Test, TestingModule } from '@nestjs/testing';
import { AssignVehiclesService } from './assign-vehicles.service';

describe('AssignVehiclesService', () => {
  let service: AssignVehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignVehiclesService],
    }).compile();

    service = module.get<AssignVehiclesService>(AssignVehiclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
