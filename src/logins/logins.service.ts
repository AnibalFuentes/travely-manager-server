import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Login } from './entities/login.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');

@Injectable()
export class LoginsService {
  private readonly logger = new Logger('LoginsService');

  constructor(
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
  ) {}

  async create(user: User) {
    const login = new Login();
    login.user = user;
    return await this.loginRepository.save(login);
  }

  async findAll() {
    try {
      return await this.loginRepository.find({ relations: ['user'] });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByDate(date: Date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return await this.loginRepository
        .createQueryBuilder('login')
        .leftJoinAndSelect('login.user', 'user')
        .where('login.createdAt >= :startOfDay', { startOfDay })
        .andWhere('login.createdAt <= :endOfDay', { endOfDay })
        .getMany();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findTodayLogins() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return await this.loginRepository
        .createQueryBuilder('login')
        .leftJoinAndSelect('login.user', 'user')
        .where('login.createdAt >= :today', { today })
        .getMany();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findLoginsByUserId(userId: string) {
    try {
      return await this.loginRepository.find({
        relations: ['user'],
        where: {
          user: { id: userId },
        },
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async generateLoginReportPDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      // Configuración del documento
      const currentDate = new Date().toLocaleString();
      const title = 'Informe de Inicios de Sesión';
      const pageMargins = 50;

      // Configuración del encabezado
      doc.font('Helvetica-Bold').fontSize(18).text(title, { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Fecha de generación: ${currentDate}`, { align: 'center' });

      // Obtener todos los inicios de sesión desde la base de datos
      const logins = await this.loginRepository.find({
        relations: ['user'],
      });

      // Configuración de la tabla
      const loginTable = {
        title: 'Tabla de Inicios de Sesión',
        headers: ['Nº', 'Usuario', 'Fecha de Inicio de Sesión'],
        rows: logins.map((login, index) => [
          index + 1,
          login.user.email, // Ajustar según la estructura real de la entidad User
          this.formatDate(login.createdAt),
        ]),
      };

      // Calcular el ancho de la tabla
      const availableWidth = doc.page.width - pageMargins * 2;
      const columnsSize = loginTable.headers.map(
        () => availableWidth / loginTable.headers.length,
      );

      // Centrar la tabla en el documento
      const tableX = pageMargins;

      // Agregar la tabla al informe
      doc.moveDown();
      doc.table(loginTable, {
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
