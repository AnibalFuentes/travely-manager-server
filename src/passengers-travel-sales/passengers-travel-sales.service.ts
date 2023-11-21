import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePassengerTravelSaleDto } from './dto/create-passenger-travel-sale.dto';
import { UpdatePassengerTravelSaleDto } from './dto/update-passenger-travel-sale.dto';
import { PassengerTravelSale } from './entities/passenger-travel-sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelSalesService } from 'src/travel-sales/travel-sales.service';
import { PassengersService } from 'src/passengers/passengers.service';
import { validate as isUUID } from 'uuid';

@Injectable()
export class PassengersTravelSalesService {
  private readonly logger = new Logger('PassengerTravelSalesService');

  constructor(
    @InjectRepository(PassengerTravelSale)
    private readonly passengerTravelSaleRepository: Repository<PassengerTravelSale>,
    private readonly passengersService: PassengersService,
    private readonly travelSalesService: TravelSalesService,
  ) {}

  async create(createPassengerTravelSaleDto: CreatePassengerTravelSaleDto) {
    const { passengerId, travelSaleId } = createPassengerTravelSaleDto;

    if (!isUUID(passengerId, 4)) {
      throw new BadRequestException(
        'Identificador de pasajero no válido. Debe ser un UUID válido.',
      );
    }

    const passenger = await this.passengersService.findOne(passengerId);

    if (!passenger) {
      throw new BadRequestException('El pasajero especificado no existe.');
    }

    if (!isUUID(travelSaleId, 4)) {
      throw new BadRequestException(
        'Identificador de venta de viaje no válido. Debe ser un UUID válido.',
      );
    }

    const travelSale = await this.travelSalesService.findOne(travelSaleId);

    if (!travelSale) {
      throw new BadRequestException(
        'La venta de viaje especificada no existe.',
      );
    }

    try {
      const passengerTravelSale = this.passengerTravelSaleRepository.create({
        passenger: passenger,
        travel: travelSale,
      });

      await this.passengerTravelSaleRepository.save(passengerTravelSale);
      return passengerTravelSale;
    } catch (error) {
      this.logger.error(error);

      if (error.code === '23505') {
        throw new ConflictException(
          'Ya existe una asignación de pasajero para esta venta de viaje.',
        );
      }

      throw new BadRequestException(
        'Error al crear la asignación de pasajero. Por favor, revise los datos proporcionados.',
      );
    }
  }

  findAll() {
    return this.passengerTravelSaleRepository.find();
  }

  findOne(id: string) {
    return this.passengerTravelSaleRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updatePassengerTravelSaleDto: UpdatePassengerTravelSaleDto,
  ) {
    const passengerTravelSale =
      await this.passengerTravelSaleRepository.findOneBy({ id });

    if (!passengerTravelSale) {
      throw new NotFoundException(
        'La asignación de viaje de pasajero especificada no existe.',
      );
    }

    const { passengerId, travelSaleId } = updatePassengerTravelSaleDto;

    if (passengerId) {
      passengerTravelSale.passenger =
        await this.passengersService.findOne(passengerId);
      if (!passengerTravelSale.passenger) {
        throw new BadRequestException('El pasajero especificado no existe.');
      }
    }

    if (travelSaleId) {
      passengerTravelSale.travel =
        await this.travelSalesService.findOne(travelSaleId);
      if (!passengerTravelSale.travel) {
        throw new BadRequestException(
          'La venta de viaje especificada no existe.',
        );
      }
    }

    try {
      await this.passengerTravelSaleRepository.save(passengerTravelSale);
      return passengerTravelSale;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        'Error al actualizar la asignación de viaje de pasajero. Por favor, revise los datos proporcionados.',
      );
    }
  }

  async remove(id: string) {
    const passengerTravelSale =
      await this.passengerTravelSaleRepository.findOneBy({ id });

    if (!passengerTravelSale) {
      throw new BadRequestException(
        'La asignación de vehículo especificada no existe.',
      );
    }

    await this.passengerTravelSaleRepository.remove(passengerTravelSale);
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
