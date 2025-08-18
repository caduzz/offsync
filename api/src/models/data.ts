import { Expose, Type } from "class-transformer";
import { Locale } from "./locale";
import { Region } from "./region";
import { Files } from "./files";
import { IsString, IsUUID } from "class-validator";

export class Data {
  @Expose()
  @IsUUID()
  @IsString()
  id: string
  
  @Expose()
  description: string

  @Expose()
  @Type(() => Locale)
  locale: Locale

  @Expose()
  @Type(() => Region)
  region: Region

  @Expose()
  @Type(() => Files)
  files: Files[]
}