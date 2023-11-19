import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesAdminsService } from './employees-admins.service';

describe('EmployeesAdminsService', () => {
  let service: EmployeesAdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeesAdminsService],
    }).compile();

    service = module.get<EmployeesAdminsService>(EmployeesAdminsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
