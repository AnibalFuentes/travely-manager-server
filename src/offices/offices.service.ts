import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { Repository } from 'typeorm';
import { Office } from './entities/office.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');

@Injectable()
export class OfficesService {
  private readonly logger = new Logger('OfficesService');

  constructor(
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
  ) {}

  async create(createOfficeDto: CreateOfficeDto) {
    const { name } = createOfficeDto;

    const existingOffice = await this.officeRepository.findOne({
      where: { name },
    });

    if (existingOffice) {
      throw new ConflictException('Ya existe una oficina con el mismo nombre.');
    }

    try {
      const office = this.officeRepository.create(createOfficeDto);
      await this.officeRepository.save(office);
      return office;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.officeRepository.find();
  }

  async findOne(term: string) {
    let office: Office;
    if (isUUID(term)) {
      office = await this.officeRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.officeRepository.createQueryBuilder('office');
      office = await queryBuilder
        .where('name = :term', {
          term: term.toLowerCase(),
        })
        .getOne();
    }
    if (!office)
      throw new NotFoundException(`Oficina con ${term} no encontrada`);
    return office;
  }

  async update(id: string, updateOfficeDto: UpdateOfficeDto) {
    const office = await this.officeRepository.preload({
      id: id,
      ...updateOfficeDto,
    });

    if (!office)
      throw new NotFoundException(`Oficina con ID ${id} no encontrada`);

    try {
      await this.officeRepository.save(office);
      return office;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const office = await this.findOne(id);
    await this.officeRepository.remove(office);
  }

  async generateReportPDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      //todo
      doc.text('PDF Generado en nuestro servidor');
      doc.moveDown();
      doc.text(
        'Esto es un ejemplo de como generar un pdf en nuestro servidor nestjs',
      );

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
      doc.end();
    });

    return pdfBuffer;
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'Se produjo un error inesperado. Por favor, revise los registros del servidor.',
    );
  }
}
