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
}
