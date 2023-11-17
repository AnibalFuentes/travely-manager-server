import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerPersonDto } from './dto/create-customer-person.dto';
import { UpdateCustomerPersonDto } from './dto/update-customer-person.dto';
import { PeopleService } from 'src/people/people.service';
import { CustomerPerson } from './entities/customer-person.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');

@Injectable()
export class CustomersPeopleService {
  private readonly logger = new Logger('CustomersPersonsService');

  constructor(
    @InjectRepository(CustomerPerson)
    private readonly customerPersonRepository: Repository<CustomerPerson>,
    private readonly peopleService: PeopleService,
  ) {}

  private async getCustomerPersonById(id: string): Promise<CustomerPerson> {
    const customerPerson = await this.customerPersonRepository
      .createQueryBuilder('customerPerson')
      .leftJoinAndSelect('customerPerson.person', 'person')
      .where('customerPerson.id = :id', { id })
      .getOne();

    return customerPerson;
  }

  /**
   * @summary Crear un nuevo jefe de empleado
   * @description Crea un nuevo jefe de empleado.
   * @param createCustomerPersonDto Datos para crear el jefe de empleado.
   * @returns Jefe de empleado creado exitosamente.
   * @throws NotFoundException Si no se encuentra la persona asociada.
   * @throws InternalServerErrorException Si ocurre un error inesperado.
   */
  async create(createCustomerPersonDto: CreateCustomerPersonDto) {
    const createEmployeeDto = createCustomerPersonDto.person;

    try {
      const person = await this.peopleService.create(createEmployeeDto);

      const customerPerson = this.customerPersonRepository.create({
        person: person,
      });

      await this.customerPersonRepository.save(customerPerson);
      return customerPerson;
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
    customerPersons: CustomerPerson[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [customerPersons, total] =
      await this.customerPersonRepository.findAndCount({
        relations: ['person'],
        take: limit,
        skip: offset,
      });

    return {
      customerPersons: customerPersons,
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
  async findOne(id: string) {
    const customerPerson = await this.getCustomerPersonById(id);

    if (!customerPerson) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    return customerPerson;
  }

  /**
   * @summary Actualizar un jefe de empleado por ID
   * @description Actualiza un jefe de empleado por su ID.
   * @param id ID del jefe de empleado (UUID).
   * @param updateCustomerPersonDto Datos para actualizar el jefe de empleado.
   * @returns Jefe de empleado actualizado por ID exitosamente.
   * @throws NotFoundException Si el jefe de empleado no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al guardar.
   */
  async update(id: string, updateCustomerPersonDto: UpdateCustomerPersonDto) {
    const customerPerson = await this.getCustomerPersonById(id);

    if (!customerPerson) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    if (updateCustomerPersonDto.person) {
      const updatePersonDto = updateCustomerPersonDto.person;
      Object.assign(customerPerson.person, updatePersonDto);
    }

    try {
      await this.customerPersonRepository.save(customerPerson);
      return customerPerson;
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
    const customerPerson = await this.getCustomerPersonById(id);

    if (!customerPerson) {
      throw new NotFoundException(`Jefe con ID ${id} no encontrado`);
    }

    try {
      await this.customerPersonRepository.remove(customerPerson);
      await this.peopleService.remove(customerPerson.person.id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async generateCustomerPersonReportPDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      // Configuración del documento
      const currentDate = new Date().toLocaleString();
      const title = 'Informe de Clientes de Tipo Persona';
      const pageMargins = 50;

      // Configuración del encabezado
      doc.font('Helvetica-Bold').fontSize(18).text(title, { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Fecha de generación: ${currentDate}`, { align: 'center' });

      // Obtener todos los clientes de tipo persona desde la base de datos
      const customerPeople = await this.customerPersonRepository.find({
        relations: ['person'],
      });

      // Configuración de la tabla
      const customerPersonTable = {
        title: 'Tabla de Clientes de Tipo Persona',
        headers: [
          'Nº',
          'Nombre',
          'Tipo de Documento',
          'Número de Identificación',
          'Fecha de Creación',
        ],
        rows: customerPeople.map((customerPerson, index) => [
          index + 1,
          `${customerPerson.person.firstName} ${customerPerson.person.lastName}`,
          customerPerson.person.documentType,
          customerPerson.person.identificationNumber,
          this.formatDate(customerPerson.createdAt),
        ]),
      };

      // Calcular el ancho de la tabla
      const availableWidth = doc.page.width - pageMargins * 2;
      const columnsSize = customerPersonTable.headers.map(
        () => availableWidth / customerPersonTable.headers.length,
      );

      // Centrar la tabla en el documento
      const tableX = pageMargins;

      // Agregar la tabla al informe
      doc.moveDown();
      doc.table(customerPersonTable, {
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
