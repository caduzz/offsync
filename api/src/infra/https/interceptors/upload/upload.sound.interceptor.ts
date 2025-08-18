import { BadRequestError } from "src/errors/BadRequestError";
import { UploadInterceptor } from "./upload.interceptor";

export function UploadSoundInterceptor() {
  return UploadInterceptor(
    (req, file, callback) => {
      const allowedTypes = ['audio/mpeg', 'audio/wav']
      if (!allowedTypes.includes(file.mimetype)) {
        callback(new BadRequestError('Invalid file type: ' + file.mimetype), false)
      }
      callback(null, true)
    }
  );
}
