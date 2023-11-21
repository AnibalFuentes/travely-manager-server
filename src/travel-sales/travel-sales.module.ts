import { Module } from '@nestjs/common';
import { TravelSalesService } from './travel-sales.service';
import { TravelSalesController } from './travel-sales.controller';
import { TravelSale } from './entities/travel-sale.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsModule } from 'src/locations/locations.module';
import { DriversVehiclesModule } from 'src/drivers-vehicles/drivers-vehicles.module';
import { EmployeesOfficesModule } from 'src/employees-offices/employees-offices.module';

@Module({
  controllers: [TravelSalesController],
  providers: [TravelSalesService],
  exports: [TravelSalesService],
  imports: [
    TypeOrmModule.forFeature([TravelSale]),
    LocationsModule,
    DriversVehiclesModule,
    EmployeesOfficesModule,
  ],
})
export class TravelSalesModule {}
