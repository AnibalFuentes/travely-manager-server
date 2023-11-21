import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Total de la venta',
    example: 100.0,
  })
  @IsDecimal({ decimal_digits: '1,2' })
  amountDay: number;

  @ApiProperty({
    description: 'Numero totales de venta',
    example: 100.0,
  })
  @IsNumber()
  totalSales: number;
}
