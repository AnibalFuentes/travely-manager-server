import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { Location } from './entities/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
  imports: [TypeOrmModule.forFeature([Location])],
})
export class LocationsModule {}
