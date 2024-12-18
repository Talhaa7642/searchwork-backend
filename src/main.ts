import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');

  app.use(express.json());
  const config = new DocumentBuilder()
    .setTitle('SearchWork API')
    .setDescription('The SearchWork API description')
    .setVersion('2.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = parseInt(process.env.PORT || '3000', 10); // Default to 3000 if PORT is not set
  await app.listen(PORT, () => {
    console.log('APP RUNNING ON PORT', PORT);
  });
}
bootstrap();
