import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único de la marca',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @Column('varchar', { length: 50, unique: true })
  @ApiProperty({
    description: 'El nombre de la marca',
    example: 'Mercedes Benz',
  })
  name: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.brand)
  vehicles: Vehicle[];
}
