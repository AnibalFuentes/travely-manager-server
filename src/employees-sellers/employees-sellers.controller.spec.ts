import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesSellersController } from './employees-sellers.controller';
import { EmployeesSellersService } from './employees-sellers.service';

describe('EmployeesSellersController', () => {
  let controller: EmployeesSellersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesSellersController],
      providers: [EmployeesSellersService],
    }).compile();

    controller = module.get<EmployeesSellersController>(EmployeesSellersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
