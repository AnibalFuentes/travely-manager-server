import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PeopleService } from 'src/people/people.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger('EmployeesService');

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly personsService: PeopleService,
  ) {}

  private async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.person', 'person')
      .where('employee.id = :id', { id })
      .getOne();

    return employee;
  }

  /**
   * @summary Crear un nuevo empleado
   * @description Crea un nuevo empleado.
   * @param createEmployeeDto Datos para crear el empleado.
   * @returns Empleado creado exitosamente.
   * @throws NotFoundException Si no se encuentra la persona asociada.
   * @throws InternalServerErrorException Si ocurre un error inesperado.
   */
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const createPersonDto = createEmployeeDto.person;

    try {
      const person = await this.personsService.create(createPersonDto);

      const employee = this.employeeRepository.create({
        person: person,
      });

      await this.employeeRepository.save(employee);
      return employee;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Obtener una lista de empleados paginada
   * @description Obtiene una lista paginada de empleados.
   * @param paginationDto Datos de paginación.
   * @returns Lista de empleados paginada y detalles de paginación.
   */
  async findAll(paginationDto: PaginationDto): Promise<{
    employees: Employee[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [employees, total] = await this.employeeRepository.findAndCount({
      relations: ['person'],
      take: limit,
      skip: offset,
    });

    return {
      employees: employees,
      total,
      limit,
      offset,
    };
  }

  /**
   * @summary Obtener un empleado por ID
   * @description Obtiene un empleado por su ID.
   * @param id ID del empleado (UUID).
   * @returns Empleado recuperado por ID exitosamente.
   * @throws NotFoundException Si el empleado no se encuentra.
   */
  async findOne(id: string): Promise<Employee> {
    const employee = await this.getEmployeeById(id);

    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    return employee;
  }

  /**
   * @summary Actualizar un empleado por ID
   * @description Actualiza un empleado por su ID.
   * @param id ID del empleado (UUID).
   * @param updateEmployeeDto Datos para actualizar el empleado.
   * @returns Empleado actualizado por ID exitosamente.
   * @throws NotFoundException Si el empleado no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al guardar.
   */
  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.getEmployeeById(id);

    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    if (updateEmployeeDto.person) {
      const updatePersonDto = updateEmployeeDto.person;
      Object.assign(employee.person, updatePersonDto);
    }

    try {
      await this.employeeRepository.save(employee);
      return employee;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Eliminar un empleado por ID
   * @description Elimina un empleado por su ID.
   * @param id ID del empleado (UUID).
   * @throws NotFoundException Si el empleado no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al eliminar.
   */
  async remove(id: string): Promise<void> {
    const employee = await this.getEmployeeById(id);

    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    try {
      await this.employeeRepository.remove(employee);
      await this.personsService.remove(employee.person.id);
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
