import { BadRequestError } from "src/errors/BadRequestError";
import { UploadInterceptor } from "./upload.interceptor";

export function UploadVideoInterceptor() {
  return UploadInterceptor(
    (req, file, callback) => {
      const allowedTypes = ['video/mp4', 'video/x-m4v', 'video/x-msvideo', 'video/webm']
      if (!allowedTypes.includes(file.mimetype)) {
        callback(new BadRequestError('Invalid file type: ' + file.mimetype), false)
      }
      callback(null, true)
    }
  );
}
