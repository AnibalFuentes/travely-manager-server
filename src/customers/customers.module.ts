import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { PeopleModule } from 'src/people/people.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [],
  providers: [CustomersService],
  imports: [TypeOrmModule.forFeature([Customer]), PeopleModule],
})
export class CustomersModule {}
