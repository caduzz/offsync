import { Global, Module } from '@nestjs/common';
import { WebDavService } from './webdav.service';

@Global()
@Module({
  providers: [WebDavService],
  exports: [WebDavService],
})
export class WebDavModule {}