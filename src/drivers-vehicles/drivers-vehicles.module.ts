import { Module } from '@nestjs/common';
import { DriversVehiclesService } from './drivers-vehicles.service';
import { DriversVehiclesController } from './drivers-vehicles.controller';
import { DriverVehicle } from './entities/driver-vehicle.entity';
import { VehiclesModule } from 'src/vehicles/vehicles.module';
import { EmployeesDriversModule } from 'src/employees-drivers/employees-drivers.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [DriversVehiclesController],
  providers: [DriversVehiclesService],
  exports: [DriversVehiclesService],
  imports: [
    TypeOrmModule.forFeature([DriverVehicle]),
    VehiclesModule,
    EmployeesDriversModule,
  ],
})
export class DriversVehiclesModule {}
