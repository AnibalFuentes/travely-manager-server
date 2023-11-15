import { Test, TestingModule } from '@nestjs/testing';
import { CustomersCompaniesController } from './customers-companies.controller';
import { CustomersCompaniesService } from './customers-companies.service';

describe('CustomersCompaniesController', () => {
  let controller: CustomersCompaniesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersCompaniesController],
      providers: [CustomersCompaniesService],
    }).compile();

    controller = module.get<CustomersCompaniesController>(CustomersCompaniesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
