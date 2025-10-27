import { FileData } from '@infra/https/interceptors/upload/upload.interceptor';
import { FileUploadResponse } from '@models/files';
import { Injectable } from '@nestjs/common';
import { FileType } from '@prisma/client';

@Injectable()
export class UploadService {

  uploadImage(images: Array<FileData>): FileUploadResponse {

    const filesMap = images.map(file => {
      return {
        type: FileType.image,
        url: `http://example.com/${file.filename}`
      }
    }) as FileUploadResponse['files'];

    return { files: filesMap }
  }

  uploadVideo(video: Array<FileData>): FileUploadResponse  {
    const filesMap = video.map(file => {
      return {
        type: FileType.video,
        duration: file.size,
        url: `http://example.com/${file.filename}`
      }
    }) as FileUploadResponse['files'];

    return {
      files: filesMap
    }
  }

  uploadSound(sound: Array<FileData>): FileUploadResponse  {

    const filesMap = sound.map(file => {
      return {
        type: FileType.sound,
        duration: file.size,
        url: `http://example.com/${file.filename}`
      }
    }) as FileUploadResponse['files'];

    return {
      files: filesMap
    }
  }
}
