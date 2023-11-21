import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { TravelSalesService } from './travel-sales.service';
import { CreateTravelSaleDto } from './dto/create-travel-sale.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TravelSale } from './entities/travel-sale.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Role } from 'src/common/enums';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth(Role.User)
@ApiBearerAuth()
@ApiTags('Venta de viajes')
@Controller('travel-sales')
export class TravelSalesController {
  constructor(private readonly travelSalesService: TravelSalesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva venta de viaje',
    description: 'Crea una nueva venta de viaje en el sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'La venta de viaje se ha creado exitosamente.',
    type: TravelSale,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  create(@Body() createTravelSaleDto: CreateTravelSaleDto) {
    return this.travelSalesService.create(createTravelSaleDto);
  }

  @Get(':idOrTerm')
  @ApiOperation({
    summary: 'Obtener una venta de viaje por ID o término de búsqueda',
    description:
      'Obtiene una venta de viaje por su ID único o un término de búsqueda.',
  })
  @ApiResponse({
    status: 200,
    description: 'Venta de viaje encontrada exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({ status: 404, description: 'Venta de viaje no encontrada' })
  findOne(@Param('idOrTerm', ParseUUIDPipe) idOrTerm: string) {
    return this.travelSalesService.findOne(idOrTerm);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener una lista de ventas de viaje',
    description:
      'Obtiene una lista de todas las ventas de viaje en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ventas de viaje obtenida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.travelSalesService.findAll(paginationDto);
  }

  /**
   * @summary Obtener la cantidad de ventas de viajes
   * @description Recupera la cantidad de ventas de viajes en el sistema.
   * @returns Cantidad de ventas de viajes recuperada exitosamente.
   */
  @Get('active/count')
  @ApiOperation({
    summary: 'Obtener la cantidad de ventas de viajes',
    description: 'Recupera la cantidad de ventas de viajes en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de ventas de viajes recuperada exitosamente.',
  })
  async getActiveUsersCount() {
    const activeUsersCount = await this.travelSalesService.count();
    return activeUsersCount;
  }

  /**
   * @summary Obtener el dinero total pagado de las ventas del día
   * @description Recupera el dinero total pagado de las ventas del día.
   * @returns Dinero total pagado de las ventas del día recuperado exitosamente.
   */
  @Get('total-paid/today')
  @ApiOperation({
    summary: 'Obtener el dinero total pagado de las ventas del día',
    description: 'Recupera el dinero total pagado de las ventas del día.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Dinero total pagado de las ventas del día recuperado exitosamente.',
  })
  async getTotalPaidToday() {
    const totalPaidToday = await this.travelSalesService.getTotalPaidToday();
    return totalPaidToday;
  }

  /**
   * @summary Obtener el dinero total pagado de todas las ventas
   * @description Recupera el dinero total pagado de todas las ventas.
   * @returns Dinero total pagado de todas las ventas recuperado exitosamente.
   */
  @Get('total-paid')
  @ApiOperation({
    summary: 'Obtener el dinero total pagado de todas las ventas',
    description: 'Recupera el dinero total pagado de todas las ventas.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Dinero total pagado de todas las ventas recuperado exitosamente.',
  })
  async getTotalPaid() {
    const totalPaid = await this.travelSalesService.getTotalPaid();
    return totalPaid;
  }
}
