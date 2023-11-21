import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTravelSaleDto } from './dto/create-travel-sale.dto';
import { TravelSale } from './entities/travel-sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { LocationsService } from 'src/locations/locations.service';
import { DriversVehiclesService } from '../drivers-vehicles/drivers-vehicles.service';
import { EmployeesOfficesService } from '../employees-offices/employees-offices.service';
import { validate as isUUID } from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class TravelSalesService {
  private readonly logger = new Logger('TravelSalesService');

  constructor(
    @InjectRepository(TravelSale)
    private readonly travelSaleRepository: Repository<TravelSale>,
    private readonly locationsService: LocationsService,
    private readonly driversVehiclesService: DriversVehiclesService,
    private readonly employeesOfficesService: EmployeesOfficesService,
  ) {}

  private async getTravelSaleById(id: string): Promise<TravelSale> {
    const travelSale = await this.travelSaleRepository
      .createQueryBuilder('travelSale')
      .leftJoinAndSelect('travelSale.employee', 'employee')
      .where('travelSale.id = :id', { id })
      .getOne();

    return travelSale;
  }

  /**
   * @summary Crear un nuevo jefe de empleado
   * @description Crea un nuevo jefe de empleado.
   * @param createTravelSaleDto Datos para crear el jefe de empleado.
   * @returns Jefe de empleado creado exitosamente.
   * @throws NotFoundException Si no se encuentra la persona asociada.
   * @throws NotFoundException Si no se encuentra la oficina asociada.
   * @throws NotFoundException Si no se encuentra el jefe asociado (si se proporciona adminId).
   * @throws NotFoundException Si no se encuentra el usuario asociado (si se proporciona userId).
   * @throws InternalServerErrorException Si ocurre un error inesperado.
   */
  async create(createTravelSaleDto: CreateTravelSaleDto) {
    const { originId, destinationId, driverVehicleId, sellerId } =
      createTravelSaleDto;

    // Obtener las instancias de las entidades relacionadas
    const origin = await this.locationsService.findOne(originId);
    const destination = await this.locationsService.findOne(destinationId);
    const driverVehicle =
      await this.driversVehiclesService.findOne(driverVehicleId);
    const employeeOffice = await this.employeesOfficesService.findOne(sellerId);

    // Validar la existencia de las entidades relacionadas
    if (!origin) {
      throw new BadRequestException(
        'La ubicación de origen especificada no existe.',
      );
    }

    if (!destination) {
      throw new BadRequestException(
        'La ubicación de destino especificada no existe.',
      );
    }

    if (!driverVehicle) {
      throw new BadRequestException(
        'El vehículo del conductor especificado no existe.',
      );
    }

    if (!employeeOffice) {
      throw new BadRequestException(
        'La oficina del vendedor especificada no existe.',
      );
    }

    try {
      // Crear la venta de viaje con las entidades relacionadas
      const travelSale = this.travelSaleRepository.create({
        origin,
        destination,
        driverVehicle,
        seller: employeeOffice,
        // Incluir otros campos del DTO según sea necesario
        // Ejemplo: total, amountReceived, amountRedeemed, status, etc.
      });

      // Guardar la venta de viaje en la base de datos
      await this.travelSaleRepository.save(travelSale);

      return travelSale;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(idOrTerm: string): Promise<TravelSale> {
    let travelSale: TravelSale;

    if (isUUID(idOrTerm)) {
      travelSale = await this.getTravelSaleById(idOrTerm);
    } else {
      const queryBuilder =
        this.travelSaleRepository.createQueryBuilder('travelSale');
      travelSale = await queryBuilder
        .leftJoinAndSelect('travelSale.employee', 'employee')
        .leftJoinAndSelect('travelSale.office', 'office')
        .leftJoinAndSelect('travelSale.admin', 'admin')
        .leftJoinAndSelect('travelSale.user', 'user')
        .where(
          'LOWER(employee.firstName) = :term OR LOWER(employee.lastName) = :term OR employee.identificationNumber = :term OR LOWER(user.email) = :term',
          {
            term: idOrTerm.toLowerCase(),
          },
        )
        .getOne();
    }

    if (!travelSale) {
      throw new NotFoundException(
        `Jefe con ID o término ${idOrTerm} no encontrado`,
      );
    }

    return travelSale;
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};
    return this.travelSaleRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async count(): Promise<number> {
    return this.travelSaleRepository.count({});
  }

  /**
   * @summary Obtener el dinero total pagado de las ventas del día
   * @description Recupera el dinero total pagado de las ventas del día.
   * @returns Dinero total pagado de las ventas del día recuperado exitosamente.
   */
  async getTotalPaidToday(): Promise<number> {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const result = await getManager()
      .createQueryBuilder()
      .select('SUM(travelSale.price)', 'totalPaidToday')
      .from(TravelSale, 'travelSale')
      .where('travelSale.createdAt BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getRawOne();

    return result.totalPaidToday || 0;
  }

  /**
   * @summary Obtener el dinero total pagado de todas las ventas
   * @description Recupera el dinero total pagado de todas las ventas.
   * @returns Dinero total pagado de todas las ventas recuperado exitosamente.
   */
  async getTotalPaid(): Promise<number> {
    const result = await getManager()
      .createQueryBuilder()
      .select('SUM(travelSale.price)', 'totalPaid')
      .from(TravelSale, 'travelSale')
      .getRawOne();

    return result.totalPaid || 0;
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'Se produjo un error inesperado. Por favor, revise los registros del servidor.',
    );
  }
}
