import { Module } from '@nestjs/common';

import { PrismaModule } from './infra/prisma/prisma.module';
import { DataModule } from './modules/data/data.module';
import { UploadModule } from './modules/upload/upload.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [PrismaModule, UserModule, DataModule, UploadModule, AuthModule],
})
export class AppModule {}
