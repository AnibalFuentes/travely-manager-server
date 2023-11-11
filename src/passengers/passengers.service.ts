import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Passenger } from './entities/passenger.entity';
import { Repository } from 'typeorm';
import { PeopleService } from 'src/people/people.service';

@Injectable()
export class PassengersService {
  private readonly logger = new Logger('PassengersService');

  constructor(
    @InjectRepository(Passenger)
    private readonly customerRepository: Repository<Passenger>,
    private readonly personsService: PeopleService,
  ) {}

  private async getPassengerById(id: string): Promise<Passenger> {
    const passenger = await this.customerRepository
      .createQueryBuilder('passenger')
      .leftJoinAndSelect('passenger.person', 'person')
      .where('passenger.id = :id', { id })
      .getOne();

    return passenger;
  }

  async create(createPassengerDto: CreatePassengerDto) {

    const createPersonDto = createPassengerDto.person;

    try {
      const person = await this.personsService.create(createPersonDto);

      const passenger = this.customerRepository.create({
        person: person,
      });

      await this.customerRepository.save(passenger);
      return passenger;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [passengerss, total] = await this.customerRepository.findAndCount({
      relations: ['person'],
      take: limit,
      skip: offset,
    });

    return {
      customers: passengerss,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string) {
    const passenger = await this.getPassengerById(id);

    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }

    return passenger;
  }

  async update(id: string, updatePassengerDto: UpdatePassengerDto) {
    const passenger = await this.getPassengerById(id);

    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }

    if (updatePassengerDto.person) {
      const updatePersonDto = updatePassengerDto.person;
      Object.assign(passenger.person, updatePersonDto);
    }

    try {
      await this.customerRepository.save(passenger);
      return passenger;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const passenger = await this.getPassengerById(id);

    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }

    try {
      await this.customerRepository.remove(passenger);
      await this.personsService.remove(passenger.person.id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'An unexpected error occurred. Please check server logs.',
    );
  }
}
