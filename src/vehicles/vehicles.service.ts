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

  async findVehiclesByColor(color: string) {
    const vehicles = await this.vehicleRepository.find({ where: { color } });
    return vehicles;
  }

  async findVehiclesByNumberOfSeats(seats: number) {
    const vehicles = await this.vehicleRepository.find({
      where: { numberOfSeats: seats },
    });
    return vehicles;
  }

  async findVehiclesByNumberOfAxles(axles: number) {
    const vehicles = await this.vehicleRepository.find({
      where: { numberAxles: axles },
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

  private handleExceptions(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'Ocurrió un error inesperado. Por favor, revise los registros del servidor.',
    );
  }
}
