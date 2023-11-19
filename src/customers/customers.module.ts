import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { PeopleModule } from 'src/people/people.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [
    TypeOrmModule.forFeature([Customer]),
    PeopleModule,
    CompaniesModule,
  ],
})
export class CustomersModule {}
