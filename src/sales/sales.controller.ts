import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.User)
@ApiBearerAuth()
@ApiTags('Ventas')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }

  /**
   * @summary Descargar un informe PDF de ventas
   * @description Descarga un informe en formato PDF que contiene la información de las ventas.
   * @param res Respuesta HTTP.
   * @returns Archivo PDF descargado.
   */
  @Get('pdf/download')
  @ApiOperation({
    summary: 'Descargar un informe PDF de ventas',
    description:
      'Descarga un informe en formato PDF que contiene la información de las ventas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo PDF de ventas descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de ventas.',
  })
  async downloadPDF(@Res() res): Promise<void> {
    try {
      const buffer = await this.salesService.generateReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=informe-ventas.pdf',
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de ventas.',
      });
    }
  }
}
