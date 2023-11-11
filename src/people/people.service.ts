import { Injectable, Logger,ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class PeopleService {
  private readonly logger = new Logger('PersonsService');

  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    const { identificationNumber, email, mobilePhone } =
      createPersonDto;

    const existingPersonWithIdentificationNumber =
      await this.personRepository.findOne({
        where: { identificationNumber },
      });

    if (existingPersonWithIdentificationNumber) {
      throw new ConflictException(
        'A person with the same identification number already exists.',
      );
    }

    const existingPersonWithEmail = await this.personRepository.findOne({
      where: { email },
    });

    if (existingPersonWithEmail) {
      throw new ConflictException(
        'A person with the same email address already exists.',
      );
    }

    const existingPersonWithMobile = await this.personRepository.findOne({
      where: { mobilePhone },
    });

    if (existingPersonWithMobile) {
      throw new ConflictException(
        'A person with the same mobile phone number already exists.',
      );
    }

    try {
      const person = this.personRepository.create(createPersonDto);
      await this.personRepository.save(person);
      return person;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};
    return this.personRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let person: Person;

    if (isUUID(term)) {
      person = await this.personRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.personRepository.createQueryBuilder('person');
      person = await queryBuilder
        .where(
          'firstName = :term OR lastName = :term OR identificationNumber = :term OR email = :term',
          {
            term: term.toLowerCase(),
          },
        )
        .getOne();
    }

    if (!person) throw new NotFoundException(`Person with ${term} not found`);
    return person;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    const person = await this.personRepository.preload({
      id: id,
      ...updatePersonDto,
    });

    if (!person) throw new NotFoundException(`Person with id ${id} not found`);

    try {
      await this.personRepository.save(person);
      return person;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'A conflict occurred due to duplicate data.',
        );
      } else {
        this.handleExceptions(error);
      }
    }
  }

  async remove(id: string) {
    const person = await this.findOne(id);
    await this.personRepository.remove(person);
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'An unexpected error occurred. Please check server logs.',
    );
  }
}
