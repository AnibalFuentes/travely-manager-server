import { Test, TestingModule } from '@nestjs/testing';
import { PassengersTravelSalesService } from './passengers-travel-sales.service';

describe('PassengersTravelSalesService', () => {
  let service: PassengersTravelSalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassengersTravelSalesService],
    }).compile();

    service = module.get<PassengersTravelSalesService>(PassengersTravelSalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
