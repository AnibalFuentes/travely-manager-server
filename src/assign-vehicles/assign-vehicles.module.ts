import { Module } from '@nestjs/common';
import { AssignVehiclesService } from './assign-vehicles.service';
import { AssignVehiclesController } from './assign-vehicles.controller';
import { AssignVehicle } from './entities/assign-vehicle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesModule } from 'src/vehicles/vehicles.module';
import { EmployeesDriversModule } from 'src/employees-drivers/employees-drivers.module';

@Module({
  controllers: [AssignVehiclesController],
  providers: [AssignVehiclesService],
  imports: [
    TypeOrmModule.forFeature([AssignVehicle]),
    VehiclesModule,
    EmployeesDriversModule,
  ],
})
export class AssignVehiclesModule {}
