import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Crear una instancia de la aplicación NestJS
  const app = await NestFactory.create(AppModule);

  // Configurar el prefijo global de la API
  app.setGlobalPrefix('api/v1');

  // Aplicar tuberías globales para la validación de datos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configurar Swagger para la documentación de la API
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Travely API')
    .setDescription('API RESTful para la gestión de viajes')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, swaggerDocument);

  // Configurar el puerto de escucha
  const PORT = process.env.PORT || 8000;

  // Habilitar CORS
  app.enableCors();

  // Iniciar la aplicación en el puerto especificado
  await app.listen(PORT);

  // Registrar en el log que la aplicación está en ejecución
  const logger = new Logger('Bootstrap');
  logger.log(`App is running on port: ${PORT}`);
}

// Iniciar la aplicación
bootstrap();
