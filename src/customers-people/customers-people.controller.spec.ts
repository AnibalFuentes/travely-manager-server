import { Test, TestingModule } from '@nestjs/testing';
import { CustomersPeopleController } from './customers-people.controller';
import { CustomersPeopleService } from './customers-people.service';

describe('CustomersPeopleController', () => {
  let controller: CustomersPeopleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersPeopleController],
      providers: [CustomersPeopleService],
    }).compile();

    controller = module.get<CustomersPeopleController>(CustomersPeopleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
