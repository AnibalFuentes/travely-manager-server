import { Module } from '@nestjs/common';
import { PassengersTravelSalesService } from './passengers-travel-sales.service';
import { PassengersTravelSalesController } from './passengers-travel-sales.controller';
import { PassengerTravelSale } from './entities/passenger-travel-sale.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengersModule } from 'src/passengers/passengers.module';
import { TravelSalesModule } from 'src/travel-sales/travel-sales.module';

@Module({
  controllers: [PassengersTravelSalesController],
  providers: [PassengersTravelSalesService],
  imports: [
    TypeOrmModule.forFeature([PassengerTravelSale]),
    PassengersModule,
    TravelSalesModule,
  ],
})
export class PassengersTravelSalesModule {}
