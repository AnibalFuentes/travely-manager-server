import {
  Injectable,
  Logger,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssignVehicleDto } from './dto/create-assign-vehicle.dto';
import { UpdateAssignVehicleDto } from './dto/update-assign-vehicle.dto';
import { AssignVehicle } from './entities/assign-vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { EmployeesDriversService } from 'src/employees-drivers/employees-drivers.service';
import { validate as isUUID } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');

@Injectable()
export class AssignVehiclesService {
  private readonly logger = new Logger('AssignVehiclesService');

  constructor(
    @InjectRepository(AssignVehicle)
    private readonly assignVehicleRepository: Repository<AssignVehicle>,
    private readonly vehicleService: VehiclesService,
    private readonly employeesDriversService: EmployeesDriversService,
  ) {}

  async create(createAssignVehicleDto: CreateAssignVehicleDto) {
    const { vehicleId, driverOneId, driverTwoId } = createAssignVehicleDto;

    if (!isUUID(vehicleId, 4)) {
      throw new BadRequestException(
        'Invalid vehicleId. Debe ser un UUID válido.',
      );
    }

    const vehicle = await this.vehicleService.findOne(vehicleId);

    if (!vehicle) {
      throw new BadRequestException('El vehículo especificado no existe.');
    }

    if (!isUUID(driverOneId, 4)) {
      throw new BadRequestException(
        'Invalid driverOneId. Debe ser un UUID válido.',
      );
    }

    const driverOne = await this.employeesDriversService.findOne(driverOneId);

    if (!driverOne) {
      throw new BadRequestException(
        'El primer conductor especificado no existe.',
      );
    }

    const driverTwo = driverTwoId
      ? await this.employeesDriversService.findOne(driverTwoId)
      : null;

    if (driverTwoId && !driverTwo) {
      throw new BadRequestException(
        'El segundo conductor especificado no existe.',
      );
    }

    try {
      const assignVehicle = this.assignVehicleRepository.create({
        vehicle,
        driverOne,
        driverTwo,
        isActive: true,
      });

      await this.assignVehicleRepository.save(assignVehicle);
      return assignVehicle;
    } catch (error) {
      this.logger.error(error);

      if (error.code === '23505') {
        throw new ConflictException(
          'Ya existe una asignación de vehículo para este vehículo y conductores.',
        );
      }

      throw new BadRequestException(
        'Error al crear la asignación de vehículo. Por favor, revise los datos proporcionados.',
      );
    }
  }

  findAll() {
    return this.assignVehicleRepository.find();
  }

  findOne(id: string) {
    return this.assignVehicleRepository.findOneBy({ id });
  }

  async update(id: string, updateAssignVehicleDto: UpdateAssignVehicleDto) {
    const assignVehicle = await this.assignVehicleRepository.findOneBy({ id });

    if (!assignVehicle) {
      throw new NotFoundException(
        'La asignación de vehículo especificada no existe.',
      );
    }

    const { driverOneId, driverTwoId } = updateAssignVehicleDto;

    if (driverOneId) {
      assignVehicle.driverOne =
        await this.employeesDriversService.findOne(driverOneId);
      if (!assignVehicle.driverOne) {
        throw new BadRequestException(
          'El primer conductor especificado no existe.',
        );
      }
    }

    if (driverTwoId) {
      assignVehicle.driverTwo =
        await this.employeesDriversService.findOne(driverTwoId);
      if (driverTwoId && !assignVehicle.driverTwo) {
        throw new BadRequestException(
          'El segundo conductor especificado no existe.',
        );
      }
    }

    try {
      await this.assignVehicleRepository.save(assignVehicle);
      return assignVehicle;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        'Error al actualizar la asignación de vehículo. Por favor, revise los datos proporcionados.',
      );
    }
  }

  async remove(id: string) {
    const assignVehicle = await this.assignVehicleRepository.findOneBy({ id });

    if (!assignVehicle) {
      throw new BadRequestException(
        'La asignación de vehículo especificada no existe.',
      );
    }

    await this.assignVehicleRepository.remove(assignVehicle);
  }

  async generateAssignVehicleReportPDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      // Configuración del documento
      const currentDate = new Date().toLocaleString();
      const title = 'Informe de Asignaciones de Vehículos';
      const pageMargins = 50;

      // Configuración del encabezado
      doc.font('Helvetica-Bold').fontSize(18).text(title, { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Fecha de generación: ${currentDate}`, { align: 'center' });

      // Obtener todas las asignaciones de vehículos desde la base de datos
      const assignments = await this.assignVehicleRepository.find({
        relations: [
          'vehicle',
          'driverOne',
          'driverTwo',
          'driverOne.employee',
          'driverTwo.employee',
          'driverOne.employee.person',
          'driverTwo.employee.person',
        ],
      });

      // Configuración de la tabla
      const assignVehicleTable = {
        title: 'Tabla de Asignaciones de Vehículos',
        headers: [
          'Nº',
          'Vehículo',
          'Conductor 1',
          'Conductor 2',
          'Activa',
          'Fecha de Creación',
        ],
        rows: assignments.map((assignment, index) => [
          index + 1,
          assignment.vehicle.model, // Ajustar según la estructura real de la entidad Vehicle
          assignment.driverOne.employee.person.firstName, // Ajustar según la estructura real de la entidad EmployeeDriver y Person
          assignment.driverTwo
            ? assignment.driverTwo.employee.person.firstName
            : '', // Usar el nombre del conductor 2 si existe
          assignment.isActive ? 'Sí' : 'No',
          this.formatDate(assignment.createdAt), // Llamar a la función formatDate
        ]),
      };

      // Calcular el ancho de la tabla
      const availableWidth = doc.page.width - pageMargins * 2;
      const columnsSize = assignVehicleTable.headers.map(
        () => availableWidth / assignVehicleTable.headers.length,
      );

      // Centrar la tabla en el documento
      const tableX = pageMargins;

      // Agregar la tabla al informe
      doc.moveDown();
      doc.table(assignVehicleTable, {
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
}
