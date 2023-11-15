import { Module } from '@nestjs/common';
import { CustomersCompaniesService } from './customers-companies.service';
import { CustomersCompaniesController } from './customers-companies.controller';
import { CustomerCompany } from './entities/customer-company.entity';
import { CompaniesModule } from '../companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CustomersCompaniesController],
  providers: [CustomersCompaniesService],
  imports: [TypeOrmModule.forFeature([CustomerCompany]), CompaniesModule],
})
export class CustomersCompaniesModule {}
