import { UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import { extname } from "path";

export type FileData = Express.Multer.File;

export function UploadInterceptor (fileFilter: MulterOptions['fileFilter']) {
  return UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter,
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
      storage: diskStorage({
        destination: './temp',
        filename: (req, file, callback) => {
          const fileName = `${file.fieldname}-${randomUUID()}${extname(file.originalname)}`;
          callback(null, fileName)
        }
      })
    })
  )
}