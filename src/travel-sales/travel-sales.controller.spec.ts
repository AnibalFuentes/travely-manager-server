import { Test, TestingModule } from '@nestjs/testing';
import { TravelSalesController } from './travel-sales.controller';
import { TravelSalesService } from './travel-sales.service';

describe('TravelSalesController', () => {
  let controller: TravelSalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelSalesController],
      providers: [TravelSalesService],
    }).compile();

    controller = module.get<TravelSalesController>(TravelSalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
