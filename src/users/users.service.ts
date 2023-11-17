import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate as isUUID } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');
@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existingUser = await this.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        `El correo electrónico "${email}" ya está en uso`,
      );
    }

    try {
      return await this.userRepository.save(createUserDto);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(term: string) {
    let user: User;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      user = await queryBuilder
        .where('email = :term', {
          term: term.toLowerCase(),
        })
        .getOne();
    }

    if (!user) throw new NotFoundException(`Usuario con ${term} no encontrado`);
    return user;
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findByUsernameWithPassword(username: string) {
    return this.userRepository.findOne({
      where: { email: username },
      select: ['id', 'email', 'password', 'role', 'isActive'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
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
      'Ocurrió un error inesperado. Por favor, verifica los registros del servidor.',
    );
  }
}
