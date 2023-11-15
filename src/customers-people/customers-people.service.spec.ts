import { Test, TestingModule } from '@nestjs/testing';
import { CustomersPeopleService } from './customers-people.service';

describe('CustomersPeopleService', () => {
  let service: CustomersPeopleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersPeopleService],
    }).compile();

    service = module.get<CustomersPeopleService>(CustomersPeopleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
