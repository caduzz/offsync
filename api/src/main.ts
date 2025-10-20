import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpErrorExceptionFilter } from '@infra/https/filters/error.filter';

import { limiter } from './config/limiter.config';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.cofing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(limiter)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  )
  app.useGlobalFilters(
    new HttpErrorExceptionFilter()
  )

  app.enableCors()
  app.enableShutdownHooks()

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()