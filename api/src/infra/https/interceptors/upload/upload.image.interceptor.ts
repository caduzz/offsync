import { BadRequestError } from "src/errors/BadRequestError";
import { UploadInterceptor } from "./upload.interceptor";

export function UploadImageInterceptor() {
  return UploadInterceptor(
    (req, file, callback) => {
      const allowedTypes = ['image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.mimetype)) {
        callback(new BadRequestError('Invalid file type: ' + file.mimetype), false)
      }
      callback(null, true)
    }
  );
}
