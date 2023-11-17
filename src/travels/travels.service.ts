import { Injectable } from '@nestjs/common';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');

@Injectable()
export class TravelsService {
  create(createTravelDto: CreateTravelDto) {
    return 'This action adds a new travel';
  }

  findAll() {
    return `This action returns all travels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} travel`;
  }

  update(id: number, updateTravelDto: UpdateTravelDto) {
    return `This action updates a #${id} travel`;
  }

  remove(id: number) {
    return `This action removes a #${id} travel`;
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
}
