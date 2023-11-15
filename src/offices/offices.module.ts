import { Module } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { OfficesController } from './offices.controller';
import { Office } from './entities/office.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [OfficesController],
  providers: [OfficesService],
  imports: [TypeOrmModule.forFeature([Office])],
})
export class OfficesModule {}
