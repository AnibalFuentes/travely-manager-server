import { Module } from '@nestjs/common';
import { AssignVehiclesService } from './assign-vehicles.service';
import { AssignVehiclesController } from './assign-vehicles.controller';

@Module({
  controllers: [AssignVehiclesController],
  providers: [AssignVehiclesService],
})
export class AssignVehiclesModule {}
