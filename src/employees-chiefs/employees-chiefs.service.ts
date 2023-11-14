import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeChiefDto } from './dto/create-employee-chief.dto';
import { UpdateEmployeeChiefDto } from './dto/update-employee-chief.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { Repository } from 'typeorm';
import { EmployeeChief } from './entities/employees-chief.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class EmployeesChiefsService {
  private readonly logger = new Logger('EmployeesChiefsService');

  constructor(
    @InjectRepository(EmployeeChief)
    private readonly employeeChiefRepository: Repository<EmployeeChief>,
    private readonly employeesService: EmployeesService,
  ) {}

  private async getEmployeeChiefById(id: string): Promise<EmployeeChief> {
    const employeeChief = await this.employeeChiefRepository
      .createQueryBuilder('employeeChief')
      .leftJoinAndSelect('employeeChief.employee', 'employee')
      .where('employeeChief.id = :id', { id })
      .getOne();

    return employeeChief;
  }

  /**
   * @summary Crear un nuevo jefe de empleado
   * @description Crea un nuevo jefe de empleado.
   * @param createEmployeeChiefDto Datos para crear el jefe de empleado.
   * @returns Jefe de empleado creado exitosamente.
   * @throws NotFoundException Si no se encuentra la persona asociada.
   * @throws InternalServerErrorException Si ocurre un error inesperado.
   */
  async create(createEmployeeChiefDto: CreateEmployeeChiefDto) {
    const createEmployeeDto = createEmployeeChiefDto.employee;

    try {
      const employee = await this.employeesService.create(createEmployeeDto);

      const employeeChief = this.employeeChiefRepository.create({
        employee: employee,
      });

      await this.employeeChiefRepository.save(employeeChief);
      return employeeChief;
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
    employeeChiefs: EmployeeChief[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [employeeChiefs, total] =
      await this.employeeChiefRepository.findAndCount({
        relations: ['employee'],
        take: limit,
        skip: offset,
      });

    return {
      employeeChiefs: employeeChiefs,
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
  async findOne(id: string): Promise<EmployeeChief> {
    const employeeChief = await this.getEmployeeChiefById(id);

    if (!employeeChief) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    return employeeChief;
  }

  /**
   * @summary Actualizar un jefe de empleado por ID
   * @description Actualiza un jefe de empleado por su ID.
   * @param id ID del jefe de empleado (UUID).
   * @param updateEmployeeChiefDto Datos para actualizar el jefe de empleado.
   * @returns Jefe de empleado actualizado por ID exitosamente.
   * @throws NotFoundException Si el jefe de empleado no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al guardar.
   */
  async update(
    id: string,
    updateEmployeeChiefDto: UpdateEmployeeChiefDto,
  ): Promise<EmployeeChief> {
    const employeeChief = await this.getEmployeeChiefById(id);

    if (!employeeChief) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    if (updateEmployeeChiefDto.employee) {
      const updatePersonDto = updateEmployeeChiefDto.employee;
      Object.assign(employeeChief.employee, updatePersonDto);
    }

    try {
      await this.employeeChiefRepository.save(employeeChief);
      return employeeChief;
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
    const employeeChief = await this.getEmployeeChiefById(id);

    if (!employeeChief) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    try {
      await this.employeeChiefRepository.remove(employeeChief);
      await this.employeesService.remove(employeeChief.employee.id);
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
