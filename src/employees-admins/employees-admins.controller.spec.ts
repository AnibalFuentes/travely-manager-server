import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesAdminsController } from './employees-admins.controller';
import { EmployeesAdminsService } from './employees-admins.service';

describe('EmployeesAdminsController', () => {
  let controller: EmployeesAdminsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesAdminsController],
      providers: [EmployeesAdminsService],
    }).compile();

    controller = module.get<EmployeesAdminsController>(EmployeesAdminsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
