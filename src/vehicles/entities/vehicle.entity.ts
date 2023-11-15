import { ApiProperty } from '@nestjs/swagger';
import { Brand } from 'src/brands/entities/brand.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único del vehículo.',
    example: 'a6c1d9a0-72c4-4f39-91a0-17bca887e3ab',
  })
  id: string;

  @Column('varchar', { length: 255, nullable: true, unique: true })
  @ApiProperty({
    description: 'Número de la tarjeta de registro del vehículo.',
    example: 'AB123CD',
  })
  registrationCard: string;

  @Column('varchar', { length: 6, unique: true })
  @ApiProperty({
    description: 'Número de matrícula del vehículo.',
    example: 'XYZ789',
  })
  plate: string;

  @Column('varchar', { length: 255, nullable: true })
  @ApiProperty({
    description: 'Nombre del modelo del vehículo.',
    example: 'Transit 2022',
  })
  model: string;

  @Column('varchar', { length: 255, nullable: true, unique: true })
  @ApiProperty({
    description: 'Número de motor del vehículo.',
    example: 'E123456789CAR4D',
  })
  engineNumber: string;

  @Column('int', { default: 0, nullable: true })
  @ApiProperty({
    description: 'Año de fabricación del vehículo.',
    example: 2020,
  })
  manufacturingYear: number;

  @Column('int', { default: 0, nullable: true })
  @ApiProperty({
    description: 'Número de asientos en el vehículo.',
    example: 5,
  })
  numberOfSeats: number;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Indica si el vehículo está activo o no.',
    example: true,
  })
  isActive: boolean;

  @ManyToOne(() => Brand, (brand) => brand.id, {
    eager: true,
  })
  @ApiProperty({
    description: 'La marca del vehículo.',
    type: () => Brand,
  })
  brand: Brand;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha y hora de creación del vehículo.',
    example: '2023-09-29T12:00:00Z',
  })
  createdAt: Date;
}
