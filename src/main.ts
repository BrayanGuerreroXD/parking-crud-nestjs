import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { CORS } from './constants/cors';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './exception-handler/global.exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as express from 'express';

async function bootstrap() {

  // Check required environment variables
  const requiredEnvVars = ['PORT', 'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });

  // Uncaught exception and unhandled rejection handlers
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
  
  const app = await NestFactory.create(AppModule);

  app.use(morgan(process.env.MORGAN_FORMAT || 'dev'));

  app.useGlobalPipes(new ValidationPipe({
    transformOptions: {
      enableImplicitConversion: true
    }
  }));

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors( new ClassSerializerInterceptor(reflector) );

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors(CORS);

  const config = new DocumentBuilder()
    .setTitle('PARKING CRUD API')
    .setDescription('The Rest API manages vehicle parking, allows partner creation for vehicle entry and exit, and uses JWT tokens with role-based access control (ADMIN and SOCIO) expiring every 6 hours, built with NestJS and PostgreSQL')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header'},
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Save the YAML file
  const yamlDocument = yaml.dump(document);
  fs.writeFileSync('./swagger.yaml', yamlDocument);

  // Serve the YAML file via an endpoint
  app.use('/swagger.yaml', express.static('swagger.yaml'));

  await app.listen(port);

  require('simple-banner').set("PARKING CRUD API", `
    Application is running on: ${await app.getUrl()}
    Swagger docs are available at: ${await app.getUrl()}/docs
    Swagger YAML is available at: ${await app.getUrl()}/swagger.yaml
  `, 1);
}

bootstrap();