import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerCompanyDto } from './dto/create-customer-company.dto';
import { UpdateCustomerCompanyDto } from './dto/update-customer-company.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerCompany } from './entities/customer-company.entity';
import { CompaniesService } from 'src/companies/companies.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');
@Injectable()
export class CustomersCompaniesService {
  private readonly logger = new Logger('CustomersCompaniesService');

  constructor(
    @InjectRepository(CustomerCompany)
    private readonly customerCompanyRepository: Repository<CustomerCompany>,
    private readonly companiesService: CompaniesService,
  ) {}

  private async getCustomerCompanyById(id: string): Promise<CustomerCompany> {
    const customerCompany = await this.customerCompanyRepository
      .createQueryBuilder('customerCompany')
      .leftJoinAndSelect('customerCompany.company', 'company')
      .where('customerCompany.id = :id', { id })
      .getOne();

    return customerCompany;
  }

  /**
   * @summary Crear un nuevo jefe de compañía
   * @description Crea un nuevo jefe de compañía.
   * @param createCustomerCompanyDto Datos para crear el jefe de compañía.
   * @returns Jefe de compañía creado exitosamente.
   * @throws NotFoundException Si no se encuentra la persona asociada.
   * @throws InternalServerErrorException Si ocurre un error inesperado.
   */
  async create(createCustomerCompanyDto: CreateCustomerCompanyDto) {
    const createCompanyDto = createCustomerCompanyDto.company;

    try {
      const company = await this.companiesService.create(createCompanyDto);

      const customerCompany = this.customerCompanyRepository.create({
        company: company,
      });

      await this.customerCompanyRepository.save(customerCompany);
      return customerCompany;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Obtener una lista de jefes de compañía paginada
   * @description Obtiene una lista paginada de jefes de compañía.
   * @param paginationDto Datos de paginación.
   * @returns Lista de jefes de compañía paginada y detalles de paginación.
   */
  async findAll(paginationDto: PaginationDto): Promise<{
    customerCompanys: CustomerCompany[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [customerCompanys, total] =
      await this.customerCompanyRepository.findAndCount({
        relations: ['company'],
        take: limit,
        skip: offset,
      });

    return {
      customerCompanys: customerCompanys,
      total,
      limit,
      offset,
    };
  }

  /**
   * @summary Obtener un jefe de compañía por ID
   * @description Obtiene un jefe de compañía por su ID.
   * @param id ID del jefe de compañía (UUID).
   * @returns Jefe de compañía recuperado por ID exitosamente.
   * @throws NotFoundException Si el jefe de compañía no se encuentra.
   */
  async findOne(id: string): Promise<CustomerCompany> {
    const customerCompany = await this.getCustomerCompanyById(id);

    if (!customerCompany) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    return customerCompany;
  }

  /**
   * @summary Actualizar un jefe de compañía por ID
   * @description Actualiza un jefe de compañía por su ID.
   * @param id ID del jefe de compañía (UUID).
   * @param updateCustomerCompanyDto Datos para actualizar el jefe de compañía.
   * @returns Jefe de compañía actualizado por ID exitosamente.
   * @throws NotFoundException Si el jefe de compañía no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al guardar.
   */
  async update(id: string, updateCustomerCompanyDto: UpdateCustomerCompanyDto) {
    const customerCompany = await this.getCustomerCompanyById(id);

    if (!customerCompany) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    if (updateCustomerCompanyDto.company) {
      const updatePersonDto = updateCustomerCompanyDto.company;
      Object.assign(customerCompany.company, updatePersonDto);
    }

    try {
      await this.customerCompanyRepository.save(customerCompany);
      return customerCompany;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Eliminar un jefe de compañía por ID
   * @description Elimina un jefe de compañía por su ID.
   * @param id ID del jefe de compañía (UUID).
   * @throws NotFoundException Si el jefe de compañía no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al eliminar.
   */
  async remove(id: string): Promise<void> {
    const customerCompany = await this.getCustomerCompanyById(id);

    if (!customerCompany) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    try {
      await this.customerCompanyRepository.remove(customerCompany);
      await this.companiesService.remove(customerCompany.company.id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async generateCustomerCompanyReportPDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      // Configuración del documento
      const currentDate = new Date().toLocaleString();
      const title = 'Informe de Clientes de Tipo Empresa';
      const pageMargins = 50;

      // Configuración del encabezado
      doc.font('Helvetica-Bold').fontSize(18).text(title, { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Fecha de generación: ${currentDate}`, { align: 'center' });

      // Obtener todos los clientes de tipo empresa desde la base de datos
      const customers = await this.customerCompanyRepository.find({
        relations: ['company'],
      });

      // Configuración de la tabla
      const customerCompanyTable = {
        title: 'Tabla de Clientes de Tipo Empresa',
        headers: [
          'Nº',
          'Nombre de la Empresa',
          'NIT',
          'Dirección',
          'Número de Contacto',
          'Fecha de Creación',
        ],
        rows: customers.map((customer, index) => [
          index + 1,
          customer.company.name,
          customer.company.nit,
          customer.company.address,
          customer.company.contactNumber,
          this.formatDate(customer.createdAt),
        ]),
      };

      // Calcular el ancho de la tabla
      const availableWidth = doc.page.width - pageMargins * 2;
      const columnsSize = customerCompanyTable.headers.map(
        () => availableWidth / customerCompanyTable.headers.length,
      );

      // Centrar la tabla en el documento
      const tableX = pageMargins;

      // Agregar la tabla al informe
      doc.moveDown();
      doc.table(customerCompanyTable, {
        x: tableX,
        columnsSize,
      });

      // Configuración del pie de página
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);

        // Agregar el paginado al final de la página
        doc
          .fontSize(10)
          .text(
            `Página ${i + 1} de ${totalPages}`,
            doc.page.width / 2,
            doc.page.height - pageMargins,
            { align: 'center' },
          );
      }

      // Agregar línea adicional al final del documento
      doc.moveDown();
      doc
        .fontSize(12)
        .text('Reporte generado por Travely Manager', { align: 'center' });

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

  // Función para formatear la fecha en el formato deseado
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'Se produjo un error inesperado. Por favor, revise los registros del servidor.',
    );
  }
}
