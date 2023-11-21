import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PassengersTravelSalesService } from './passengers-travel-sales.service';
import { CreatePassengerTravelSaleDto } from './dto/create-passenger-travel-sale.dto';
import { UpdatePassengerTravelSaleDto } from './dto/update-passenger-travel-sale.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PassengerTravelSale } from './entities/passenger-travel-sale.entity';
import { Role } from 'src/common/enums';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth(Role.Admin)
@ApiBearerAuth()
@ApiTags('Asignaciones de viajes a pasajeros')
@Controller('passengers-travel-sales')
export class PassengersTravelSalesController {
  constructor(
    private readonly passengersTravelSalesService: PassengersTravelSalesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva venta de viaje para pasajero',
    description: 'Crea una nueva venta de viaje para pasajero en el sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'La venta de viaje para pasajero se ha creado exitosamente.',
    type: PassengerTravelSale,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  create(@Body() createPassengerTravelSaleDto: CreatePassengerTravelSaleDto) {
    return this.passengersTravelSalesService.create(
      createPassengerTravelSaleDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener una lista de ventas de viaje para pasajeros',
    description:
      'Obtiene una lista de todas las ventas de viaje para pasajeros en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista de ventas de viaje para pasajeros obtenida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  findAll() {
    return this.passengersTravelSalesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una venta de viaje para pasajero por ID',
    description: 'Obtiene una venta de viaje para pasajero por su ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Venta de viaje para pasajero encontrada exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({
    status: 404,
    description: 'Venta de viaje para pasajero no encontrada',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.passengersTravelSalesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una venta de viaje para pasajero por ID',
    description:
      'Actualiza una venta de viaje para pasajero existente por su ID.',
  })
  @ApiResponse({
    status: 200,
    description:
      'La venta de viaje para pasajero se ha actualizado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({
    status: 404,
    description: 'Venta de viaje para pasajero no encontrada',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePassengerTravelSaleDto: UpdatePassengerTravelSaleDto,
  ) {
    return this.passengersTravelSalesService.update(
      id,
      updatePassengerTravelSaleDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una venta de viaje para pasajero por ID',
    description:
      'Elimina una venta de viaje para pasajero del sistema por su ID.',
  })
  @ApiResponse({
    status: 204,
    description:
      'La venta de viaje para pasajero se ha eliminado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  @ApiResponse({
    status: 404,
    description: 'Venta de viaje para pasajero no encontrada',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.passengersTravelSalesService.remove(id);
  }
}
