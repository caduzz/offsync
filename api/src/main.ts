import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpErrorExceptionFilter } from '@infra/https/filters/error.filter';

import { limiter } from './config/limiter.config';

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

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()