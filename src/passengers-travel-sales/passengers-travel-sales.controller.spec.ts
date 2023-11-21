import { Test, TestingModule } from '@nestjs/testing';
import { PassengersTravelSalesController } from './passengers-travel-sales.controller';
import { PassengersTravelSalesService } from './passengers-travel-sales.service';

describe('PassengersTravelSalesController', () => {
  let controller: PassengersTravelSalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengersTravelSalesController],
      providers: [PassengersTravelSalesService],
    }).compile();

    controller = module.get<PassengersTravelSalesController>(PassengersTravelSalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
