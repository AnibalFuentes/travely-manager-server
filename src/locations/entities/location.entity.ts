import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único para la ubicación.',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({
    description: 'Departamento de la ubicación.',
    example: 'Cundinamarca',
  })
  department: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({
    description: 'Ciudad de la ubicación.',
    example: 'Bogotá',
  })
  city: string;

  @Column({ type: 'decimal', precision: 8, scale: 4 })
  @ApiProperty({
    description: 'Coordenada de latitud de la ubicación.',
    example: 4.7111,
  })
  latitude: number;

  @Column({ type: 'decimal', precision: 8, scale: 4 })
  @ApiProperty({
    description: 'Coordenada de longitud de la ubicación.',
    example: -74.0722,
  })
  longitude: number;
}
