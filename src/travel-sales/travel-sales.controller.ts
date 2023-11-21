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
}
