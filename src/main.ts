import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as compression from 'compression';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import { CustomLoggerService } from './logger/logger.service';
import { HttpLoggingInterceptor } from './interceptors/http-logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new CustomLoggerService()
  app.setGlobalPrefix('api/v1')
  app.enableCors();  // Enable CORS globally
  app.useGlobalInterceptors(new HttpLoggingInterceptor(logger));
  app.use(compression());
  app.use(helmet());

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Collaborative Note-Taking API')
      .setDescription('API documentation for the collaborative note-taking application')
      .setVersion('1.0')
      .addBearerAuth()  // Enable Bearer token authentication in Swagger
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document);
    Logger.log('Swagger docs available at /api/v1/docs');
  }


  await app.listen(3000, async() => {
    Logger.log(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
