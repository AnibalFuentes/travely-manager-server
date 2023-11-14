import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDriverDto } from './dto/create-employee-driver.dto';
import { UpdateEmployeeDriverDto } from './dto/update-employee-driver.dto';
import { Repository } from 'typeorm';
import { EmployeesService } from 'src/employees/employees.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeDriver } from './entities/employee-driver.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class EmployeesDriversService {
  private readonly logger = new Logger('EmployeeDriversService');

  constructor(
    @InjectRepository(EmployeeDriver)
    private readonly employeeDriverRepository: Repository<EmployeeDriver>,
    private readonly employeesService: EmployeesService,
  ) {}

  private async getEmployeeDriverById(id: string): Promise<EmployeeDriver> {
    const employeeDriver = await this.employeeDriverRepository
      .createQueryBuilder('employeeDriver')
      .leftJoinAndSelect('employeeDriver.employee', 'employee')
      .where('employeeDriver.id = :id', { id })
      .getOne();

    return employeeDriver;
  }

  /**
   * @summary Crear un nuevo conductor
   * @description Crea un nuevo conductor.
   * @param createEmployeeDriverDto Datos para crear el conductor.
   * @returns Conductor creado exitosamente.
   * @throws NotFoundException Si no se encuentra la persona asociada.
   * @throws InternalServerErrorException Si ocurre un error inesperado.
   */
  async create(
    createEmployeeDriverDto: CreateEmployeeDriverDto,
  ): Promise<EmployeeDriver> {
    const { licenseNumber, licenseExpirationDate } = createEmployeeDriverDto;

    // Validar la duplicación del número de licencia
    const existingDriverWithLicense =
      await this.employeeDriverRepository.findOne({
        where: { licenseNumber },
      });

    if (existingDriverWithLicense) {
      throw new ConflictException(
        'Ya existe un conductor con el mismo número de licencia.',
      );
    }

    try {
      // Crear el conductor
      const employeeDriver = this.employeeDriverRepository.create({
        licenseNumber,
        licenseExpirationDate,
      });

      // Guardar el conductor en la base de datos
      await this.employeeDriverRepository.save(employeeDriver);

      // Retornar el conductor creado
      return employeeDriver;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Obtener una lista de conductores paginada
   * @description Obtiene una lista paginada de conductores.
   * @param paginationDto Datos de paginación.
   * @returns Lista de conductores paginada y detalles de paginación.
   */
  async findAll(paginationDto: PaginationDto): Promise<{
    employeeDrivers: EmployeeDriver[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [employeeDrivers, total] =
      await this.employeeDriverRepository.findAndCount({
        relations: ['employee'],
        take: limit,
        skip: offset,
      });

    return {
      employeeDrivers: employeeDrivers,
      total,
      limit,
      offset,
    };
  }

  /**
   * @summary Obtener un conductor por ID
   * @description Obtiene un conductor por su ID.
   * @param id ID del conductor (UUID).
   * @returns Conductor recuperado por ID exitosamente.
   * @throws NotFoundException Si el conductor no se encuentra.
   */
  async findOne(id: string): Promise<EmployeeDriver> {
    const employeeDriver = await this.getEmployeeDriverById(id);

    if (!employeeDriver) {
      throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
    }

    return employeeDriver;
  }

  /**
   * @summary Actualizar un conductor por ID
   * @description Actualiza un conductor por su ID.
   * @param id ID del conductor (UUID).
   * @param updateEmployeeDriverDto Datos para actualizar el conductor.
   * @returns Conductor actualizado por ID exitosamente.
   * @throws NotFoundException Si el conductor no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al guardar.
   */
  async update(
    id: string,
    updateEmployeeDriverDto: UpdateEmployeeDriverDto,
  ): Promise<EmployeeDriver> {
    const employeeDriver = await this.getEmployeeDriverById(id);

    if (!employeeDriver) {
      throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
    }

    if (updateEmployeeDriverDto.employee) {
      const updatePersonDto = updateEmployeeDriverDto.employee;
      Object.assign(employeeDriver.employee, updatePersonDto);
    }

    try {
      await this.employeeDriverRepository.save(employeeDriver);
      return employeeDriver;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Eliminar un conductor por ID
   * @description Elimina un conductor por su ID.
   * @param id ID del conductor (UUID).
   * @throws NotFoundException Si el conductor no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al eliminar.
   */
  async remove(id: string): Promise<void> {
    const employeeDriver = await this.getEmployeeDriverById(id);

    if (!employeeDriver) {
      throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
    }

    try {
      await this.employeeDriverRepository.remove(employeeDriver);
      await this.employeesService.remove(employeeDriver.employee.id);
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
