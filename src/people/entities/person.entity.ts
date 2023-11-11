import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, Gender } from 'src/common/enums/index';
import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class Person {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Identificador único de la persona',
    example: 'e87ef3f1-1f2a-4b6f-b381-4ea3c40b6d3a',
  })
  id: string;

  @Column('enum', {
    enum: Gender,
    nullable: true,
  })
  @ApiProperty({
    description: 'Tipo de persona: Masculino o Femenino',
    enum: Gender,
    enumName: 'Gender',
  })
  gender: Gender;

  @Column('enum', {
    enum: DocumentType,
    nullable: true,
  })
  @ApiProperty({
    description: 'Tipo de documento: CedulaCiudadania, CedulaExtranjeria, Pasaporte, etc.',
    enum: DocumentType,
    enumName: 'DocumentType',
  })
  documentType: DocumentType;

  @Column('varchar', { length: 20 })
  @ApiProperty({ description: 'Primer nombre de la persona', example: 'John' })
  firstName: string;

  @Column('varchar', { length: 20, nullable: true })
  @ApiProperty({
    description: 'Segundo nombre de la persona',
    example: 'James',
  })
  middleName: string;

  @Column('varchar', { length: 20 })
  @ApiProperty({ description: 'Apellido de la persona', example: 'Doe' })
  lastName: string;

  @Column('varchar', { length: 20, nullable: true })
  @ApiProperty({
    description: 'Segundo apellido de la persona',
    example: 'Smith',
  })
  secondLastName: string;

  @Column('varchar', { length: 20, nullable: true, unique: true })
  @ApiProperty({
    description: 'Número de identificación de la persona',
    example: '1234567890',
  })
  identificationNumber: string;

  @Column('date', { nullable: true })
  @ApiProperty({
    description: 'Fecha de nacimiento de la persona',
    example: '1990-01-15',
  })
  birthdate: Date;

  @Column('varchar', { length: 50, nullable: true })
  @ApiProperty({
    description: 'Dirección de correo electrónico de la persona',
    example: 'john.doe@example.com',
  })
  email: string;

  @Column('varchar', { length: 15, nullable: true })
  @ApiProperty({
    description: 'Número de teléfono móvil de la persona',
    example: '555-555-5555',
  })
  mobilePhone: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha de creación del registro de la persona',
    example: '2023-09-28T10:00:00Z',
  })
  createdAt: Date;
}