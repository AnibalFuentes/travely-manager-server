import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
    private readonly passengerRepository: Repository<Passenger>,
    private readonly personsService: PeopleService,
  ) {}

  private async getPassengerById(id: string): Promise<Passenger> {
    const passenger = await this.passengerRepository
      .createQueryBuilder('passenger')
      .leftJoinAndSelect('passenger.person', 'person')
      .where('passenger.id = :id', { id })
      .getOne();

    return passenger;
  }

  /**
   * @summary Crear un nuevo pasajero
   * @description Crea un nuevo pasajero.
   * @param createPassengerDto Datos para crear el pasajero.
   * @returns Pasajero creado exitosamente.
   * @throws NotFoundException Si no se encuentra la persona asociada.
   * @throws InternalServerErrorException Si ocurre un error inesperado.
   */
  async create(createPassengerDto: CreatePassengerDto): Promise<Passenger> {
    const createPersonDto = createPassengerDto.person;

    try {
      const person = await this.personsService.create(createPersonDto);

      const passenger = this.passengerRepository.create({
        person: person,
      });

      await this.passengerRepository.save(passenger);
      return passenger;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Obtener una lista de pasajeros paginada
   * @description Obtiene una lista paginada de pasajeros.
   * @param paginationDto Datos de paginación.
   * @returns Lista de pasajeros paginada y detalles de paginación.
   */
  async findAll(paginationDto: PaginationDto): Promise<{
    passengers: Passenger[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [passengers, total] = await this.passengerRepository.findAndCount({
      relations: ['person'],
      take: limit,
      skip: offset,
    });

    return {
      passengers: passengers,
      total,
      limit,
      offset,
    };
  }

  /**
   * @summary Obtener un pasajero por ID
   * @description Obtiene un pasajero por su ID.
   * @param id ID del pasajero (UUID).
   * @returns Pasajero recuperado por ID exitosamente.
   * @throws NotFoundException Si el pasajero no se encuentra.
   */
  async findOne(id: string): Promise<Passenger> {
    const passenger = await this.getPassengerById(id);

    if (!passenger) {
      throw new NotFoundException(`Pasajero con ID ${id} no encontrado`);
    }

    return passenger;
  }

  /**
   * @summary Actualizar un pasajero por ID
   * @description Actualiza un pasajero por su ID.
   * @param id ID del pasajero (UUID).
   * @param updatePassengerDto Datos para actualizar el pasajero.
   * @returns Pasajero actualizado por ID exitosamente.
   * @throws NotFoundException Si el pasajero no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al guardar.
   */
  async update(
    id: string,
    updatePassengerDto: UpdatePassengerDto,
  ): Promise<Passenger> {
    const passenger = await this.getPassengerById(id);

    if (!passenger) {
      throw new NotFoundException(`Pasajero con ID ${id} no encontrado`);
    }

    if (updatePassengerDto.person) {
      const updatePersonDto = updatePassengerDto.person;
      Object.assign(passenger.person, updatePersonDto);
    }

    try {
      await this.passengerRepository.save(passenger);
      return passenger;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Eliminar un pasajero por ID
   * @description Elimina un pasajero por su ID.
   * @param id ID del pasajero (UUID).
   * @throws NotFoundException Si el pasajero no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al eliminar.
   */
  async remove(id: string): Promise<void> {
    const passenger = await this.getPassengerById(id);

    if (!passenger) {
      throw new NotFoundException(`Pasajero con ID ${id} no encontrado`);
    }

    try {
      await this.passengerRepository.remove(passenger);
      await this.personsService.remove(passenger.person.id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'Se produjo un error inesperado. Por favor, revise los registros del servidor.',
    );
  }
}
