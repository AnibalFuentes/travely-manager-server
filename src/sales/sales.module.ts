import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sale } from './entities/sale.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';

@Module({
  controllers: [SalesController],
  providers: [SalesService],
  imports: [TypeOrmModule.forFeature([Sale])],
})
export class SalesModule {}
