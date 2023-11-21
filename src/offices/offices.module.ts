import { Module } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { OfficesController } from './offices.controller';
import { Office } from './entities/office.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsModule } from 'src/locations/locations.module';
import { EmployeesChiefsModule } from 'src/employees-chiefs/employees-chiefs.module';

@Module({
  controllers: [OfficesController],
  providers: [OfficesService],
  exports: [OfficesService],
  imports: [
    TypeOrmModule.forFeature([Office]),
    LocationsModule,
    EmployeesChiefsModule,
  ],
})
export class OfficesModule {}
