import { PartialType } from '@nestjs/swagger';
import { CreateTravelSaleDto } from './create-travel-sale.dto';

export class UpdateTravelSaleDto extends PartialType(CreateTravelSaleDto) {}
