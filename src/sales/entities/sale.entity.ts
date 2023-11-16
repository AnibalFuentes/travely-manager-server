import { ApiProperty } from '@nestjs/swagger';
import { SaleStatus } from 'src/common/enums/sale-status.enum';
import { EmployeeSeller } from 'src/employees-sellers/entities/employee-seller.entity';
import { Office } from 'src/offices/entities/office.entity';
import { Travel } from 'src/travels/entities/travel.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único del viaje',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @ManyToOne(() => EmployeeSeller, (employeeSeller) => employeeSeller.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'La marca del vehículo.',
    type: () => EmployeeSeller,
  })
  seller: EmployeeSeller;

  @ManyToOne(() => Office, (office) => office.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'Oficina asociada a la venta.',
    type: () => Office,
  })
  office: Office;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  @ApiProperty({
    description: 'Monto total recibido por la venta.',
    example: 100.0,
  })
  amountReceived: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  @ApiProperty({
    description: 'Monto de cambio devuelto al cliente.',
    example: 20.0,
  })
  changeAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  @ApiProperty({
    description: 'Total a pagar en la venta.',
    example: 120.0,
  })
  totalAmount: number;

  @OneToMany(() => Travel, (travels) => travels.venta)
  travels: Travel[];

  @Column({ type: 'enum', enum: SaleStatus, default: SaleStatus.Pendiente })
  @ApiProperty({
    description: 'Estado actual de la venta.',
    enum: SaleStatus,
    default: SaleStatus.Pendiente,
  })
  status: SaleStatus;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora en que se creó la venta.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
