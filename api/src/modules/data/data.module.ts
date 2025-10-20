import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';

@Module({
  controllers: [DataController],
  providers: [DataService],
})

export class DataModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes(DataController)
  }
}