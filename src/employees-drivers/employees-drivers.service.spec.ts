import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesDriversService } from './employees-drivers.service';

describe('EmployeesDriversService', () => {
  let service: EmployeesDriversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeesDriversService],
    }).compile();

    service = module.get<EmployeesDriversService>(EmployeesDriversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
