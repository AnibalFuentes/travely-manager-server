import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeOfficeDto } from './dto/create-employee-office.dto';
import { UpdateEmployeeOfficeDto } from './dto/update-employee-office.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EmployeeOffice } from './entities/employee-office.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from 'src/employees/employees.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OfficesService } from 'src/offices/offices.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
import { validate as isUUID } from 'uuid';

@Injectable()
export class EmployeesOfficesService {
  private readonly logger = new Logger('EmployeesOficcesService');

  constructor(
    @InjectRepository(EmployeeOffice)
    private readonly employeeOfficeRepository: Repository<EmployeeOffice>,
    private readonly employeesService: EmployeesService,
    private readonly officesService: OfficesService,
    private readonly usersService: UsersService,
  ) {}

  private async getEmployeeOfficeById(id: string): Promise<EmployeeOffice> {
    const employeeOffice = await this.employeeOfficeRepository
      .createQueryBuilder('employeeOffice')
      .leftJoinAndSelect('employeeOffice.employee', 'employee')
      .where('employeeOffice.id = :id', { id })
      .getOne();

    return employeeOffice;
  }

  /**
   * @summary Crear un nuevo jefe de empleado
   * @description Crea un nuevo jefe de empleado.
   * @param createEmployeeOfficeDto Datos para crear el jefe de empleado.
   * @returns Jefe de empleado creado exitosamente.
   * @throws NotFoundException Si no se encuentra la persona asociada.
   * @throws NotFoundException Si no se encuentra la oficina asociada.
   * @throws NotFoundException Si no se encuentra el jefe asociado (si se proporciona adminId).
   * @throws NotFoundException Si no se encuentra el usuario asociado (si se proporciona userId).
   * @throws InternalServerErrorException Si ocurre un error inesperado.
   */
  async create(createEmployeeOfficeDto: CreateEmployeeOfficeDto) {
    const { employee, officeId, adminId, userId } = createEmployeeOfficeDto;

    // Validar la existencia del empleado
    const employeeEntity = await this.employeesService.create(employee);

    // Validar la existencia de la oficina
    const office = await this.officesService.findOne(officeId);

    // Validar la existencia del jefe (si se proporciona adminId)
    let admin: EmployeeOffice;
    if (adminId) {
      admin = await this.getEmployeeOfficeById(adminId);
      if (!admin) {
        throw new NotFoundException(`Jefe con ID ${adminId} no encontrado`);
      }
    }

    // Validar la existencia del usuario (si se proporciona userId)
    let user: User;
    if (userId) {
      user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }
    }

    try {
      const employeeOffice = this.employeeOfficeRepository.create({
        employee: employeeEntity,
        office,
        admin,
        user,
      });

      await this.employeeOfficeRepository.save(employeeOffice);
      return employeeOffice;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(idOrTerm: string): Promise<EmployeeOffice> {
    let employeeOffice: EmployeeOffice;

    if (isUUID(idOrTerm)) {
      employeeOffice = await this.getEmployeeOfficeById(idOrTerm);
    } else {
      const queryBuilder =
        this.employeeOfficeRepository.createQueryBuilder('employeeOffice');
      employeeOffice = await queryBuilder
        .leftJoinAndSelect('employeeOffice.employee', 'employee')
        .leftJoinAndSelect('employeeOffice.office', 'office')
        .leftJoinAndSelect('employeeOffice.admin', 'admin')
        .leftJoinAndSelect('employeeOffice.user', 'user')
        .where(
          'LOWER(employee.firstName) = :term OR LOWER(employee.lastName) = :term OR employee.identificationNumber = :term OR LOWER(user.email) = :term',
          {
            term: idOrTerm.toLowerCase(),
          },
        )
        .getOne();
    }

    if (!employeeOffice) {
      throw new NotFoundException(
        `Jefe con ID o término ${idOrTerm} no encontrado`,
      );
    }

    return employeeOffice;
  }
  async update(
    id: string,
    updateEmployeeOfficeDto: UpdateEmployeeOfficeDto,
  ): Promise<EmployeeOffice> {
    const employeeOffice = await this.getEmployeeOfficeById(id);

    if (!employeeOffice) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    if (updateEmployeeOfficeDto.employee) {
      const updatePersonDto = updateEmployeeOfficeDto.employee;
      const updatedEmployee = await this.employeesService.update(
        employeeOffice.employee.id,
        updatePersonDto,
      );
      employeeOffice.employee = updatedEmployee;
    }

    if (updateEmployeeOfficeDto.officeId) {
      const updatedOffice = await this.officesService.findOne(
        updateEmployeeOfficeDto.officeId,
      );
      if (!updatedOffice) {
        throw new NotFoundException(
          `Oficina con ID ${updateEmployeeOfficeDto.officeId} no encontrada`,
        );
      }
      employeeOffice.office = updatedOffice;
    }

    if (updateEmployeeOfficeDto.adminId) {
      const updatedAdmin = await this.getEmployeeOfficeById(
        updateEmployeeOfficeDto.adminId,
      );
      if (!updatedAdmin) {
        throw new NotFoundException(
          `Jefe con ID ${updateEmployeeOfficeDto.adminId} no encontrado`,
        );
      }
      employeeOffice.admin = updatedAdmin;
    }

    if (updateEmployeeOfficeDto.userId) {
      const updatedUser = await this.usersService.findOne(
        updateEmployeeOfficeDto.userId,
      );
      if (!updatedUser) {
        throw new NotFoundException(
          `Usuario con ID ${updateEmployeeOfficeDto.userId} no encontrado`,
        );
      }
      employeeOffice.user = updatedUser;
    }

    try {
      await this.employeeOfficeRepository.save(employeeOffice);
      return employeeOffice;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string): Promise<void> {
    const employeeOffice = await this.getEmployeeOfficeById(id);

    if (!employeeOffice) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    try {
      await this.employeeOfficeRepository.remove(employeeOffice);
      await this.employeesService.remove(employeeOffice.employee.id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};
    return this.employeeOfficeRepository.find({
      take: limit,
      skip: offset,
    });
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'Se produjo un error inesperado. Por favor, revise los registros del servidor.',
    );
  }
}
