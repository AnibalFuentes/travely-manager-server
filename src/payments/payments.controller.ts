import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Payment } from './entities/payment.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.Admin)
@ApiBearerAuth()
@ApiTags('Pagos')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los pagos',
    description: 'Devuelve una lista de todos los pagos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagos',
    type: Payment,
    isArray: true,
  })
  findAll() {
    return this.paymentsService.findAll();
  }
}
