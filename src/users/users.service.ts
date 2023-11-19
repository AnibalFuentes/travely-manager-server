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
import { Between, Repository } from 'typeorm';
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

  async generateUserReportPDF(): Promise<Buffer> {
    const users = await this.userRepository.find();
    return this.generateUserReportPDFWithUsers(users, 'Informe de Usuarios');
  }

  async generateUserReportTodayPDF(): Promise<Buffer> {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const users = await this.userRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    if (users.length === 0) {
      throw new NotFoundException(
        'No hay usuarios registrados hoy. No se generó ningún informe.',
      );
    }

    return this.generateUserReportPDFWithUsers(
      users,
      'Usuarios Registrados Hoy',
    );
  }

  async generateUserReportByCreationDatePDF(
    creationDate: Date,
  ): Promise<Buffer> {
    const startOfDay = new Date(creationDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(creationDate.setHours(23, 59, 59, 999));

    const users = await this.userRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    if (users.length === 0) {
      throw new NotFoundException(
        `No hay usuarios creados en la fecha especificada. No se generó ningún informe.`,
      );
    }

    return this.generateUserReportPDFWithUsers(
      users,
      `Usuarios Registrados el ${this.formatDate(creationDate)}`,
    );
  }

  private async generateUserReportPDFWithUsers(
    users: User[],
    title: string,
  ): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      // Configuración del documento
      const currentDate = new Date().toLocaleString();
      const pageMargins = 50;

      // Configuración del encabezado
      doc.font('Helvetica-Bold').fontSize(18).text(title, { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Fecha de generación: ${currentDate}`, { align: 'center' });

      // Configuración de la tabla
      const userTable = {
        title: 'Tabla de Usuarios',
        headers: ['Nº', 'Email', 'Rol', 'Activo', 'Fecha de Creación'],
        rows: users.map((user, index) => [
          index + 1,
          user.email,
          user.role,
          user.isActive ? 'Sí' : 'No',
          this.formatDate(user.createdAt), // Llamar a la función formatDate
        ]),
      };

      // Calcular el ancho de la tabla
      const availableWidth = doc.page.width - pageMargins * 2;
      const columnsSize = userTable.headers.map(
        () => availableWidth / userTable.headers.length,
      );

      // Centrar la tabla en el documento
      const tableX = pageMargins;

      // Agregar la tabla al informe
      doc.moveDown();
      doc.table(userTable, {
        x: tableX,
        columnsSize,
      });

      // Configuración del pie de página
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);

        // Agregar el paginado al final de la página
        doc
          .fontSize(10)
          .text(
            `Página ${i + 1} de ${totalPages}`,
            doc.page.width / 2,
            doc.page.height - pageMargins,
            { align: 'center' },
          );
      }

      // Agregar línea adicional al final del documento
      doc.moveDown();
      doc
        .fontSize(12)
        .text('Reporte generado por Travely Manager', { align: 'center' });

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

  // Función para formatear la fecha en el formato deseado
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'Ocurrió un error inesperado. Por favor, verifica los registros del servidor.',
    );
  }
}
