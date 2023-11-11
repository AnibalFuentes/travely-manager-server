import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesChiefsController } from './employees-chiefs.controller';
import { EmployeesChiefsService } from './employees-chiefs.service';

describe('EmployeesChiefsController', () => {
  let controller: EmployeesChiefsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesChiefsController],
      providers: [EmployeesChiefsService],
    }).compile();

    controller = module.get<EmployeesChiefsController>(EmployeesChiefsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
