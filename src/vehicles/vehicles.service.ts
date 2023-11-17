import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandsService } from 'src/brands/brands.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger('VehiclesService');

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly brandsService: BrandsService,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const { brandId, plate, engineNumber, registrationCard } = createVehicleDto;

    if (!isUUID(brandId, 4)) {
      throw new BadRequestException(
        'Invalid brandId. Debe ser un UUID válido.',
      );
    }

    const brand = await this.brandsService.findOne(brandId);

    if (!brand) {
      throw new BadRequestException('La marca especificada no existe.');
    }

    const existingVehicleWithPlate = await this.vehicleRepository.findOne({
      where: { plate },
    });

    if (existingVehicleWithPlate) {
      throw new ConflictException(
        'Ya existe un vehículo con la misma matrícula.',
      );
    }

    const existingVehicleWithEngineNumber =
      await this.vehicleRepository.findOne({
        where: { engineNumber },
      });

    if (existingVehicleWithEngineNumber) {
      throw new ConflictException(
        'Ya existe un vehículo con el mismo número de motor.',
      );
    }

    const existingVehicleWithRegistrationCard =
      await this.vehicleRepository.findOne({
        where: { registrationCard },
      });

    if (existingVehicleWithRegistrationCard) {
      throw new ConflictException(
        'Ya existe un vehículo con el mismo número de tarjeta de registro.',
      );
    }

    try {
      const vehicle = this.vehicleRepository.create(createVehicleDto);
      await this.vehicleRepository.save(vehicle);
      return vehicle;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};
    return this.vehicleRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let vehicle: Vehicle;

    if (isUUID(term)) {
      vehicle = await this.vehicleRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.vehicleRepository.createQueryBuilder('vehicle');
      vehicle = await queryBuilder
        .where(
          'plate = :term OR registrationCard = :term OR engineNumber = :term',
          {
            term: term.toLowerCase(),
          },
        )
        .getOne();
    }

    if (!vehicle)
      throw new NotFoundException(`Vehículo con ${term} no encontrado`);
    return vehicle;
  }

  async findVehiclesByBrand(brandId: string) {
    const brand = await this.brandsService.findOne(brandId);

    if (!brand) {
      throw new NotFoundException('Marca no encontrada.');
    }

    const vehicles = await this.vehicleRepository.find({
      where: { brand: brand },
    });
    return vehicles;
  }

  async findVehiclesByModel(model: string) {
    const vehicles = await this.vehicleRepository.find({ where: { model } });
    return vehicles;
  }

  async findVehiclesByManufacturingYear(year: number) {
    const vehicles = await this.vehicleRepository.find({
      where: { manufacturingYear: year },
    });
    return vehicles;
  }

  async findVehiclesByNumberOfSeats(seats: number) {
    const vehicles = await this.vehicleRepository.find({
      where: { numberOfSeats: seats },
    });
    return vehicles;
  }

  async findVehiclesByActivityStatus(isActive: boolean) {
    const vehicles = await this.vehicleRepository.find({ where: { isActive } });
    return vehicles;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.vehicleRepository.preload({
      id: id,
      ...updateVehicleDto,
    });

    if (!vehicle)
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);

    try {
      await this.vehicleRepository.save(vehicle);
      return vehicle;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
  }

  async generateVehicleReportPDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      // Configuración del documento
      const currentDate = new Date().toLocaleString();
      const title = 'Informe de Vehículos';
      const pageMargins = 50;

      // Configuración del encabezado
      doc.font('Helvetica-Bold').fontSize(18).text(title, { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Fecha de generación: ${currentDate}`, { align: 'center' });

      // Obtener todos los vehículos desde la base de datos
      const vehicles = await this.vehicleRepository.find({
        relations: ['brand'],
      });

      // Configuración de la tabla
      const vehicleTable = {
        title: 'Tabla de Vehículos',
        headers: [
          'Nº',
          'Número de Matrícula',
          'Modelo',
          'Marca',
          'Año de Fabricación',
          'Número de Asientos',
          'Activo',
          'Fecha de Creación',
        ],
        rows: vehicles.map((vehicle, index) => [
          index + 1,
          vehicle.plate,
          vehicle.model,
          vehicle.brand.name,
          vehicle.manufacturingYear,
          vehicle.numberOfSeats,
          vehicle.isActive ? 'Sí' : 'No',
          this.formatDate(vehicle.createdAt),
        ]),
      };

      // Calcular el ancho de la tabla
      const availableWidth = doc.page.width - pageMargins * 2;
      const columnsSize = vehicleTable.headers.map(
        () => availableWidth / vehicleTable.headers.length,
      );

      // Centrar la tabla en el documento
      const tableX = pageMargins;

      // Agregar la tabla al informe
      doc.moveDown();
      doc.table(vehicleTable, {
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
      'Ocurrió un error inesperado. Por favor, revise los registros del servidor.',
    );
  }
}
