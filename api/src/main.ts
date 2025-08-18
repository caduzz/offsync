import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpErrorExceptionFilter } from '@infra/filters/error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

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