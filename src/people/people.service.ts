import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class PeopleService {
  private readonly logger = new Logger('PersonsService');

  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    const { identificationNumber, email, mobilePhone } = createPersonDto;

    const existingPersonWithIdentificationNumber =
      await this.personRepository.findOne({
        where: { identificationNumber },
      });

    if (existingPersonWithIdentificationNumber) {
      throw new ConflictException(
        'Ya existe una persona con el mismo número de identificación.',
      );
    }

    const existingPersonWithEmail = await this.personRepository.findOne({
      where: { email },
    });

    if (existingPersonWithEmail) {
      throw new ConflictException(
        'Ya existe una persona con la misma dirección de correo electrónico.',
      );
    }

    const existingPersonWithMobile = await this.personRepository.findOne({
      where: { mobilePhone },
    });

    if (existingPersonWithMobile) {
      throw new ConflictException(
        'Ya existe una persona con el mismo número de teléfono móvil.',
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

    if (!person)
      throw new NotFoundException(`Persona con ${term} no encontrada`);
    return person;
  }
  async update(id: string, updatePersonDto: UpdatePersonDto) {
    const person = await this.personRepository.preload({
      id: id,
      ...updatePersonDto,
    });

    if (!person)
      throw new NotFoundException(`Persona con ID ${id} no encontrada`);

    try {
      await this.personRepository.save(person);
      return person;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Se produjo un conflicto debido a datos duplicados.',
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
      'Se produjo un error inesperado. Por favor, revise los registros del servidor.',
    );
  }
}
