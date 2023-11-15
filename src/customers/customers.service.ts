import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
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
  ) {}

  private async getCustomerById(id: string): Promise<Customer> {
    return this.customerRepository.findOneBy({ id: id });
  }

  /**
   * @summary Crear un nuevo cliente
   * @description Crea un nuevo cliente.
   * @param createCustomerDto Datos para crear el cliente.
   * @returns Cliente creado exitosamente.
   */
  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = this.customerRepository.create(createCustomerDto);
      await this.customerRepository.save(customer);
      return customer;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Obtener todos los clientes con paginación
   * @description Obtiene una lista paginada de clientes.
   * @param paginationDto Datos de paginación.
   * @returns Lista de clientes con información de paginación.
   */
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [customers, total] = await this.customerRepository.findAndCount({
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
   * @description Obtiene un cliente por su ID.
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
   * @description Actualiza un cliente existente por su ID.
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

    try {
      this.customerRepository.merge(customer, updateCustomerDto);
      await this.customerRepository.save(customer);
      return customer;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Eliminar un cliente por ID
   * @description Elimina un cliente del sistema por su ID.
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
