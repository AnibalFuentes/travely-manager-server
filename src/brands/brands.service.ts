import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';

@Injectable()
export class BrandsService {
  private readonly logger = new Logger('BrandsService');

  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const { name } = createBrandDto;

    const existingBrand = await this.brandRepository.findOne({
      where: { name },
    });

    if (existingBrand) {
      throw new ConflictException('Ya existe una marca con el mismo nombre.');
    }

    try {
      const brand = this.brandRepository.create(createBrandDto);
      await this.brandRepository.save(brand);
      return brand;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.brandRepository.find();
  }

  async findOne(term: string) {
    let brand: Brand;
    if (isUUID(term)) {
      brand = await this.brandRepository.findOneBy({ id: term });
    } else {
      const queryBuilder =
        this.brandRepository.createQueryBuilder('documentType');
      brand = await queryBuilder
        .where('name = :term', {
          term: term.toLowerCase(),
        })
        .getOne();
    }
    if (!brand) throw new NotFoundException(`Marca con ${term} no encontrada`);
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.preload({
      id: id,
      ...updateBrandDto,
    });

    if (!brand) throw new NotFoundException(`Marca con ID ${id} no encontrada`);

    try {
      await this.brandRepository.save(brand);
      return brand;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const brand = await this.findOne(id);
    await this.brandRepository.remove(brand);
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'Ocurrió un error inesperado. Por favor, verifica los registros del servidor.',
    );
  }
}
