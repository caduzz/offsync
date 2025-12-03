import { Global, Module } from '@nestjs/common';
import { WebDavService } from './webdav.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [WebDavService],
  exports: [WebDavService],
})
export class WebDavModule {}