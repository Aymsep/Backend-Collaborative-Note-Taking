import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as compression from 'compression';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import * as csurf from 'csurf';

dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1')
  app.enableCors();  // Enable CORS globally
  app.use(compression());
  app.use(helmet());
  // app.use(csurf());

  await app.listen(3000, async() => {
    Logger.log(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
