import { BadRequestError } from "src/errors/BadRequestError";
import { UploadInterceptor } from "./upload.interceptor";

export function UploadSoundInterceptor() {
  return UploadInterceptor(
    (req, file, callback) => {
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4']

      if (!allowedTypes.includes(file.mimetype)) {
        callback(new BadRequestError('Invalid file type: ' + file.mimetype), false)
      }
      callback(null, true)
    }
  );
}
