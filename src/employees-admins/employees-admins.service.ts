import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeAdmin } from './entities/employees-admin.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Repository } from 'typeorm';
import { CreateEmployeeAdminDto } from './dto/create-employee-admin.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateEmployeeAdminDto } from './dto/update-employee-admin.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');

@Injectable()
export class EmployeesAdminsService {
  private readonly logger = new Logger('EmployeeAdminsService');

  constructor(
    @InjectRepository(EmployeeAdmin)
    private readonly employeeAdminRepository: Repository<EmployeeAdmin>,
    private readonly employeesService: EmployeesService,
  ) {}

  private async getEmployeeAdminById(id: string): Promise<EmployeeAdmin> {
    const employeeAdmin = await this.employeeAdminRepository
      .createQueryBuilder('employeeAdmin')
      .leftJoinAndSelect('employeeAdmin.employee', 'employee')
      .where('employeeAdmin.id = :id', { id })
      .getOne();

    return employeeAdmin;
  }

  /**
   * @summary Crear un nuevo vendedor
   * @description Crea un nuevo vendedor.
   * @param createEmployeeAdminDto Datos para crear el vendedor.
   * @returns Vendedor creado exitosamente.
   * @throws NotFoundException Si no se encuentra la persona asociada.
   * @throws InternalServerErrorException Si ocurre un error inesperado.
   */
  async create(createEmployeeAdminDto: CreateEmployeeAdminDto) {
    const createEmployeeDto = createEmployeeAdminDto.employee;

    try {
      const employee = await this.employeesService.create(createEmployeeDto);

      const employeeAdmin = this.employeeAdminRepository.create({
        employee: employee,
      });

      await this.employeeAdminRepository.save(employeeAdmin);
      return employeeAdmin;
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
    employeeAdmins: EmployeeAdmin[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [employeeAdmins, total] =
      await this.employeeAdminRepository.findAndCount({
        relations: ['employee'],
        take: limit,
        skip: offset,
      });

    return {
      employeeAdmins: employeeAdmins,
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
  async findOne(id: string) {
    const employeeAdmin = await this.getEmployeeAdminById(id);

    if (!employeeAdmin) {
      throw new NotFoundException(`Vendedor con ID ${id} no encontrado`);
    }

    return employeeAdmin;
  }

  /**
   * @summary Actualizar un vendedor por ID
   * @description Actualiza un vendedor por su ID.
   * @param id ID del vendedor (UUID).
   * @param updateEmployeeAdminDto Datos para actualizar el vendedor.
   * @returns Vendedor actualizado por ID exitosamente.
   * @throws NotFoundException Si el vendedor no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al guardar.
   */
  async update(id: string, updateEmployeeAdminDto: UpdateEmployeeAdminDto) {
    const employeeAdmin = await this.getEmployeeAdminById(id);

    if (!employeeAdmin) {
      throw new NotFoundException(`Vendedor con ID ${id} no encontrado`);
    }

    if (updateEmployeeAdminDto.employee) {
      const updatePersonDto = updateEmployeeAdminDto.employee;
      Object.assign(employeeAdmin.employee, updatePersonDto);
    }

    try {
      await this.employeeAdminRepository.save(employeeAdmin);
      return employeeAdmin;
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
    const employeeAdmin = await this.getEmployeeAdminById(id);

    if (!employeeAdmin) {
      throw new NotFoundException(`Vendedor con ID ${id} no encontrado`);
    }

    try {
      await this.employeeAdminRepository.remove(employeeAdmin);
      await this.employeesService.remove(employeeAdmin.employee.id);
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

    throw new InternalServerErrorException(
      'Se produjo un error inesperado. Por favor, revise los registros del servidor.',
    );
  }
}
