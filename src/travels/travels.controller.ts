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
import { TravelsService } from './travels.service';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums';

@Auth(Role.Manager)
@ApiBearerAuth()
@ApiTags('Viajes')
@Controller('travels')
export class TravelsController {
  constructor(private readonly travelsService: TravelsService) {}

  @Post()
  create(@Body() createTravelDto: CreateTravelDto) {
    return this.travelsService.create(createTravelDto);
  }

  @Get()
  findAll() {
    return this.travelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.travelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTravelDto: UpdateTravelDto) {
    return this.travelsService.update(+id, updateTravelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.travelsService.remove(+id);
  }

  /**
   * @summary Descargar un informe PDF de viajes
   * @description Descarga un informe en formato PDF que contiene la información de los viajes.
   * @param res Respuesta HTTP.
   * @returns Archivo PDF descargado.
   */
  @Get('pdf/download')
  @ApiOperation({
    summary: 'Descargar un informe PDF de viajes',
    description:
      'Descarga un informe en formato PDF que contiene la información de los viajes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo PDF de viajes descargado exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Error interno del servidor al generar el informe PDF de viajes.',
  })
  async downloadPDF(@Res() res): Promise<void> {
    try {
      const buffer = await this.travelsService.generateReportPDF();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=informe-viajes.pdf',
        'Content-Length': buffer.length.toString(),
      });

      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        error:
          'Error interno del servidor al generar el informe PDF de viajes.',
      });
    }
  }
}
