import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { BrandsModule } from 'src/brands/brands.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService],
  imports: [BrandsModule, TypeOrmModule.forFeature([Vehicle])],
})
export class VehiclesModule {}
