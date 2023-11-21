import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para un pago',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({
    description: 'Total de la venta',
    example: 100.0,
  })
  amountDay: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @ApiProperty({
    description: 'Numero totales de venta',
    example: 100.0,
  })
  totalSales: number;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó el registro.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
