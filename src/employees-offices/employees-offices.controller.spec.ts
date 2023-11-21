import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesOfficesController } from './employees-offices.controller';
import { EmployeesOfficesService } from './employees-offices.service';

describe('EmployeesOfficesController', () => {
  let controller: EmployeesOfficesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesOfficesController],
      providers: [EmployeesOfficesService],
    }).compile();

    controller = module.get<EmployeesOfficesController>(EmployeesOfficesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
