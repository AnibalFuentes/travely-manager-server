import { Module } from '@nestjs/common';
import { TravelsService } from './travels.service';
import { TravelsController } from './travels.controller';
import { Travel } from './entities/travel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TravelsController],
  providers: [TravelsService],
  imports: [TypeOrmModule.forFeature([Travel])],
})
export class TravelsModule {}
