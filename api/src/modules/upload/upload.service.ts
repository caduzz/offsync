import { FileData } from '@infra/https/interceptors/upload/upload.interceptor';
import { Injectable } from '@nestjs/common';
import { FileType } from '@prisma/client';
import { FileUploadResponse } from 'src/models/files';

import { randomUUID } from 'crypto';
import { extname } from 'path';
import { WebDavService } from '@infra/webdav/webdav.service';

@Injectable()
export class UploadService {
  constructor(private readonly webdavService: WebDavService) {}

  async uploadImage(images: Array<FileData>): Promise<FileUploadResponse> {
    const filesMap = await Promise.all(
      images.map(async (file) => {
        // Gera nome único
        const uniqueName = `${file.fieldname}-${randomUUID()}${extname(file.originalname)}`;
        
        // Envia para WebDAV
        const url = await this.webdavService.uploadFile(
          file.buffer,
          uniqueName,
          'images'
        );

        return {
          type: FileType.image,
          url: url, // URL completa do WebDAV
        };
      })
    ) as FileUploadResponse['files'];

    return { files: filesMap };
  }

  async uploadVideo(video: Array<FileData>): Promise<FileUploadResponse> {
    const filesMap = await Promise.all(
      video.map(async (file) => {
        const uniqueName = `${file.fieldname}-${randomUUID()}${extname(file.originalname)}`;
        
        const url = await this.webdavService.uploadFile(
          file.buffer,
          uniqueName,
          'videos'
        );

        return {
          type: FileType.video,
          duration: file.size,
          url: url,
        };
      })
    ) as FileUploadResponse['files'];

    return { files: filesMap };
  }

  async uploadSound(sound: Array<FileData>): Promise<FileUploadResponse> {
    const filesMap = await Promise.all(
      sound.map(async (file) => {
        const uniqueName = `${file.fieldname}-${randomUUID()}${extname(file.originalname)}`;
        
        const url = await this.webdavService.uploadFile(
          file.buffer,
          uniqueName,
          'sounds'
        );

        return {
          type: FileType.sound,
          duration: file.size,
          url: url,
        };
      })
    ) as FileUploadResponse['files'];

    return { files: filesMap };
  }
}