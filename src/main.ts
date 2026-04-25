import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  app.enableShutdownHooks();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Portfolio Backend API')
    .setDescription('The API documentation for the Portfolio and Blog system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  
  const port = process.env.PORT ?? 8080;
  if (process.env.NODE_ENV !== 'production') {
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
  }

  process.on('SIGINT', () => {
    logger.warn('Application is shutting down (SIGINT)...');
  });

  return app.getHttpAdapter().getInstance();
}

export default bootstrap();
