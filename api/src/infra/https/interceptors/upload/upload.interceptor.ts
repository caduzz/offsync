import { UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { memoryStorage } from "multer";

export type FileData = Express.Multer.File;

export function UploadInterceptor(fileFilter: MulterOptions['fileFilter']) {
  return UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter,
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
      storage: memoryStorage(), // Armazena em memória (buffer) em vez de disco
    })
  )
}