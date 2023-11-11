import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesDriversController } from './employees-drivers.controller';
import { EmployeesDriversService } from './employees-drivers.service';

describe('EmployeesDriversController', () => {
  let controller: EmployeesDriversController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesDriversController],
      providers: [EmployeesDriversService],
    }).compile();

    controller = module.get<EmployeesDriversController>(EmployeesDriversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
