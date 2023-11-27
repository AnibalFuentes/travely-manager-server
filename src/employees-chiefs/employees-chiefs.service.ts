import {
  BadRequestException,
  Injectable,
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
import { UsersService } from 'src/users/users.service';
import { validate as isUUID } from 'uuid';
import { Employee } from 'src/employees/entities/employee.entity';
import { CreateEmployeeDto } from 'src/employees/dto/create-employee.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');

@Injectable()
export class EmployeesChiefsService {
  private readonly logger = new Logger('EmployeesChiefsService');

  constructor(
    @InjectRepository(EmployeeChief)
    private readonly employeeChiefRepository: Repository<EmployeeChief>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
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
    const { userId, employee: createEmployeeDto } = createEmployeeChiefDto;

    if (!isUUID(userId, 4)) {
      throw new BadRequestException('Invalid userId. Debe ser un UUID válido.');
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new BadRequestException('El usuario especificado no existe.');
    }

    let createEmployee;
    if (createEmployeeDto) {
      createEmployee = await this.employeesService.create(createEmployeeDto);
    }

    const employeeChief = this.employeeChiefRepository.create({
      employee: createEmployee,
      user,
      isActive: true, // Puedes ajustar esto según tus necesidades
    });

    return await this.employeeChiefRepository.save(employeeChief);
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

  async generateReportPDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      //todo
      doc.text('PDF Generado en nuestro servidor');
      doc.moveDown();
      doc.text(
        'Esto es un ejemplo de como generar un pdf en nuestro servidor nestjs',
      );

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
      doc.end();
    });

    return pdfBuffer;
  }

  private handleExceptions(error: any) {
    this.logger.error(error);
  }
}
