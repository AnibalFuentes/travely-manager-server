import { PartialType } from '@nestjs/swagger';
import { CreatePassengerTravelSaleDto } from './create-passenger-travel-sale.dto';

export class UpdatePassengerTravelSaleDto extends PartialType(
  CreatePassengerTravelSaleDto,
) {}
