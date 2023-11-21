import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesOfficesService } from './employees-offices.service';

describe('EmployeesOfficesService', () => {
  let service: EmployeesOfficesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeesOfficesService],
    }).compile();

    service = module.get<EmployeesOfficesService>(EmployeesOfficesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
