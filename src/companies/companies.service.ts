import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger('CompaniesService');

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  private async getCompanyById(id: string): Promise<Company> {
    return this.companyRepository.findOneBy({ id: id });
  }

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = this.companyRepository.create(createCompanyDto);
      await this.companyRepository.save(company);
      return company;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const [companys, total] = await this.companyRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    return {
      companys,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string) {
    const company = await this.getCompanyById(id);

    if (!company) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrado`);
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.getCompanyById(id);

    if (!company) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrado`);
    }

    try {
      this.companyRepository.merge(company, updateCompanyDto);
      await this.companyRepository.save(company);
      return company;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const company = await this.getCompanyById(id);

    if (!company) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrado`);
    }

    try {
      await this.companyRepository.remove(company);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'Se produjo un error inesperado. Por favor, revise los registros del servidor.',
    );
  }
}
