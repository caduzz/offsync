import { Expose } from "class-transformer";
import { IsNumber, IsString, IsUUID } from "class-validator";

export enum FileType {
  IMAGE = "image",
  VIDEO = "video",
  SOUND = "sound"
}

export class Files {
  @Expose()
  @IsUUID()
  @IsString()
  id: string
  
  @Expose()
  type: FileType

  @Expose()
  @IsNumber()
  duration?: number

  @Expose()
  @IsString()
  url: string
}