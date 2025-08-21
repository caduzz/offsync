import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DataController],
  providers: [DataService, JwtService],
})

export class DataModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes(DataController)
  }
}