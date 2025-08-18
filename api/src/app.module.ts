import { Module } from '@nestjs/common';

import { PrismaModule } from './infra/prisma/prisma.module';
import { DataModule } from './modules/data/data.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [PrismaModule, DataModule, UploadModule],
})
export class AppModule {}
