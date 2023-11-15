import { Test, TestingModule } from '@nestjs/testing';
import { CustomersCompaniesService } from './customers-companies.service';

describe('CustomersCompaniesService', () => {
  let service: CustomersCompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersCompaniesService],
    }).compile();

    service = module.get<CustomersCompaniesService>(CustomersCompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
