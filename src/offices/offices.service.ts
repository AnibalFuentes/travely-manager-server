import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { Repository } from 'typeorm';
import { Office } from './entities/office.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');

@Injectable()
export class OfficesService {
  private readonly logger = new Logger('OfficesService');

  constructor(
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
  ) {}

  async create(createOfficeDto: CreateOfficeDto) {
    const { name } = createOfficeDto;

    const existingOffice = await this.officeRepository.findOne({
      where: { name },
    });

    if (existingOffice) {
      throw new ConflictException('Ya existe una oficina con el mismo nombre.');
    }

    try {
      const office = this.officeRepository.create(createOfficeDto);
      await this.officeRepository.save(office);
      return office;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.officeRepository.find();
  }

  async findOne(term: string) {
    let office: Office;
    if (isUUID(term)) {
      office = await this.officeRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.officeRepository.createQueryBuilder('office');
      office = await queryBuilder
        .where('name = :term', {
          term: term.toLowerCase(),
        })
        .getOne();
    }
    if (!office)
      throw new NotFoundException(`Oficina con ${term} no encontrada`);
    return office;
  }

  async update(id: string, updateOfficeDto: UpdateOfficeDto) {
    const office = await this.officeRepository.preload({
      id: id,
      ...updateOfficeDto,
    });

    if (!office)
      throw new NotFoundException(`Oficina con ID ${id} no encontrada`);

    try {
      await this.officeRepository.save(office);
      return office;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const office = await this.findOne(id);
    await this.officeRepository.remove(office);
  }

  async generateOfficeReportPDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      // Configuración del documento
      const currentDate = new Date().toLocaleString();
      const title = 'Informe de Oficinas';
      const pageMargins = 50;

      // Configuración del encabezado
      doc.font('Helvetica-Bold').fontSize(18).text(title, { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Fecha de generación: ${currentDate}`, { align: 'center' });

      // Obtener todas las oficinas desde la base de datos
      const offices = await this.officeRepository.find({
        relations: ['location', 'chiefs', 'drivers', 'sellers'],
      });

      // Configuración de la tabla
      const officeTable = {
        title: 'Tabla de Oficinas',
        headers: [
          'Nº',
          'Nombre',
          'Ubicación',
          'Jefes de Empleado',
          'Conductores',
          'Vendedores',
          'Activa',
          'Fecha de Creación',
        ],
        rows: offices.map((office, index) => [
          index + 1,
          office.name,
          office.location.city, // Ajustar según la estructura real de la entidad Location
          office.chiefs
            .map((chief) => chief.employee.person.firstName)
            .join(', '), // Ajustar según la estructura real de la entidad EmployeeChief
          office.drivers
            .map((driver) => driver.employee.person.firstName)
            .join(', '), // Ajustar según la estructura real de la entidad EmployeeDriver
          office.sellers
            .map((seller) => seller.employee.person.firstName)
            .join(', '), // Ajustar según la estructura real de la entidad EmployeeSeller
          office.isActive ? 'Sí' : 'No',
          this.formatDate(office.createdAt),
        ]),
      };

      // Calcular el ancho de la tabla
      const availableWidth = doc.page.width - pageMargins * 2;
      const columnsSize = officeTable.headers.map(
        () => availableWidth / officeTable.headers.length,
      );

      // Centrar la tabla en el documento
      const tableX = pageMargins;

      // Agregar la tabla al informe
      doc.moveDown();
      doc.table(officeTable, {
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
