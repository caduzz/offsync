import { Controller, Post, UploadedFiles } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileData } from '@infra/https/interceptors/upload/upload.interceptor';
import { UploadVideoInterceptor } from '@infra/https/interceptors/upload/upload.video.interceptor';
import { UploadImageInterceptor } from '@infra/https/interceptors/upload/upload.image.interceptor';
import { UploadSoundInterceptor } from '@infra/https/interceptors/upload/upload.sound.interceptor';


@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/image')
  @UploadImageInterceptor()
  uploadImage(
    @UploadedFiles() image: FileData[]
  ){
    return this.uploadService.uploadImage(image);
  }

  @Post('/video')
  @UploadVideoInterceptor()
  uploadVideo(
    @UploadedFiles() video: FileData[]
  ){
    return this.uploadService.uploadVideo(video);
  }

  @Post('/sound')
  @UploadSoundInterceptor()
  uploadSound(
    @UploadedFiles() sound: FileData[]
  ){
    return this.uploadService.uploadSound(sound);
  }

}