import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.use(express.json());
  const config = new DocumentBuilder()
    .setTitle('Search Work API')
    .setDescription('Helps test the Search Work API endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  const PORT = parseInt(process.env.PORT || '3000', 10); // Default to 3000 if PORT is not set
  await app.listen(PORT, () => {
    console.log('APP RUNNING ON PORT', PORT);
  });
}
bootstrap();