import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';

@Module({
  controllers: [],
  providers: [PeopleService],
  exports: [PeopleService],
  imports: [TypeOrmModule.forFeature([Person])],
})
export class PeopleModule {}
