import { Module } from '@nestjs/common';

import { PrismaModule } from './infra/prisma/prisma.module';
import { DataModule } from './modules/data/data.module';
import { UploadModule } from './modules/upload/upload.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RegionModule } from './modules/region/region.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from '@infra/https/guards';
import { WebDavModule } from '@infra/webdav/webdav.module';

@Module({
  imports: [
    PrismaModule,
    WebDavModule,
    UserModule,
    DataModule,
    UploadModule,
    AuthModule,
    RegionModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    }
  ]
})
export class AppModule {}
