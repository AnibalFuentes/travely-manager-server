import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Passenger } from './entities/passenger.entity';
import { Repository } from 'typeorm';
import { PeopleService } from 'src/people/people.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');

@Injectable()
export class PassengersService {
  private readonly logger = new Logger('PassengersService');

  constructor(
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
    private readonly personsService: PeopleService,
  ) {}

  private async getPassengerById(id: string): Promise<Passenger> {
    const passenger = await this.passengerRepository
      .createQueryBuilder('passenger')
      .leftJoinAndSelect('passenger.person', 'person')
      .where('passenger.id = :id', { id })
      .getOne();

    return passenger;
  }

  /**
   * @summary Crear un nuevo pasajero
   * @description Crea un nuevo pasajero.
   * @param createPassengerDto Datos para crear el pasajero.
   * @returns Pasajero creado exitosamente.
   * @throws NotFoundException Si no se encuentra la persona asociada.
   * @throws InternalServerErrorException Si ocurre un error inesperado.
   */
  async create(createPassengerDto: CreatePassengerDto) {
    const createPersonDto = createPassengerDto.person;

    try {
      const person = await this.personsService.create(createPersonDto);

      const passenger = this.passengerRepository.create({
        person: person,
      });

      await this.passengerRepository.save(passenger);
      return passenger;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Obtener una lista de pasajeros paginada
   * @description Obtiene una lista paginada de pasajeros.
   * @param paginationDto Datos de paginación.
   * @returns Lista de pasajeros paginada y detalles de paginación.
   */
  async findAll(paginationDto: PaginationDto): Promise<{
    passengers: Passenger[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [passengers, total] = await this.passengerRepository.findAndCount({
      relations: ['person'],
      take: limit,
      skip: offset,
    });

    return {
      passengers: passengers,
      total,
      limit,
      offset,
    };
  }

  /**
   * @summary Obtener un pasajero por ID
   * @description Obtiene un pasajero por su ID.
   * @param id ID del pasajero (UUID).
   * @returns Pasajero recuperado por ID exitosamente.
   * @throws NotFoundException Si el pasajero no se encuentra.
   */
  async findOne(id: string) {
    const passenger = await this.getPassengerById(id);

    if (!passenger) {
      throw new NotFoundException(`Pasajero con ID ${id} no encontrado`);
    }

    return passenger;
  }

  /**
   * @summary Actualizar un pasajero por ID
   * @description Actualiza un pasajero por su ID.
   * @param id ID del pasajero (UUID).
   * @param updatePassengerDto Datos para actualizar el pasajero.
   * @returns Pasajero actualizado por ID exitosamente.
   * @throws NotFoundException Si el pasajero no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al guardar.
   */
  async update(id: string, updatePassengerDto: UpdatePassengerDto) {
    const passenger = await this.getPassengerById(id);

    if (!passenger) {
      throw new NotFoundException(`Pasajero con ID ${id} no encontrado`);
    }

    if (updatePassengerDto.person) {
      const updatePersonDto = updatePassengerDto.person;
      Object.assign(passenger.person, updatePersonDto);
    }

    try {
      await this.passengerRepository.save(passenger);
      return passenger;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * @summary Eliminar un pasajero por ID
   * @description Elimina un pasajero por su ID.
   * @param id ID del pasajero (UUID).
   * @throws NotFoundException Si el pasajero no se encuentra.
   * @throws InternalServerErrorException Si ocurre un error inesperado al eliminar.
   */
  async remove(id: string) {
    const passenger = await this.getPassengerById(id);

    if (!passenger) {
      throw new NotFoundException(`Pasajero con ID ${id} no encontrado`);
    }

    try {
      await this.passengerRepository.remove(passenger);
      await this.personsService.remove(passenger.person.id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async generatePassengerReportPDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      // Configuración del documento
      const currentDate = new Date().toLocaleString();
      const title = 'Informe de Pasajeros';
      const pageMargins = 50;

      // Configuración del encabezado
      doc.font('Helvetica-Bold').fontSize(18).text(title, { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Fecha de generación: ${currentDate}`, { align: 'center' });

      // Obtener todos los pasajeros desde la base de datos
      const passengers = await this.passengerRepository.find({
        relations: ['person', 'travel'],
      });

      // Configuración de la tabla
      const passengerTable = {
        title: 'Tabla de Pasajeros',
        headers: [
          'Nº',
          'Nombre',
          'Tipo de Documento',
          'Número de Identificación',
          'Activo',
          'Fecha de Creación',
        ],
        rows: passengers.map((passenger, index) => [
          index + 1,
          `${passenger.person.firstName} ${passenger.person.lastName}`,
          passenger.person.documentType,
          passenger.person.identificationNumber,
          passenger.isActive ? 'Sí' : 'No',
          this.formatDate(passenger.createdAt),
        ]),
      };

      // Calcular el ancho de la tabla
      const availableWidth = doc.page.width - pageMargins * 2;
      const columnsSize = passengerTable.headers.map(
        () => availableWidth / passengerTable.headers.length,
      );

      // Centrar la tabla en el documento
      const tableX = pageMargins;

      // Agregar la tabla al informe
      doc.moveDown();
      doc.table(passengerTable, {
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
