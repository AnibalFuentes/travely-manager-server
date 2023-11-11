import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { EmployeesModule } from './employees/employees.module';
import { BrandsModule } from './brands/brands.module';
import { LocationsModule } from './locations/locations.module';
import { OfficesModule } from './offices/offices.module';
import { CompaniesModule } from './companies/companies.module';
import { PeopleModule } from './people/people.module';
import { SalesModule } from './sales/sales.module';
import { SalesOrdersModule } from './sales-orders/sales-orders.module';
import { AssignVehiclesModule } from './assign-vehicles/assign-vehicles.module';
import { EmployeesOfficesModule } from './employees-offices/employees-offices.module';
import { EmployeesDriversModule } from './employees-drivers/employees-drivers.module';
import { EmployeesChiefsModule } from './employees-chiefs/employees-chiefs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CommonModule,
    UsersModule,
    AuthModule,
    CustomersModule,
    VehiclesModule,
    EmployeesModule,
    BrandsModule,
    LocationsModule,
    OfficesModule,
    CompaniesModule,
    PeopleModule,
    SalesModule,
    SalesOrdersModule,
    AssignVehiclesModule,
    EmployeesOfficesModule,
    EmployeesDriversModule,
    EmployeesChiefsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
