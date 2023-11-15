import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { SaleStatus } from 'src/common/enums/sale-status.enum';

export class CreateSaleDto {
  @ApiProperty({
    description: 'ID del vendedor asociado a la venta.',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  @IsNotEmpty()
  sellerId: string;

  @ApiProperty({
    description: 'Monto total recibido por la venta.',
    example: 100.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amountReceived: number;

  @ApiProperty({
    description: 'Monto de cambio devuelto al cliente.',
    example: 20.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  changeAmount: number;

  @ApiProperty({
    description: 'Total a pagar en la venta.',
    example: 120.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({
    description: 'Estado actual de la venta',
    enum: SaleStatus,
    default: SaleStatus.Pendiente,
  })
  @IsEnum(SaleStatus)
  @IsNotEmpty()
  status: SaleStatus;
}
