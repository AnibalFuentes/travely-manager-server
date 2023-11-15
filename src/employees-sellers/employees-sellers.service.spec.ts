import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesSellersService } from './employees-sellers.service';

describe('EmployeesSellersService', () => {
  let service: EmployeesSellersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeesSellersService],
    }).compile();

    service = module.get<EmployeesSellersService>(EmployeesSellersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
