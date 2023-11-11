import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesChiefsService } from './employees-chiefs.service';

describe('EmployeesChiefsService', () => {
  let service: EmployeesChiefsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeesChiefsService],
    }).compile();

    service = module.get<EmployeesChiefsService>(EmployeesChiefsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
