import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { PeopleService } from 'src/people/people.service';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger('CustomersService');

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly peopleService: PeopleService,
  ) {}

  private async getCustomerById(id: string): Promise<Customer> {
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.person', 'person')
      .where('customer.id = :id', { id })
      .getOne();

    return customer;
  }

  /**
   * @summary Crear un nuevo cliente
   * @description Crea un nuevo cliente junto con la información de la persona asociada.
   * @param createCustomerDto Datos para crear el cliente.
   * @returns Cliente creado exitosamente.
   */
  async create(createCustomerDto: CreateCustomerDto) {
    const createPersonDto = createCustomerDto.person;

    try {
      const person = await this.peopleService.create(createPersonDto);

      const customer = this.customerRepository.create({
        person: person,
      });

      await this.customerRepository.save(customer);
      return customer;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Obtener todos los clientes con paginación
   * @description Obtiene una lista paginada de clientes junto con la información de la persona asociada.
   * @param paginationDto Datos de paginación.
   * @returns Lista de clientes con información de paginación.
   */
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [customers, total] = await this.customerRepository.findAndCount({
      relations: ['person'],
      take: limit,
      skip: offset,
    });

    return {
      customers,
      total,
      limit,
      offset,
    };
  }

  /**
   * @summary Obtener un cliente por ID
   * @description Obtiene un cliente por su ID junto con la información de la persona asociada.
   * @param id ID del cliente (UUID).
   * @returns Cliente encontrado exitosamente.
   * @throws NotFoundException si el cliente no existe.
   */
  async findOne(id: string) {
    const customer = await this.getCustomerById(id);

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return customer;
  }

  /**
   * @summary Actualizar un cliente por ID
   * @description Actualiza un cliente existente por su ID junto con la información de la persona asociada.
   * @param id ID del cliente (UUID).
   * @param updateCustomerDto Datos para actualizar el cliente.
   * @returns Cliente actualizado exitosamente.
   * @throws NotFoundException si el cliente no existe.
   */
  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.getCustomerById(id);

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    if (updateCustomerDto.person) {
      const updatePersonDto = updateCustomerDto.person;
      Object.assign(customer.person, updatePersonDto);
    }

    try {
      await this.customerRepository.save(customer);
      return customer;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Eliminar un cliente por ID
   * @description Elimina un cliente del sistema por su ID junto con la información de la persona asociada.
   * @param id ID del cliente (UUID).
   * @throws NotFoundException si el cliente no existe.
   */
  async remove(id: string) {
    const customer = await this.getCustomerById(id);

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    try {
      await this.customerRepository.remove(customer);
      await this.peopleService.remove(customer.person.id);
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
