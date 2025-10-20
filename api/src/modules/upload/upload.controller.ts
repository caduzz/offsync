import { Controller, Post, UploadedFiles, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileData } from '@infra/https/interceptors/upload/upload.interceptor';
import { UploadVideoInterceptor } from '@infra/https/interceptors/upload/upload.video.interceptor';
import { UploadImageInterceptor } from '@infra/https/interceptors/upload/upload.image.interceptor';
import { UploadSoundInterceptor } from '@infra/https/interceptors/upload/upload.sound.interceptor';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Public } from '@infra/https/decorators';
import { AtGuard } from '@infra/https/guards';
import { FileUploadResponse } from '@models/files';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard)
  @Post('/image')
  @UploadImageInterceptor()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadImage(
    @UploadedFiles() image: FileData[]
  ): FileUploadResponse{
    return this.uploadService.uploadImage(image);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard)
  @Post('/video')
  @UploadVideoInterceptor()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadVideo(
    @UploadedFiles() video: FileData[]
  ) {
    return this.uploadService.uploadVideo(video);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AtGuard)
  @Post('/sound')
  @UploadSoundInterceptor()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadSound(
    @UploadedFiles() sound: FileData[]
  ): FileUploadResponse {
    return this.uploadService.uploadSound(sound);
  }

}