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
import { LocationsService } from 'src/locations/locations.service';
import { EmployeesChiefsService } from '../employees-chiefs/employees-chiefs.service';

@Injectable()
export class OfficesService {
  private readonly logger = new Logger('OfficesService');

  constructor(
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    private readonly locationsService: LocationsService,
    private readonly employeesChiefsService: EmployeesChiefsService,
  ) {}

  async create(createOfficeDto: CreateOfficeDto) {
    const { name, locationId, chiefId } = createOfficeDto;

    // Validar la existencia de la ubicación
    const existingLocation = await this.locationsService.findOne(locationId);
    if (!existingLocation) {
      throw new NotFoundException('La ubicación especificada no existe.');
    }

    // Validar la existencia del jefe de la oficina
    const existingChief = await this.employeesChiefsService.findOne(chiefId);
    if (!existingChief) {
      throw new NotFoundException(
        'El jefe de la oficina especificado no existe.',
      );
    }

    // Validar la existencia de una oficina con el mismo nombre
    const existingOffice = await this.officeRepository.findOne({
      where: { name },
    });

    if (existingOffice) {
      throw new ConflictException('Ya existe una oficina con el mismo nombre.');
    }

    try {
      const office = this.officeRepository.create({
        ...createOfficeDto,
        location: existingLocation,
        chief: existingChief,
      });

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
