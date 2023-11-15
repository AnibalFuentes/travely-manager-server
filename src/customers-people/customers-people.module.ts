import { Module } from '@nestjs/common';
import { CustomersPeopleService } from './customers-people.service';
import { CustomersPeopleController } from './customers-people.controller';
import { PeopleModule } from 'src/people/people.module';
import { CustomerPerson } from './entities/customer-person.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CustomersPeopleController],
  providers: [CustomersPeopleService],
  imports: [TypeOrmModule.forFeature([CustomerPerson]), PeopleModule],
})
export class CustomersPeopleModule {}
