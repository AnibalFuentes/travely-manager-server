import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerPersonDto } from './dto/create-customer-person.dto';
import { UpdateCustomerPersonDto } from './dto/update-customer-person.dto';
import { PeopleService } from 'src/people/people.service';
import { CustomerPerson } from './entities/customer-person.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class CustomersPeopleService {
  private readonly logger = new Logger('CustomersPersonsService');

  constructor(
    @InjectRepository(CustomerPerson)
    private readonly customerPersonRepository: Repository<CustomerPerson>,
    private readonly peopleService: PeopleService,
  ) {}

  private async getCustomerPersonById(id: string): Promise<CustomerPerson> {
    const customerPerson = await this.customerPersonRepository
      .createQueryBuilder('customerPerson')
      .leftJoinAndSelect('customerPerson.person', 'person')
      .where('customerPerson.id = :id', { id })
      .getOne();

    return customerPerson;
  }

  /**
   * @summary Crear un nuevo jefe de empleado
   * @description Crea un nuevo jefe de empleado.
   * @param createCustomerPersonDto Datos para crear el jefe de empleado.
   * @returns Jefe de empleado creado exitosamente.
   * @throws NotFoundException Si no se encuentra la persona asociada.
   * @throws InternalServerErrorException Si ocurre un error inesperado.
   */
  async create(createCustomerPersonDto: CreateCustomerPersonDto) {
    const createEmployeeDto = createCustomerPersonDto.person;

    try {
      const person = await this.peopleService.create(createEmployeeDto);

      const customerPerson = this.customerPersonRepository.create({
        person: person,
      });

      await this.customerPersonRepository.save(customerPerson);
      return customerPerson;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Obtener una lista de jefes de empleado paginada
   * @description Obtiene una lista paginada de jefes de empleado.
   * @param paginationDto Datos de paginación.
   * @returns Lista de jefes de empleado paginada y detalles de paginación.
   */
  async findAll(paginationDto: PaginationDto): Promise<{
    customerPersons: CustomerPerson[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [customerPersons, total] =
      await this.customerPersonRepository.findAndCount({
        relations: ['person'],
        take: limit,
        skip: offset,
      });

    return {
      customerPersons: customerPersons,
      total,
      limit,
      offset,
    };
  }

  /**
   * @summary Obtener un jefe de empleado por ID
   * @description Obtiene un jefe de empleado por su ID.
   * @param id ID del jefe de empleado (UUID).
   * @returns Jefe de empleado recuperado por ID exitosamente.
   * @throws NotFoundException Si el jefe de empleado no se encuentra.
   */
  async findOne(id: string) {
    const customerPerson = await this.getCustomerPersonById(id);

    if (!customerPerson) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    return customerPerson;
  }

  /**
   * @summary Actualizar un jefe de empleado por ID
   * @description Actualiza un jefe de empleado por su ID.
   * @param id ID del jefe de empleado (UUID).
   * @param updateCustomerPersonDto Datos para actualizar el jefe de empleado.
   * @returns Jefe de empleado actualizado por ID exitosamente.
   * @throws NotFoundException Si el jefe de empleado no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al guardar.
   */
  async update(id: string, updateCustomerPersonDto: UpdateCustomerPersonDto) {
    const customerPerson = await this.getCustomerPersonById(id);

    if (!customerPerson) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    if (updateCustomerPersonDto.person) {
      const updatePersonDto = updateCustomerPersonDto.person;
      Object.assign(customerPerson.person, updatePersonDto);
    }

    try {
      await this.customerPersonRepository.save(customerPerson);
      return customerPerson;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Eliminar un jefe de empleado por ID
   * @description Elimina un jefe de empleado por su ID.
   * @param id ID del jefe de empleado (UUID).
   * @throws NotFoundException Si el jefe de empleado no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al eliminar.
   */
  async remove(id: string): Promise<void> {
    const customerPerson = await this.getCustomerPersonById(id);

    if (!customerPerson) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    try {
      await this.customerPersonRepository.remove(customerPerson);
      await this.peopleService.remove(customerPerson.person.id);
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
