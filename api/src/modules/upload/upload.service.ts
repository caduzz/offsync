import { FileData } from '@infra/https/interceptors/upload/upload.interceptor';
import { Injectable } from '@nestjs/common';
import { FileType } from '@prisma/client';

@Injectable()
export class UploadService {

  uploadImage(images: Array<FileData>) {
    const filesMap = images.map(file => {
      return {
        type: FileType.image,
        url: `http://example.com/${file.filename}`
      }
    });

    return {
      files: filesMap
    }
  }

  uploadVideo(video: Array<FileData>) {
    const filesMap = video.map(file => {
      return {
        type: FileType.video,
        duration: file.size,
        url: `http://example.com/${file.filename}`
      }
    });

    return {
      files: filesMap
    }
  }

  uploadSound(sound: Array<FileData>) {
    const filesMap = sound.map(file => {
      return {
        type: FileType.sound,
        duration: file.size,
        url: `http://example.com/${file.filename}`
      }
    });

    return {
      files: filesMap
    }
  }
}
