import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';

@Module({
  controllers: [PeopleController],
  providers: [PeopleService],
  imports: [TypeOrmModule.forFeature([Person])],
  exports: [PeopleService],
})
export class PeopleModule {}
