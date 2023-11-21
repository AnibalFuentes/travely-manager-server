import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PeopleService } from 'src/people/people.service';
import { CompaniesService } from 'src/companies/companies.service';
import { CreatePersonDto } from 'src/people/dto/create-person.dto';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { UpdatePersonDto } from 'src/people/dto/update-person.dto';
import { UpdateCompanyDto } from 'src/companies/dto/update-company.dto';
import { Person } from 'src/people/entities/person.entity';
import { Company } from 'src/companies/entities/company.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');

@Injectable()
export class CustomersService {
  private readonly logger = new Logger('CustomersService');

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly peopleService: PeopleService,
    private readonly companyService: CompaniesService,
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
      let customer: Customer;

      if (createCustomerDto.person) {
        // Crear cliente de persona y asociarlo
        const createdPerson = await this.peopleService.create(
          createCustomerDto.person as CreatePersonDto,
        );
        const personCustomer = this.customerRepository.create({
          person: createdPerson,
        });
        customer = await this.customerRepository.save(personCustomer);
      } else if (createCustomerDto.company) {
        // Crear cliente de empresa y asociarlo
        const createdCompany = await this.companyService.create(
          createCustomerDto.company as CreateCompanyDto,
        );
        const companyCustomer = this.customerRepository.create({
          company: createdCompany,
        });
        customer = await this.customerRepository.save(companyCustomer);
      } else {
        // Manejar el caso en el que no se proporciona ni person ni company
        throw new Error(
          'Debe proporcionar datos para crear un cliente (person o company)',
        );
      }

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

  async findOneByTerm(term: string) {
    let customer: Customer;

    if (isUUID(term)) {
      customer = await this.customerRepository.findOneBy({ id: term });
    } else {
      const queryBuilder =
        this.customerRepository.createQueryBuilder('customer');
      customer = await queryBuilder
        .leftJoinAndSelect('customer.person', 'person')
        .leftJoinAndSelect('customer.company', 'company')
        .where(
          'person.firstName = :term OR person.lastName = :term OR person.email = :term OR ' +
            'company.name = :term OR company.taxNumber = :term',
          {
            term: term.toLowerCase(),
          },
        )
        .getOne();
    }

    if (!customer)
      throw new NotFoundException(`Cliente con ${term} no encontrado`);

    return customer;
  }

  /**
   * @summary Actualizar un cliente existente
   * @description Actualiza los datos de un cliente existente.
   * @param customerId ID del cliente a actualizar.
   * @param updateCustomerDto Datos para actualizar el cliente.
   * @returns Cliente actualizado exitosamente.
   */
  async update(customerId: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      // Obtener el cliente existente desde la base de datos
      const existingCustomer = await this.findOneByTerm(customerId);

      if (!existingCustomer) {
        throw new Error('Cliente no encontrado');
      }

      if (updateCustomerDto.person) {
        // Actualizar datos de la persona asociada al cliente
        await this.peopleService.update(
          existingCustomer.person.id, // Reemplaza con la propiedad correcta que almacena el ID de la persona
          updateCustomerDto.person as UpdatePersonDto,
        );
      } else if (updateCustomerDto.company) {
        // Actualizar datos de la empresa asociada al cliente
        await this.companyService.update(
          existingCustomer.company.id, // Reemplaza con la propiedad correcta que almacena el ID de la empresa
          updateCustomerDto.company as UpdateCompanyDto,
        );
      }

      // Actualizar el cliente con los nuevos datos
      const updatedCustomer = this.customerRepository.merge(
        existingCustomer,
        updateCustomerDto,
      );

      await this.customerRepository.save(updatedCustomer);

      return updatedCustomer;
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

  async generateCustomerReportPDF(): Promise<Buffer> {
    const customers = await this.customerRepository.find();
    return this.generateCustomerReportPDFWithCustomers(
      customers,
      'Informe de Clientes',
    );
  }

  async generateCustomerPersonReportPDF(): Promise<Buffer> {
    const customers = await this.customerRepository.find({
      relations: ['person'],
      where: { person: Not(IsNull()) },
    });
    return this.generateCustomerReportPDFWithCustomers(
      customers,
      'Informe de Clientes de Tipo Persona',
    );
  }

  async generateCustomerCompanyReportPDF(): Promise<Buffer> {
    const customers = await this.customerRepository.find({
      relations: ['company'],
      where: { company: Not(IsNull()) },
    });
    return this.generateCustomerReportPDFWithCustomers(
      customers,
      'Informe de Clientes de Tipo Empresa',
    );
  }

  async generateCustomerReportTodayPDF(): Promise<Buffer> {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const customers = await this.customerRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    if (customers.length === 0) {
      throw new NotFoundException(
        'No hay clientes registrados hoy. No se generó ningún informe.',
      );
    }

    return this.generateCustomerReportPDFWithCustomers(
      customers,
      'Clientes Registrados Hoy',
    );
  }

  async generateCustomerReportByCreationDatePDF(
    creationDate: Date,
  ): Promise<Buffer> {
    const startOfDay = new Date(creationDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(creationDate.setHours(23, 59, 59, 999));

    const customers = await this.customerRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    if (customers.length === 0) {
      throw new NotFoundException(
        `No hay clientes creados en la fecha especificada. No se generó ningún informe.`,
      );
    }

    return this.generateCustomerReportPDFWithCustomers(
      customers,
      `Clientes Registrados el ${this.formatDate(creationDate)}`,
    );
  }

  // Resto de los métodos...

  private async generateCustomerReportPDFWithCustomers(
    customers: Customer[],
    title: string,
  ): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      // Configuración del documento
      const currentDate = new Date().toLocaleString();
      const pageMargins = 50;

      // Configuración del encabezado
      doc.font('Helvetica-Bold').fontSize(18).text(title, { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Fecha de generación: ${currentDate}`, { align: 'center' });

      // Configuración de la tabla
      const customerTable = {
        title: 'Tabla de Clientes',
        headers: ['Nº', 'Email/Razón Social', 'Tipo', 'Fecha de Creación'],
        rows: customers.map((customer, index) => [
          index + 1,
          customer.person
            ? this.formatPersonInfo(customer.person)
            : this.formatCompanyInfo(customer.company),
          customer.person ? 'Persona' : 'Empresa',
          this.formatDate(customer.createdAt),
        ]),
      };

      // Calcular el ancho de la tabla
      const availableWidth = doc.page.width - pageMargins * 2;
      const columnsSize = customerTable.headers.map(
        () => availableWidth / customerTable.headers.length,
      );

      // Centrar la tabla en el documento
      const tableX = pageMargins;

      // Agregar la tabla al informe
      doc.moveDown();
      doc.table(customerTable, {
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

  private formatPersonInfo(person: Person): string {
    return `${person.firstName} ${person.lastName} (${person.email})`;
  }

  private formatCompanyInfo(company: Company): string {
    return `${company.name} (NIT: ${company.nit}, Dirección: ${company.address})`;
  }

  async countTotalCustomers(): Promise<number> {
    try {
      return this.customerRepository.count();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async countTotalPersonCustomers(): Promise<number> {
    try {
      return this.customerRepository.count({
        relations: ['person'],
        where: { person: Not(IsNull()) },
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async countTotalCompanyCustomers(): Promise<number> {
    try {
      return this.customerRepository.count({
        relations: ['company'],
        where: { company: Not(IsNull()) },
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
