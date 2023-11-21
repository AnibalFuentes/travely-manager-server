import { Test, TestingModule } from '@nestjs/testing';
import { TravelSalesService } from './travel-sales.service';

describe('TravelSalesService', () => {
  let service: TravelSalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelSalesService],
    }).compile();

    service = module.get<TravelSalesService>(TravelSalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
