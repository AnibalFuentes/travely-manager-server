import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeSellerDto } from './dto/create-employee-seller.dto';
import { UpdateEmployeeSellerDto } from './dto/update-employee-seller.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EmployeeSeller } from './entities/employee-seller.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from 'src/employees/employees.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmployeesSellersService {
  private readonly logger = new Logger('EmployeeSellersService');

  constructor(
    @InjectRepository(EmployeeSeller)
    private readonly employeeSellerRepository: Repository<EmployeeSeller>,
    private readonly employeesService: EmployeesService,
  ) {}

  private async getEmployeeSellerById(id: string): Promise<EmployeeSeller> {
    const employeeSeller = await this.employeeSellerRepository
      .createQueryBuilder('employeeSeller')
      .leftJoinAndSelect('employeeSeller.employee', 'employee')
      .where('employeeSeller.id = :id', { id })
      .getOne();

    return employeeSeller;
  }

  /**
   * @summary Crear un nuevo vendedor
   * @description Crea un nuevo vendedor.
   * @param createEmployeeSellerDto Datos para crear el vendedor.
   * @returns Vendedor creado exitosamente.
   * @throws NotFoundException Si no se encuentra la persona asociada.
   * @throws InternalServerErrorException Si ocurre un error inesperado.
   */
  async create(createEmployeeSellerDto: CreateEmployeeSellerDto) {
    const createEmployeeDto = createEmployeeSellerDto.employee;

    try {
      const employee = await this.employeesService.create(createEmployeeDto);

      const employeeSeller = this.employeeSellerRepository.create({
        employee: employee,
      });

      await this.employeeSellerRepository.save(employeeSeller);
      return employeeSeller;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Obtener una lista de vendedores paginada
   * @description Obtiene una lista paginada de vendedores.
   * @param paginationDto Datos de paginación.
   * @returns Lista de vendedores paginada y detalles de paginación.
   */
  async findAll(paginationDto: PaginationDto): Promise<{
    employeeSellers: EmployeeSeller[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [employeeSellers, total] =
      await this.employeeSellerRepository.findAndCount({
        relations: ['employee'],
        take: limit,
        skip: offset,
      });

    return {
      employeeSellers: employeeSellers,
      total,
      limit,
      offset,
    };
  }

  /**
   * @summary Obtener un vendedor por ID
   * @description Obtiene un vendedor por su ID.
   * @param id ID del vendedor (UUID).
   * @returns Vendedor recuperado por ID exitosamente.
   * @throws NotFoundException Si el vendedor no se encuentra.
   */
  async findOne(id: string): Promise<EmployeeSeller> {
    const employeeSeller = await this.getEmployeeSellerById(id);

    if (!employeeSeller) {
      throw new NotFoundException(`Vendedor con ID ${id} no encontrado`);
    }

    return employeeSeller;
  }

  /**
   * @summary Actualizar un vendedor por ID
   * @description Actualiza un vendedor por su ID.
   * @param id ID del vendedor (UUID).
   * @param updateEmployeeSellerDto Datos para actualizar el vendedor.
   * @returns Vendedor actualizado por ID exitosamente.
   * @throws NotFoundException Si el vendedor no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al guardar.
   */
  async update(
    id: string,
    updateEmployeeSellerDto: UpdateEmployeeSellerDto,
  ): Promise<EmployeeSeller> {
    const employeeSeller = await this.getEmployeeSellerById(id);

    if (!employeeSeller) {
      throw new NotFoundException(`Vendedor con ID ${id} no encontrado`);
    }

    if (updateEmployeeSellerDto.employee) {
      const updatePersonDto = updateEmployeeSellerDto.employee;
      Object.assign(employeeSeller.employee, updatePersonDto);
    }

    try {
      await this.employeeSellerRepository.save(employeeSeller);
      return employeeSeller;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Eliminar un vendedor por ID
   * @description Elimina un vendedor por su ID.
   * @param id ID del vendedor (UUID).
   * @throws NotFoundException Si el vendedor no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al eliminar.
   */
  async remove(id: string): Promise<void> {
    const employeeSeller = await this.getEmployeeSellerById(id);

    if (!employeeSeller) {
      throw new NotFoundException(`Vendedor con ID ${id} no encontrado`);
    }

    try {
      await this.employeeSellerRepository.remove(employeeSeller);
      await this.employeesService.remove(employeeSeller.employee.id);
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
